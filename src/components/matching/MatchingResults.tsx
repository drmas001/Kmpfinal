import type { Donor, Recipient } from '@/types/matching';
import { Badge } from '@/components/ui/badge';
import { getHLAMatchGrade } from '@/utils/matching';
import { MatchInfoCard } from './MatchInfoCard';

function getMatchGradeVariant(grade: string) {
  switch (grade) {
    case 'A':
      return 'success';
    case 'B':
      return 'warning';
    case 'C':
      return 'secondary';
    default:
      return 'destructive';
  }
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