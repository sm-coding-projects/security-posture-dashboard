import { z } from 'zod';

const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

export function cleanDomain(input: string): string {
  let domain = input.trim().toLowerCase();

  domain = domain.replace(/^https?:\/\//, '');

  domain = domain.split('/')[0];

  return domain;
}

export function isValidDomain(domain: string): boolean {
  const cleaned = cleanDomain(domain);
  return DOMAIN_REGEX.test(cleaned);
}

export const domainSchema = z
  .string()
  .min(1, 'Domain is required')
  .transform(cleanDomain)
  .refine(
    (domain) => DOMAIN_REGEX.test(domain),
    {
      message: 'Please enter a valid domain name (e.g., example.com)',
    }
  );

export const scanRequestSchema = z.object({
  domain: domainSchema,
  scanType: z.enum(['vulnerability', 'ssl', 'dns', 'port'], {
    errorMap: () => ({ message: 'Please select a valid scan type' }),
  }).optional().default('vulnerability'),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;