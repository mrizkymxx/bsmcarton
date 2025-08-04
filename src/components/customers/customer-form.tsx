
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { upsertCustomer } from "@/lib/actions/customers"
import { Customer } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama pelanggan minimal 2 karakter.",
  }),
  email: z.string().email({
    message: "Format email tidak valid.",
  }),
  phone: z.string().min(10, {
    message: "Nomor telepon minimal 10 digit.",
  }),
  address: z.string().min(10, {
    message: "Alamat minimal 10 karakter.",
  }),
})

type CustomerFormValues = z.infer<typeof formSchema>

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}


export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { toast } = useToast()
  const isEditMode = !!customer;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
    },
  })

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const customerData: Omit<Customer, 'id' | 'registered'> = {
        ...values
      };
      
      await upsertCustomer(isEditMode ? customer.id : null, customerData);

      toast({
        title: "Sukses!",
        description: `Data pelanggan berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`,
      });
      if (onSuccess) {
        onSuccess();
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data pelanggan. Silakan coba lagi.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pelanggan</FormLabel>
              <FormControl>
                <Input placeholder="cth: PT. Jaya Abadi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="cth: admin@jayaabadi.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder="cth: 081234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="cth: Jl. Industri Raya No. 123, Jakarta Barat"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
