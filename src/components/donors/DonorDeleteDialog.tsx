import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Donor } from '@/types/matching';

type DonorWithStatus = Donor & { status: 'Available' | 'Utilized' };

interface DonorDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  donor: DonorWithStatus | null;
}

export function DonorDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  donor,
}: DonorDeleteDialogProps) {
  if (!donor) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Donor Record</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {donor.fullName}'s record? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}