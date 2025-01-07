import { HLAType } from '@/types/matching';
import { parseHLAAlleles } from '@/lib/utils/matching/hla';

export interface HLAMatch {
  allele: string;
  match: boolean;
}

export function compareHLA(donor: HLAType, recipient: HLAType): HLAMatch[] {
  const donorAlleles = parseHLAAlleles(donor);
  const recipientAlleles = parseHLAAlleles(recipient);

  const matches: HLAMatch[] = [];

  // Compare each allele
  recipientAlleles.forEach((allele: string) => {
    matches.push({
      allele,
      match: donorAlleles.includes(allele)
    });
  });

  return matches;
}

export function calculateHLAMatchScore(donor: HLAType, recipient: HLAType): number {
  const matches = compareHLA(donor, recipient);
  const matchCount = matches.filter(m => m.match).length;
  return (matchCount / matches.length) * 100;
}

export function getHLAMatchGrade(matchScore: number): 'A' | 'B' | 'C' | 'D' {
  if (matchScore >= 90) return 'A';
  if (matchScore >= 70) return 'B';
  if (matchScore >= 50) return 'C';
  return 'D';
}

export function parseAntigen(antigen: string): string {
  return antigen.trim().toUpperCase();
}

export function compareAntigens(donorAntigens: string[], recipientAntigens: string[]): boolean {
  const parsedDonorAntigens = donorAntigens.map(antigen => parseAntigen(antigen));
  const parsedRecipientAntigens = recipientAntigens.map(antigen => parseAntigen(antigen));

  return parsedRecipientAntigens.every(antigen => parsedDonorAntigens.includes(antigen));
} 