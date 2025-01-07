import { useNavigate } from 'react-router-dom';
import { DonorPersonalInfo } from '@/components/donors/DonorPersonalInfo';
import { DonorHLATyping } from '@/components/donors/DonorHLATyping';
import { DonorMedicalTests } from '@/components/donors/DonorMedicalTests';
import { DonorAdditionalInfo } from '@/components/donors/DonorAdditionalInfo';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { donorSchema } from '@/lib/validations/donor';
import { createDonor } from '@/lib/api/donors';
import type { DonorFormData } from '@/types/donor';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function DonorForm() {
  const navigate = useNavigate();
  const methods = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      mrn: '',
      nationalId: '',
      fullName: '',
      age: 0,
      bloodType: '',
      mobileNumber: '',
      hlaA: '',
      hlaB: '',
      hlaC: '',
      hlaDR: '',
      hlaDQ: '',
      hlaDP: '',
      highResTyping: '',
      donorAntibodies: '',
      antigenMismatch: 0,
      crossmatchResult: '',
      serumCreatinine: 0,
      egfr: 0,
      bloodPressure: '',
      viralScreening: '',
      cmvStatus: '',
      medicalConditions: '',
      notes: '',
    },
  });

  const onSubmit = async (data: DonorFormData) => {
    try {
      // Validate required fields
      if (!data.bloodType) {
        toast.error('Please select a blood type');
        return;
      }
      if (!data.crossmatchResult) {
        toast.error('Please select a crossmatch result');
        return;
      }
      if (!data.cmvStatus) {
        toast.error('Please select a CMV status');
        return;
      }

      // Show loading state
      const loadingToast = toast.loading('Saving donor information...');

      // Create donor with better error logging
      console.log('Submitting donor data:', data); // Debug log
      await createDonor(data);
      
      // Clear loading state and show success
      toast.dismiss(loadingToast);
      toast.success('Donor information saved successfully');
      
      // Navigate to donors list
      navigate('/donors');
    } catch (error) {
      console.error('Detailed error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      toast.dismiss();
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          if (error.message.includes('mrn')) {
            toast.error('A donor with this MRN already exists');
          } else if (error.message.includes('national_id')) {
            toast.error('A donor with this National ID already exists');
          } else {
            toast.error('A donor with these details already exists');
          }
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error('Failed to save donor information. Please check the console for details.');
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h1 className="text-2xl font-semibold mb-6">New Donor Registration</h1>
          <div className="space-y-8">
            <DonorPersonalInfo />
            <DonorHLATyping />
            <DonorMedicalTests />
            <DonorAdditionalInfo />
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/donors')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={methods.formState.isSubmitting}
                className="gap-2"
              >
                {methods.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Donor Information
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}