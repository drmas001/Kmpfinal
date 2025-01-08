import type { Database } from '@/types/supabase';
import { parseHLAAlleles, formatHLAAlleles } from '@/lib/utils/matching/hla';

type Donor = Database['public']['Tables']['donors']['Row'];
type Recipient = Database['public']['Tables']['recipients']['Row'];

interface HLAMatchDetails {
  [key: string]: {
    donorAlleles: string[];
    recipientAlleles: string[];
    matchedAlleles: string[];
  };
}

export function calculateHLAMatches(
  donor: Donor,
  recipient: Recipient
): { matches: number; details: HLAMatchDetails } {
  let totalMatches = 0;
  const details: HLAMatchDetails = {};
  
  // Compare HLA antigens
  if (donor.hla_typing && recipient.hla_typing) {
    const loci = ['hla_a', 'hla_b', 'hla_c', 'hla_dr', 'hla_dq', 'hla_dp'] as const;
    
    for (const locus of loci) {
      const donorAlleles = parseHLAAlleles(donor.hla_typing[locus] || '');
      const recipientAlleles = parseHLAAlleles(recipient.hla_typing[locus] || '');
      
      // Find matching alleles
      const matchedAlleles = donorAlleles.filter(allele => 
        recipientAlleles.includes(allele)
      );
      
      // Store details for this locus
      details[locus] = {
        donorAlleles,
        recipientAlleles,
        matchedAlleles
      };
      
      // Count matches (max 2 per locus)
      const locusMatches = Math.min(matchedAlleles.length, 2);
      totalMatches += locusMatches;
    }
  }
  
  return {
    matches: totalMatches,
    details
  };
}

// Helper function to format HLA typing for display
export function formatHLATyping(hlaTyping: any): string {
  if (!hlaTyping) return 'N/A';
  
  const alleles = parseHLAAlleles(hlaTyping);
  return formatHLAAlleles(alleles);
}

// Helper function to check if donor has any unacceptable antigens
export function hasUnacceptableAntigens(
  donor: Donor,
  unacceptableAntigens: string
): { hasUnacceptable: boolean; matchedAntigens: string[] } {
  if (!unacceptableAntigens?.trim() || !donor.hla_typing) {
    return { hasUnacceptable: false, matchedAntigens: [] };
  }

  const unacceptableList = parseHLAAlleles(unacceptableAntigens);
  const donorAlleles = Object.values(donor.hla_typing)
    .flatMap(value => parseHLAAlleles(value || ''));

  const matchedAntigens = unacceptableList.filter(antigen => 
    donorAlleles.includes(antigen)
  );

  return {
    hasUnacceptable: matchedAntigens.length > 0,
    matchedAntigens
  };
} 