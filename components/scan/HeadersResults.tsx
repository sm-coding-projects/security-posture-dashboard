'use client';

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Info,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { HeadersResult, HeaderInfo } from '@/types';

interface HeadersResultsProps {
  headersResult: HeadersResult | null;
  className?: string;
}

interface HeaderConfig {
  name: string;
  displayName: string;
  importance: 'critical' | 'high' | 'medium';
  description: string;
  implementationExample: string;
  moreInfo: string;
}

const HEADER_CONFIG: Record<string, HeaderConfig> = {
  'strict-transport-security': {
    name: 'strict-transport-security',
    displayName: 'Strict Transport Security (HSTS)',
    importance: 'critical',
    description: 'Forces browsers to use HTTPS connections, preventing protocol downgrade attacks and cookie hijacking.',
    implementationExample: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    moreInfo: 'HSTS protects against man-in-the-middle attacks by ensuring all connections use HTTPS. The preload directive submits your domain to browser preload lists.',
  },
  'content-security-policy': {
    name: 'content-security-policy',
    displayName: 'Content Security Policy (CSP)',
    importance: 'critical',
    description: 'Prevents cross-site scripting (XSS) attacks by controlling which resources can be loaded.',
    implementationExample: "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    moreInfo: 'CSP is one of the most effective defenses against XSS attacks. Start with a restrictive policy and gradually allow necessary resources.',
  },
  'x-frame-options': {
    name: 'x-frame-options',
    displayName: 'X-Frame-Options',
    importance: 'high',
    description: 'Prevents clickjacking attacks by controlling whether your site can be embedded in frames.',
    implementationExample: 'X-Frame-Options: DENY',
    moreInfo: 'This header has been superseded by CSP frame-ancestors directive, but is still widely supported and recommended for compatibility.',
  },
  'x-content-type-options': {
    name: 'x-content-type-options',
    displayName: 'X-Content-Type-Options',
    importance: 'high',
    description: 'Prevents MIME type sniffing attacks by forcing browsers to respect declared content types.',
    implementationExample: 'X-Content-Type-Options: nosniff',
    moreInfo: 'MIME sniffing can lead to security vulnerabilities when browsers incorrectly interpret file types. This header prevents that behavior.',
  },
  'referrer-policy': {
    name: 'referrer-policy',
    displayName: 'Referrer Policy',
    importance: 'medium',
    description: 'Controls how much referrer information is included with requests.',
    implementationExample: 'Referrer-Policy: strict-origin-when-cross-origin',
    moreInfo: 'This helps protect user privacy by limiting referrer information sent to external sites while maintaining functionality.',
  },
  'permissions-policy': {
    name: 'permissions-policy',
    displayName: 'Permissions Policy',
    importance: 'medium',
    description: 'Controls which browser features and APIs can be used by the page.',
    implementationExample: 'Permissions-Policy: camera=(), microphone=(), geolocation=()',
    moreInfo: 'This header allows fine-grained control over browser features, helping to prevent unauthorized access to sensitive APIs.',
  },
  'x-xss-protection': {
    name: 'x-xss-protection',
    displayName: 'X-XSS-Protection',
    importance: 'medium',
    description: 'Legacy header that enabled browser XSS filtering (now deprecated in favor of CSP).',
    implementationExample: 'X-XSS-Protection: 1; mode=block',
    moreInfo: 'This header is deprecated and should be replaced with a strong Content Security Policy. Some browsers have removed support.',
  },
  'expect-ct': {
    name: 'expect-ct',
    displayName: 'Expect-CT',
    importance: 'medium',
    description: 'Enforces Certificate Transparency requirements (deprecated).',
    implementationExample: 'Expect-CT: max-age=86400, enforce',
    moreInfo: 'This header has been deprecated as Certificate Transparency is now enforced by default in modern browsers.',
  },
  'cross-origin-embedder-policy': {
    name: 'cross-origin-embedder-policy',
    displayName: 'Cross-Origin Embedder Policy (COEP)',
    importance: 'medium',
    description: 'Prevents documents from loading cross-origin resources that do not grant permission.',
    implementationExample: 'Cross-Origin-Embedder-Policy: require-corp',
    moreInfo: 'COEP is required for using SharedArrayBuffer and other high-resolution timer APIs safely.',
  },
  'cross-origin-opener-policy': {
    name: 'cross-origin-opener-policy',
    displayName: 'Cross-Origin Opener Policy (COOP)',
    importance: 'medium',
    description: 'Isolates browsing context from cross-origin documents.',
    implementationExample: 'Cross-Origin-Opener-Policy: same-origin',
    moreInfo: 'COOP helps protect against Spectre-like attacks by isolating your document from potential attackers.',
  },
  'cross-origin-resource-policy': {
    name: 'cross-origin-resource-policy',
    displayName: 'Cross-Origin Resource Policy (CORP)',
    importance: 'medium',
    description: 'Protects resources from being loaded by other origins.',
    implementationExample: 'Cross-Origin-Resource-Policy: same-origin',
    moreInfo: 'CORP provides protection against side-channel attacks like Spectre by controlling resource loading.',
  },
};

const IMPORTANCE_ORDER = ['critical', 'high', 'medium'] as const;
const IMPORTANCE_LABELS = {
  critical: 'Critical Security Headers',
  high: 'High Priority Headers',
  medium: 'Additional Security Headers',
} as const;

