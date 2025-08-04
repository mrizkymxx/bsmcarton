
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { upsertPurchaseOrder } from "@/lib/actions/purchase-orders"
import { Customer, PurchaseOrder } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { getCustomers } from "@/lib/actions/customers"
import { Separator } from "@/components/ui/separator"

const finishedSizeSchema = z.object({
  length: z.coerce.number({invalid_type_error: "Panjang harus berupa angka."}).positive("P harus lebih dari 0."),
  width: z.coerce.number({invalid_type_error: "Lebar harus berupa angka."}).positive("L harus lebih dari 0."),
  height: z.coerce.number({invalid_type_error: "Tinggi harus berupa angka."}).positive("T harus lebih dari 0."),
})

const materialSizeSchema = z.object({
    length: z.coerce.number(),
    width: z.coerce.number()
})

const orderItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nama item minimal 3 karakter."),
  finishedSize: finishedSizeSchema,
  materialSize: materialSizeSchema.optional(),
  total: z.coerce.number().min(1, "Jumlah harus lebih dari 0."),
  notes: z.string().optional(),
});


const formSchema = z.object({
  poNumber: z.string().min(3, "Nomor PO minimal 3 karakter."),
  customerId: z.string().min(1, "Pelanggan harus dipilih."),
  customerName: z.string(), // This will be set based on customerId
  orderDate: z.date({ required_error: "Tanggal pesan harus diisi." }),
  status: z.enum(["Open", "Completed", "Cancelled"]),
  items: z.array(orderItemSchema).min(1, "Minimal harus ada 1 item dalam PO."),
})

type POFormValues = z.infer<typeof formSchema>

interface POFormProps {
  purchaseOrder?: PurchaseOrder;
  onSuccess?: () => void;
}

const ItemRow = ({ control, index, remove, form }: { control: any, index: number, remove: (index: number) => void, form: any }) => {
    const itemValues = useWatch({
        control,
        name: `items.${index}`
    });

    const P = parseFloat(itemValues.finishedSize?.length) || 0;
    const L = parseFloat(itemValues.finishedSize?.width) || 0;
    const T = parseFloat(itemValues.finishedSize?.height) || 0;

    const panjangBahan = P > 0 && L > 0 ? ((P + L) * 2 + 3) * 10 : 0;
    const lebarBahan = L > 0 && T > 0 ? (L + T + 0.2) * 10 : 0;
    
    // Use setValue from the form instance to update the materialSize
    useEffect(() => {
        form.setValue(`items.${index}.materialSize`, {
            length: panjangBahan,
            width: lebarBahan
        }, { shouldValidate: true });
    }, [panjangBahan, lebarBahan, index, form.setValue, form]);


    return (
        <div className="flex items-start gap-4 p-4 border rounded-md relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 flex-1">
                <FormField
                    control={control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                    <FormItem className="md:col-span-12">
                        <FormLabel>Nama Style</FormLabel>
                        <FormControl>
                        <Input placeholder="cth: Box Standar" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`items.${index}.finishedSize.length`}
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Panjang (cm)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="P" {...field} step="0.01" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`items.${index}.finishedSize.width`}
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Lebar (cm)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="L" {...field} step="0.01" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name={`items.${index}.finishedSize.height`}
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Tinggi (cm)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="T" {...field} step="0.01" />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name={`items.${index}.total`}
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="cth: 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="md:col-span-4 flex items-end">
                    <p className="text-sm text-muted-foreground">
                        Ukuran Bahan: {Number(panjangBahan.toFixed(2))} x {Number(lebarBahan.toFixed(2))} mm
                    </p>
                </div>
                <FormField
                    control={control}
                    name={`items.${index}.notes`}
                    render={({ field }) => (
                    <FormItem className="md:col-span-12">
                        <FormLabel>Catatan</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Opsional" className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="mt-7 shrink-0"
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function PurchaseOrderForm({ purchaseOrder, onSuccess }: POFormProps) {
  const { toast } = useToast()
  const isEditMode = !!purchaseOrder;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await getCustomers();
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers", error);
        toast({ title: "Error", description: "Gagal memuat data pelanggan.", variant: "destructive" });
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [toast]);

  const defaultItems = purchaseOrder?.items?.map(item => ({
      ...item,
      finishedSize: {
          length: item.finishedSize.length ?? 0,
          width: item.finishedSize.width ?? 0,
          height: item.finishedSize.height ?? 0
      },
      materialSize: {
          length: item.materialSize.length ?? 0,
          width: item.materialSize.width ?? 0
      }
  })) || [];


  const defaultValues: Partial<POFormValues> = {
    poNumber: purchaseOrder?.poNumber || "",
    customerId: purchaseOrder?.customerId || "",
    customerName: purchaseOrder?.customerName || "",
    orderDate: purchaseOrder ? new Date(purchaseOrder.orderDate) : new Date(),
    status: purchaseOrder?.status || "Open",
    items: defaultItems,
  }

  const form = useForm<POFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const onSubmit = async (values: POFormValues) => {
    try {
      const selectedCustomer = customers.find(c => c.id === values.customerId);
      if (!selectedCustomer) {
        throw new Error("Pelanggan tidak valid.");
      }
      
       const processedItems = values.items.map(item => {
        const P = parseFloat(String(item.finishedSize.length)) || 0;
        const L = parseFloat(String(item.finishedSize.width)) || 0;
        const T = parseFloat(String(item.finishedSize.height)) || 0;

        const panjangBahan = P > 0 && L > 0 ? ((P + L) * 2 + 3) * 10 : 0;
        const lebarBahan = L > 0 && T > 0 ? (L + T + 0.2) * 10 : 0;

        return {
           ...item,
           id: item.id || crypto.randomUUID(),
           produced: purchaseOrder?.items.find(i => i.id === item.id)?.produced || 0,
           status: purchaseOrder?.items.find(i => i.id === item.id)?.status || 'Draft',
           materialSize: {
             length: panjangBahan,
             width: lebarBahan,
           } 
       }
     });

      const poData: Omit<PurchaseOrder, "id"> = {
        ...values,
        customerName: selectedCustomer.name,
        orderDate: values.orderDate.toISOString(),
        items: processedItems,
      };
      
      await upsertPurchaseOrder(isEditMode ? purchaseOrder.id : null, poData);

      toast({
        title: "Sukses!",
        description: `Purchase Order berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`,
      });
      if (onSuccess) {
        onSuccess();
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} PO. Silakan coba lagi.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor PO</FormLabel>
                <FormControl>
                  <Input placeholder="cth: PO/2024/001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pelanggan</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCustomers}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCustomers ? "Memuat..." : "Pilih pelanggan"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="orderDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Pesan</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <div>
           <h3 className="text-lg font-medium mb-2">Item Pesanan</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <ItemRow key={field.id} control={form.control} index={index} remove={remove} form={form} />
            ))}
          </div>
           <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ 
                  name: "", 
                  total: 0, 
                  notes: "", 
                  finishedSize: {length: 0, width: 0, height: 0}, 
                  materialSize: {length: 0, width: 0}
                })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
            <FormMessage>{form.formState.errors.items?.message}</FormMessage>
            <FormMessage>{form.formState.errors.items?.root?.message}</FormMessage>
        </div>


        <div className="flex justify-end gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-48">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status PO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
        </div>
      </form>
    </Form>
  )
}

    
