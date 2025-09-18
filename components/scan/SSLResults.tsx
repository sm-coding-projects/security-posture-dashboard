'use client';

import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Key,
  FileText,
  Settings,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SSLResult, SSLVulnerability } from '@/types';

interface SSLResultsProps {
  sslResult: SSLResult | null;
  className?: string;
}

export const SSLResults: React.FC<SSLResultsProps> = ({ sslResult, className }) => {
  if (!sslResult) {
    return (
      <div className={cn('p-8 text-center text-gray-500 dark:text-gray-400', className)}>
        <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No SSL results available</p>
        <p className="text-sm">Run a scan to view SSL certificate details and security analysis.</p>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A':
        return 'bg-green-500 text-white border-green-600';
      case 'B':
        return 'bg-blue-500 text-white border-blue-600';
      case 'C':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'D':
        return 'bg-orange-500 text-white border-orange-600';
      case 'F':
        return 'bg-red-500 text-white border-red-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getGradeIcon = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A':
        return <ShieldCheck className="w-6 h-6" />;
      case 'B':
        return <Shield className="w-6 h-6" />;
      case 'C':
      case 'D':
        return <ShieldAlert className="w-6 h-6" />;
      case 'F':
        return <ShieldX className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getDaysRemaining = (validTo: Date) => {
    const now = new Date();
    const diffTime = new Date(validTo).getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSeverityColor = (severity: SSLVulnerability['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'LOW':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getSeverityIcon = (severity: SSLVulnerability['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="w-4 h-4" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIUM':
        return <AlertCircle className="w-4 h-4" />;
      case 'LOW':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const daysRemaining = getDaysRemaining(sslResult.certificate.validTo);

  return (
    <div className={cn('space-y-6', className)}>
      {/* SSL Grade Badge */}
      <div className="flex items-center justify-center">
        <div
          className={cn(
            'flex items-center gap-3 px-8 py-4 rounded-2xl border-2 shadow-lg',
            getGradeColor(sslResult.grade)
          )}
        >
          {getGradeIcon(sslResult.grade)}
          <div className="text-center">
            <div className="text-4xl font-bold">{sslResult.grade}</div>
            <div className="text-sm opacity-90">SSL Rating</div>
          </div>
        </div>
      </div>

      {/* Certificate Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Certificate Information
          </CardTitle>
          <CardDescription>SSL certificate details and validity information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject</div>
              <div className="text-sm">{sslResult.certificate.subject}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Issuer</div>
              <div className="text-sm">{sslResult.certificate.issuer}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Common Name</div>
              <div className="text-sm">{sslResult.certificate.commonName}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Serial Number</div>
              <div className="text-sm font-mono">{sslResult.certificate.serialNumber}</div>
            </div>
          </div>

          {/* Validity Dates */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Valid From</div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {formatDate(sslResult.certificate.validFrom)}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  daysRemaining > 30
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : daysRemaining > 7
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                )}
              >
                <Clock
                  className={cn(
                    'w-5 h-5',
                    daysRemaining > 30
                      ? 'text-green-600 dark:text-green-400'
                      : daysRemaining > 7
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                />
                <div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      daysRemaining > 30
                        ? 'text-green-800 dark:text-green-200'
                        : daysRemaining > 7
                        ? 'text-yellow-800 dark:text-yellow-200'
                        : 'text-red-800 dark:text-red-200'
                    )}
                  >
                    Valid Until
                  </div>
                  <div
                    className={cn(
                      'text-sm',
                      daysRemaining > 30
                        ? 'text-green-600 dark:text-green-400'
                        : daysRemaining > 7
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {formatDate(sslResult.certificate.validTo)} ({daysRemaining} days)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Certificate Details */}
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Key Size</div>
              <div className="text-sm">{sslResult.certificate.keySize} bits</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Signature Algorithm</div>
              <div className="text-sm">{sslResult.certificate.signatureAlgorithm}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Fingerprint</div>
              <div className="text-xs font-mono break-all">{sslResult.certificate.fingerprint}</div>
            </div>
          </div>

          {/* Subject Alternative Names */}
          {sslResult.certificate.subjectAlternativeNames.length > 0 && (
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Subject Alternative Names
              </div>
              <div className="flex flex-wrap gap-2">
                {sslResult.certificate.subjectAlternativeNames.map((san, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {san}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Supported Protocols
          </CardTitle>
          <CardDescription>SSL/TLS protocol versions and their security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sslResult.protocols.map((protocol, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  protocol.enabled
                    ? protocol.secure
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                )}
              >
                <div className="flex items-center gap-2">
                  {protocol.enabled ? (
                    protocol.secure ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {protocol.name} {protocol.version}
                  </span>
                </div>
                <Badge
                  variant={protocol.enabled ? (protocol.secure ? 'default' : 'destructive') : 'secondary'}
                  className="text-xs"
                >
                  {protocol.enabled ? (protocol.secure ? 'Secure' : 'Insecure') : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cipher Suites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Cipher Suites
          </CardTitle>
          <CardDescription>Supported encryption algorithms and their strength</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sslResult.cipherSuites.slice(0, 5).map((cipher, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{cipher.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {cipher.keyExchange} | {cipher.authentication} | {cipher.encryption} | {cipher.mac}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-sm font-medium">{cipher.strength} bits</div>
                  <Badge
                    variant={cipher.strength >= 256 ? 'default' : cipher.strength >= 128 ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {cipher.strength >= 256 ? 'Strong' : cipher.strength >= 128 ? 'Medium' : 'Weak'}
                  </Badge>
                </div>
              </div>
            ))}
            {sslResult.cipherSuites.length > 5 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                ... and {sslResult.cipherSuites.length - 5} more cipher suites
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Security Features
          </CardTitle>
          <CardDescription>Additional security configurations and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <span className="text-sm font-medium">OCSP Stapling</span>
              <Badge variant={sslResult.ocspStapling ? 'default' : 'secondary'}>
                {sslResult.ocspStapling ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <span className="text-sm font-medium">HSTS</span>
              <Badge variant={sslResult.hsts ? 'default' : 'secondary'}>
                {sslResult.hsts ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            {sslResult.hsts && sslResult.hstsMaxAge && (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <span className="text-sm font-medium">HSTS Max Age</span>
                  <span className="text-sm">{sslResult.hstsMaxAge} seconds</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <span className="text-sm font-medium">HSTS Include Subdomains</span>
                  <Badge variant={sslResult.hstsIncludeSubdomains ? 'default' : 'secondary'}>
                    {sslResult.hstsIncludeSubdomains ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vulnerabilities */}
      {sslResult.vulnerabilities.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Security Vulnerabilities
            </CardTitle>
            <CardDescription>Identified security issues and recommended remediation steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sslResult.vulnerabilities.map((vuln, index) => (
              <div key={index} className={cn('p-4 rounded-lg border', getSeverityColor(vuln.severity))}>
                <div className="flex items-start gap-3">
                  {getSeverityIcon(vuln.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold">{vuln.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {vuln.severity}
                      </Badge>
                      {vuln.cve && (
                        <Badge variant="outline" className="text-xs">
                          {vuln.cve}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-3">{vuln.description}</p>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium mb-1">Recommendation:</div>
                        <div className="text-xs">{vuln.recommendation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chain Issues */}
      {sslResult.chainIssues.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              Certificate Chain Issues
            </CardTitle>
            <CardDescription>Problems detected in the certificate chain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sslResult.chainIssues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SSLResults;