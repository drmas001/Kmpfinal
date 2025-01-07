import { HLAType } from '@/types/matching';

export function parseHLAAlleles(hlaString: string): string[] {
  if (!hlaString) return [];
  
  return hlaString
    .split(',')
    .map(allele => allele.trim())
    .filter(allele => allele.length > 0);
}

export function formatHLAAlleles(alleles: string[]): string {
  if (!alleles || alleles.length === 0) return 'Not Available';
  return alleles.join(', ');
}

export function compareHLAAlleles(donor: HLAType, recipient: HLAType): {
  matches: number;
  total: number;
} {
  const donorAlleles = parseHLAAlleles(donor);
  const recipientAlleles = parseHLAAlleles(recipient);

  const matches = recipientAlleles.filter(allele => 
    donorAlleles.includes(allele)
  ).length;

  return {
    matches,
    total: recipientAlleles.length
  };
}