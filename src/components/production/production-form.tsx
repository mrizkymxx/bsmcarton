
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
  produced: z.coerce.number().min(0, "Jumlah tidak boleh negatif."),
  status: z.enum(["Draft", "Diproduksi", "Siap Kirim", "Dikirim"]),
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
            message: `Jumlah produksi tidak boleh melebihi jumlah pesanan (${item.total} pcs).`
        });
        return;
    }
    
    try {
        await updateProductionItem(item.poId, item.id, values.produced, values.status as OrderItemStatus);
        toast({
            title: "Sukses!",
            description: `Progres produksi untuk item "${item.name}" berhasil diperbarui.`,
        });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
      toast({
        title: "Error",
        description: `Gagal memperbarui progres. Silakan coba lagi.`,
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
              <FormLabel>Jumlah Sudah Produksi (pcs)</FormLabel>
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
                <FormLabel>Status Item</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Diproduksi">Diproduksi</SelectItem>
                        <SelectItem value="Siap Kirim">Siap Kirim</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
