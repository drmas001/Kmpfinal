import type { Database } from '@/types/supabase';
import { Badge } from '@/components/ui/badge';

type Donor = Database['public']['Tables']['donors']['Row'];
type Recipient = Database['public']['Tables']['recipients']['Row'];

interface MatchingResultsProps {
  donor: Donor;
  recipient: Recipient;
  isMatch: boolean;
  exclusionReason?: string;
  hlaMatches?: {
    [key: string]: {
      donorAlleles: string[];
      recipientAlleles: string[];
      matchedAlleles: string[];
    };
  };
}

export function MatchingResult({ donor, recipient, isMatch, exclusionReason, hlaMatches }: MatchingResultsProps) {
  return (
    <div className={`p-4 border rounded-lg ${isMatch ? 'border-green-500' : 'border-red-500'}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Donor: {donor.full_name}</h3>
        <span className={`px-2 py-1 rounded ${isMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isMatch ? 'Compatible' : 'Excluded'}
        </span>
      </div>
      
      {!isMatch && exclusionReason && (
        <div className="mt-2 text-sm text-red-600">
          Exclusion reason: {exclusionReason}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {['A', 'B', 'C', 'DR', 'DQ', 'DP'].map((locus) => {
          const key = `hla${locus}` as keyof typeof donor.hla_typing;
          const matches = hlaMatches?.[key];
          
          return (
            <div key={locus} className="space-y-2">
              <div className="font-medium">HLA-{locus}</div>
              <div className="text-sm space-y-1">
                <div className="flex flex-wrap gap-1">
                  {matches?.donorAlleles.map((allele) => (
                    <Badge
                      key={allele}
                      variant={matches.matchedAlleles.includes(allele) ? "default" : "secondary"}
                    >
                      {allele}
                    </Badge>
                  ))}
                </div>
                {matches && matches.matchedAlleles.length > 0 && (
                  <div className="text-xs text-green-600">
                    {matches.matchedAlleles.length} match{matches.matchedAlleles.length !== 1 ? 'es' : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}