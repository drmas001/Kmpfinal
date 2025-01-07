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

export function MatchingResults({ donor, recipient, matchScore }: {
  donor: Donor;
  recipient: Recipient;
  matchScore: number;
}) {
  const matchGrade = getHLAMatchGrade(matchScore);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match Results</h3>
        <div className="flex items-center gap-2">
          <span>Match Grade:</span>
          <Badge variant={getMatchGradeVariant(matchGrade)}>{matchGrade}</Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <MatchInfoCard title="Donor" data={donor} />
        <MatchInfoCard title="Match Score" value={`${matchScore.toFixed(1)}%`} />
      </div>
    </div>
  );
}