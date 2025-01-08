import { HLATyping } from '@/types/matching';

const HLA_WEIGHTS = {
  exact: 10,
  partial: 5,
};

export function calculateHLACompatibility(
  recipientHLA: HLATyping,
  donorHLA: HLATyping
): number {
  let totalScore = 0;
  let totalPossibleScore = 0;

  // Compare each HLA type
  for (const type of ['A', 'B', 'C', 'DR', 'DQ', 'DP'] as const) {
    const key = `hla${type}` as keyof HLATyping;
    const recipientAlleles = parseHLAAlleles(recipientHLA[key]);
    const donorAlleles = parseHLAAlleles(donorHLA[key]);

    // Each HLA type can have multiple alleles
    // We'll count matches up to 2 per locus (representing the two copies each person has)
    const maxMatchesPerLocus = 2;
    totalPossibleScore += maxMatchesPerLocus * HLA_WEIGHTS.exact;

    // Find matching alleles
    const matches = findMatchingAlleles(recipientAlleles, donorAlleles);
    // Cap the matches at 2 per locus
    const scoredMatches = Math.min(matches, maxMatchesPerLocus);
    totalScore += scoredMatches * HLA_WEIGHTS.exact;
  }

  // Return normalized score (0-1)
  return totalScore / totalPossibleScore;
}

export function parseHLAAlleles(hlaString: string): string[] {
  if (!hlaString) return [];
  
  // Split on commas and handle various separators
  return hlaString
    .split(/[,;/\s]+/)
    .map(allele => allele.trim().toUpperCase())
    .filter(allele => allele.length > 0);
}

function findMatchingAlleles(recipientAlleles: string[], donorAlleles: string[]): number {
  const recipientSet = new Set(recipientAlleles);
  const donorSet = new Set(donorAlleles);
  
  let matches = 0;
  for (const allele of recipientSet) {
    if (donorSet.has(allele)) {
      matches++;
    }
  }
  
  return matches;
}

// Helper function to format HLA alleles consistently
export function formatHLAAlleles(alleles: string[]): string {
  return alleles
    .map(allele => allele.trim().toUpperCase())
    .filter(allele => allele.length > 0)
    .join(', ');
}

// Helper function to validate HLA input
export function validateHLAInput(input: string): boolean {
  if (!input.trim()) return true; // Empty input is valid
  
  const alleles = parseHLAAlleles(input);
  // Check if each allele follows basic HLA format (letter followed by numbers/letters)
  return alleles.every(allele => /^[A-Z]+[0-9A-Z*]+$/.test(allele));
}