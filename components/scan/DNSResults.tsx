'use client';

import React from 'react';
import {
  Globe,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Mail,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  InfoIcon,
  Lock,
  Key,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DNSResult, DNSRecord, EmailSecurity } from '@/types';

interface DNSResultsProps {
  dnsResult: DNSResult | null;
  className?: string;
}

export const DNSResults: React.FC<DNSResultsProps> = ({ dnsResult, className }) => {
  if (!dnsResult) {
    return (
      <div className={cn('p-8 text-center text-gray-500 dark:text-gray-400', className)}>
        <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No DNS results available</p>
        <p className="text-sm">Run a scan to view DNS configuration and security analysis.</p>
      </div>
    );
  }

  const getEmailSecurityStatus = (emailSecurity: EmailSecurity) => {
    const spfScore = emailSecurity.spf.present && emailSecurity.spf.valid ? 1 : 0;
    const dmarcScore = emailSecurity.dmarc.present && emailSecurity.dmarc.valid ? 1 : 0;
    const dkimScore = emailSecurity.dkim.present && emailSecurity.dkim.valid ? 1 : 0;
    const totalScore = spfScore + dmarcScore + dkimScore;

    if (totalScore === 3) return { status: 'excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
    if (totalScore === 2) return { status: 'good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
    if (totalScore === 1) return { status: 'poor', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' };
    return { status: 'critical', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' };
  };

  const getRecordIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'A':
      case 'AAAA':
        return <Globe className="w-4 h-4" />;
      case 'MX':
        return <Mail className="w-4 h-4" />;
      case 'NS':
        return <Server className="w-4 h-4" />;
      case 'TXT':
        return <Key className="w-4 h-4" />;
      case 'CNAME':
        return <Globe className="w-4 h-4" />;
      case 'CAA':
        return <Lock className="w-4 h-4" />;
      default:
        return <InfoIcon className="w-4 h-4" />;
    }
  };

  const getRecordDescription = (type: string) => {
    switch (type.toUpperCase()) {
      case 'A':
        return 'Maps domain to IPv4 address';
      case 'AAAA':
        return 'Maps domain to IPv6 address';
      case 'MX':
        return 'Specifies mail exchange servers';
      case 'NS':
        return 'Delegates DNS zone to nameservers';
      case 'TXT':
        return 'Contains text information for various purposes';
      case 'CNAME':
        return 'Creates an alias for another domain';
      case 'CAA':
        return 'Specifies authorized certificate authorities';
      case 'SRV':
        return 'Defines services available in the domain';
      case 'SOA':
        return 'Start of Authority record for the zone';
      default:
        return 'DNS record';
    }
  };

  const groupRecordsByType = (records: DNSRecord[]) => {
    return records.reduce((acc, record) => {
      const type = record.type.toUpperCase();
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(record);
      return acc;
    }, {} as Record<string, DNSRecord[]>);
  };

  const emailSecurityStatus = getEmailSecurityStatus(dnsResult.emailSecurity);
  const groupedRecords = groupRecordsByType(dnsResult.records);

  const getEmailSecurityRecommendations = (emailSecurity: EmailSecurity) => {
    const recommendations: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> = [];

    if (!emailSecurity.spf.present) {
      recommendations.push({
        type: 'SPF',
        message: 'Add an SPF record to specify authorized mail servers',
        severity: 'high'
      });
    } else if (!emailSecurity.spf.valid) {
      recommendations.push({
        type: 'SPF',
        message: 'Fix SPF record syntax errors',
        severity: 'high'
      });
    }

    if (!emailSecurity.dmarc.present) {
      recommendations.push({
        type: 'DMARC',
        message: 'Add a DMARC record to protect against email spoofing',
        severity: 'high'
      });
    } else if (!emailSecurity.dmarc.valid) {
      recommendations.push({
        type: 'DMARC',
        message: 'Fix DMARC record configuration',
        severity: 'high'
      });
    } else if (emailSecurity.dmarc.policy === 'none') {
      recommendations.push({
        type: 'DMARC',
        message: 'Consider changing DMARC policy from "none" to "quarantine" or "reject"',
        severity: 'medium'
      });
    }

    if (!emailSecurity.dkim.present) {
      recommendations.push({
        type: 'DKIM',
        message: 'Configure DKIM to digitally sign your emails',
        severity: 'medium'
      });
    } else if (!emailSecurity.dkim.valid) {
      recommendations.push({
        type: 'DKIM',
        message: 'Fix DKIM key configuration',
        severity: 'high'
      });
    }

    return recommendations;
  };

  const recommendations = getEmailSecurityRecommendations(dnsResult.emailSecurity);

  return (
    <div className={cn('space-y-6', className)}>
      {/* DNSSEC Status */}
      <div className="flex items-center justify-center">
        <div
          className={cn(
            'flex items-center gap-3 px-8 py-4 rounded-2xl border-2 shadow-lg',
            dnsResult.dnssec
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-red-500 text-white border-red-600'
          )}
        >
          {dnsResult.dnssec ? (
            <ShieldCheck className="w-6 h-6" />
          ) : (
            <ShieldX className="w-6 h-6" />
          )}
          <div className="text-center">
            <div className="text-2xl font-bold">
              {dnsResult.dnssec ? 'DNSSEC' : 'NO DNSSEC'}
            </div>
            <div className="text-sm opacity-90">
              {dnsResult.dnssec ? 'Domain secured' : 'Domain not secured'}
            </div>
          </div>
        </div>
      </div>

      {/* Email Security Overview */}
      <Card className={cn('border-2', emailSecurityStatus.border)}>
        <CardHeader>
          <CardTitle className={cn('flex items-center gap-2', emailSecurityStatus.color)}>
            <Mail className="w-5 h-5" />
            Email Security Configuration
          </CardTitle>
          <CardDescription>
            SPF, DMARC, and DKIM configuration for email protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Security Records */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SPF */}
            <div className={cn(
              'p-4 rounded-lg border',
              dnsResult.emailSecurity.spf.present && dnsResult.emailSecurity.spf.valid
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : dnsResult.emailSecurity.spf.present
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {dnsResult.emailSecurity.spf.present && dnsResult.emailSecurity.spf.valid ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : dnsResult.emailSecurity.spf.present ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="font-semibold">SPF</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Sender Policy Framework
              </p>
              <Badge
                variant={
                  dnsResult.emailSecurity.spf.present && dnsResult.emailSecurity.spf.valid
                    ? 'default'
                    : dnsResult.emailSecurity.spf.present
                    ? 'secondary'
                    : 'destructive'
                }
                className="text-xs"
              >
                {dnsResult.emailSecurity.spf.present && dnsResult.emailSecurity.spf.valid
                  ? 'Valid'
                  : dnsResult.emailSecurity.spf.present
                  ? 'Invalid'
                  : 'Missing'}
              </Badge>
              {dnsResult.emailSecurity.spf.record && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Record:</div>
                  <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {dnsResult.emailSecurity.spf.record}
                  </div>
                </div>
              )}
            </div>

            {/* DMARC */}
            <div className={cn(
              'p-4 rounded-lg border',
              dnsResult.emailSecurity.dmarc.present && dnsResult.emailSecurity.dmarc.valid
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : dnsResult.emailSecurity.dmarc.present
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {dnsResult.emailSecurity.dmarc.present && dnsResult.emailSecurity.dmarc.valid ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : dnsResult.emailSecurity.dmarc.present ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="font-semibold">DMARC</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Domain-based Message Authentication
              </p>
              <div className="flex gap-2">
                <Badge
                  variant={
                    dnsResult.emailSecurity.dmarc.present && dnsResult.emailSecurity.dmarc.valid
                      ? 'default'
                      : dnsResult.emailSecurity.dmarc.present
                      ? 'secondary'
                      : 'destructive'
                  }
                  className="text-xs"
                >
                  {dnsResult.emailSecurity.dmarc.present && dnsResult.emailSecurity.dmarc.valid
                    ? 'Valid'
                    : dnsResult.emailSecurity.dmarc.present
                    ? 'Invalid'
                    : 'Missing'}
                </Badge>
                {dnsResult.emailSecurity.dmarc.policy && (
                  <Badge variant="outline" className="text-xs">
                    {dnsResult.emailSecurity.dmarc.policy}
                  </Badge>
                )}
              </div>
              {dnsResult.emailSecurity.dmarc.record && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Record:</div>
                  <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {dnsResult.emailSecurity.dmarc.record}
                  </div>
                </div>
              )}
            </div>

            {/* DKIM */}
            <div className={cn(
              'p-4 rounded-lg border',
              dnsResult.emailSecurity.dkim.present && dnsResult.emailSecurity.dkim.valid
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : dnsResult.emailSecurity.dkim.present
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {dnsResult.emailSecurity.dkim.present && dnsResult.emailSecurity.dkim.valid ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : dnsResult.emailSecurity.dkim.present ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="font-semibold">DKIM</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                DomainKeys Identified Mail
              </p>
              <Badge
                variant={
                  dnsResult.emailSecurity.dkim.present && dnsResult.emailSecurity.dkim.valid
                    ? 'default'
                    : dnsResult.emailSecurity.dkim.present
                    ? 'secondary'
                    : 'destructive'
                }
                className="text-xs"
              >
                {dnsResult.emailSecurity.dkim.present && dnsResult.emailSecurity.dkim.valid
                  ? 'Valid'
                  : dnsResult.emailSecurity.dkim.present
                  ? 'Invalid'
                  : 'Missing'}
              </Badge>
              {dnsResult.emailSecurity.dkim.selectors.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Selectors:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dnsResult.emailSecurity.dkim.selectors.map((selector, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {selector}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Email Security Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-2 p-3 rounded-lg text-sm',
                      rec.severity === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        : rec.severity === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                    )}
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>{rec.type}:</strong> {rec.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNS Records by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            DNS Records
          </CardTitle>
          <CardDescription>
            All DNS records organized by type with explanations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedRecords).map(([type, records]) => (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                {getRecordIcon(type)}
                <h4 className="text-lg font-semibold">{type} Records</h4>
                <Badge variant="secondary" className="text-xs">
                  {records.length}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <HelpCircle className="w-3 h-3" />
                  {getRecordDescription(type)}
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>TTL</TableHead>
                    {type === 'MX' && <TableHead>Priority</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{record.name}</TableCell>
                      <TableCell className="font-mono text-sm break-all">{record.value}</TableCell>
                      <TableCell className="text-sm">{record.ttl}s</TableCell>
                      {type === 'MX' && (
                        <TableCell className="text-sm">{record.priority}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Nameservers */}
      {dnsResult.nameservers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Nameservers
            </CardTitle>
            <CardDescription>
              Authoritative DNS servers for this domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dnsResult.nameservers.map((ns, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <Server className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-mono text-sm">{ns}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CAA Records */}
      {dnsResult.caa.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Certificate Authority Authorization (CAA)
            </CardTitle>
            <CardDescription>
              Specifies which certificate authorities are authorized to issue certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>TTL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dnsResult.caa.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{record.name}</TableCell>
                    <TableCell className="font-mono text-sm">{record.value}</TableCell>
                    <TableCell className="text-sm">{record.ttl}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MX Records */}
      {dnsResult.mx.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Mail Exchange (MX) Records
            </CardTitle>
            <CardDescription>
              Mail servers responsible for receiving email for this domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Mail Server</TableHead>
                  <TableHead>TTL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dnsResult.mx
                  .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                  .map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{record.priority}</TableCell>
                      <TableCell className="font-mono text-sm">{record.value}</TableCell>
                      <TableCell className="text-sm">{record.ttl}s</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DNSResults;