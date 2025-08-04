
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { OrderItemStatus, ProductionItem } from "@/lib/types"
import { updateProductionItem } from "@/lib/actions/production"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const formSchema = z.object({
  produced: z.coerce.number().min(0, "Quantity cannot be negative."),
  status: z.enum(["Draft", "In Production", "Ready to Ship", "Shipped"]),
})

type ProductionFormValues = z.infer<typeof formSchema>

interface ProductionFormProps {
  item: ProductionItem;
  onSuccess?: () => void;
}


export function ProductionForm({ item, onSuccess }: ProductionFormProps) {
  const { toast } = useToast()

  const form = useForm<ProductionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produced: item?.produced || 0,
      status: item?.status || "Draft",
    },
  })

  const onSubmit = async (values: ProductionFormValues) => {
    if (values.produced > item.total) {
        form.setError("produced", {
            type: "manual",
            message: `Production quantity cannot exceed the ordered quantity (${item.total} pcs).`
        });
        return;
    }
     if (values.produced < (item.delivered || 0)) {
        form.setError("produced", {
            type: "manual",
            message: `Production quantity cannot be less than the already shipped quantity (${item.delivered || 0} pcs).`
        });
        return;
    }
    
    try {
        await updateProductionItem(item.poId, item.id, values.produced, values.status as OrderItemStatus);
        toast({
            title: "Success!",
            description: `Production progress for item "${item.name}" has been successfully updated.`,
        });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update progress. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="produced"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity Produced (pcs)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
             <FormItem>
                <FormLabel>Item Status</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="In Production">In Production</SelectItem>
                        <SelectItem value="Ready to Ship">Ready to Ship</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground">
            Total Ordered: {item.total.toLocaleString()} pcs <br />
            Total Shipped: {(item.delivered || 0).toLocaleString()} pcs
        </p>
        <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