export const HeadersResults: React.FC<HeadersResultsProps> = ({ headersResult, className }) => {
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    critical: true,
    high: true,
    medium: false,
  });
  const [expandedHeaders, setExpandedHeaders] = useState<Record<string, boolean>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});

  if (!headersResult) {
    return (
      <div className={cn('p-8 text-center text-gray-500 dark:text-gray-400', className)}>
        <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No headers results available</p>
        <p className="text-sm">Run a scan to view security headers analysis.</p>
      </div>
    );
  }

  const copyToClipboard = async (text: string, headerName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHeader(headerName);
      setTimeout(() => setCopiedHeader(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const toggleGroup = (importance: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [importance]: !prev[importance],
    }));
  };

  const toggleHeaderDetails = (headerName: string) => {
    setExpandedHeaders(prev => ({
      ...prev,
      [headerName]: !prev[headerName],
    }));
  };

  const toggleValueVisibility = (headerName: string) => {
    setShowValues(prev => ({
      ...prev,
      [headerName]: !prev[headerName],
    }));
  };

  const groupedHeaders = IMPORTANCE_ORDER.reduce((groups, importance) => {
    groups[importance] = Object.entries(headersResult.headers).filter(([headerName]) =>
      HEADER_CONFIG[headerName]?.importance === importance
    );
    return groups;
  }, {} as Record<string, Array<[string, HeaderInfo]>>);

  const renderHeaderRow = (headerName: string, headerInfo: HeaderInfo) => {
    const config = HEADER_CONFIG[headerName];
    if (!config) return null;

    const isExpanded = expandedHeaders[headerName];
    const showValue = showValues[headerName];

    return (
      <div key={headerName} className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {headerInfo.present ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{config.displayName}</h4>
                <Badge
                  variant={headerInfo.present ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {headerInfo.present ? 'Present' : 'Missing'}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    config.importance === 'critical' ? 'border-red-300 text-red-600 dark:text-red-400' :
                    config.importance === 'high' ? 'border-orange-300 text-orange-600 dark:text-orange-400' :
                    'border-blue-300 text-blue-600 dark:text-blue-400'
                  )}
                >
                  {config.importance}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {config.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHeaderDetails(headerName)}
              className="h-8 w-8 p-0"
            >
              <Info className="w-4 h-4" />
            </Button>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Description</h5>
              <p className="text-sm">{config.moreInfo}</p>
            </div>

            {headerInfo.present && headerInfo.value && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Value</h5>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleValueVisibility(headerName)}
                      className="h-6 w-6 p-0"
                    >
                      {showValue ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(headerInfo.value!, headerName)}
                      className="h-6 w-6 p-0"
                    >
                      {copiedHeader === headerName ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-2">
                  <code className="text-xs font-mono break-all">
                    {showValue ? headerInfo.value : '••••••••••••••••••••'}
                  </code>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {headerInfo.present ? 'Recommended Value' : 'Implementation Example'}
                </h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(config.implementationExample, `${headerName}-example`)}
                  className="h-6 w-6 p-0"
                >
                  {copiedHeader === `${headerName}-example` ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 border border-blue-200 dark:border-blue-800">
                <code className="text-xs font-mono break-all text-blue-800 dark:text-blue-200">
                  {config.implementationExample}
                </code>
              </div>
            </div>

            {headerInfo.recommendation && (
              <div>
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Recommendation</h5>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">{headerInfo.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overall Score */}
      <div className="flex items-center justify-center">
        <div
          className={cn(
            'flex items-center gap-3 px-8 py-4 rounded-2xl border-2 shadow-lg',
            getScoreBgColor(headersResult.score)
          )}
        >
          <Shield className={cn('w-6 h-6', getScoreColor(headersResult.score))} />
          <div className="text-center">
            <div className={cn('text-4xl font-bold', getScoreColor(headersResult.score))}>
              {headersResult.score}
            </div>
            <div className="text-sm opacity-90">Headers Score</div>
          </div>
        </div>
      </div>

      {/* Headers by Importance */}
      {IMPORTANCE_ORDER.map((importance) => {
        const headers = groupedHeaders[importance];
        if (headers.length === 0) return null;

        const isExpanded = expandedGroups[importance];
        const presentCount = headers.filter(([, info]) => info.present).length;
        const totalCount = headers.length;

        return (
          <Card key={importance}>
            <CardHeader className="cursor-pointer" onClick={() => toggleGroup(importance)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{IMPORTANCE_LABELS[importance]}</CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      importance === 'critical' ? 'border-red-300 text-red-600 dark:text-red-400' :
                      importance === 'high' ? 'border-orange-300 text-orange-600 dark:text-orange-400' :
                      'border-blue-300 text-blue-600 dark:text-blue-400'
                    )}
                  >
                    {presentCount}/{totalCount} implemented
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <CardDescription>
                {importance === 'critical' && 'Essential headers that provide fundamental security protections'}
                {importance === 'high' && 'Important headers that significantly improve security posture'}
                {importance === 'medium' && 'Additional headers for enhanced security and privacy'}
              </CardDescription>
            </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-4">
                {headers.map(([headerName, headerInfo]) => renderHeaderRow(headerName, headerInfo))}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default HeadersResults;