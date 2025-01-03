import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function DonorHLATyping() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">HLA Typing Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="hlaA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-A</FormLabel>
              <FormControl>
                <Input placeholder="e.g., A1, A2, A24" {...field} />
              </FormControl>
              <FormDescription>
                Enter multiple alleles separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hlaB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-B</FormLabel>
              <FormControl>
                <Input placeholder="e.g., B7, B8, B27" {...field} />
              </FormControl>
              <FormDescription>
                Enter multiple alleles separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hlaC"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-C</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cw1, Cw2, Cw4" {...field} />
              </FormControl>
              <FormDescription>
                Enter multiple alleles separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hlaDR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-DR</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DR1, DR4, DR7" {...field} />
              </FormControl>
              <FormDescription>
                Enter multiple alleles separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hlaDQ"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-DQ</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DQ2, DQ4, DQ8" {...field} />
              </FormControl>
              <FormDescription>
                Enter multiple alleles separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hlaDP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-DP</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DP1, DP2, DP4" {...field} />
              </FormControl>
              <FormDescription>
                Enter multiple alleles separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="highResTyping"
          render={({ field }) => (
            <FormItem>
              <FormLabel>High Resolution Typing</FormLabel>
              <FormControl>
                <Input placeholder="Enter high resolution typing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="antigenMismatch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Antigen Mismatch</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter antigen mismatch" 
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}