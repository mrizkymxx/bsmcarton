
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { Customer, Delivery, ReadyToShipItem } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useEffect, useState, useTransition } from "react"
import { getCustomers } from "@/lib/actions/customers"
import { createDelivery, getReadyToShipItems } from "@/lib/actions/deliveries"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "../ui/checkbox"

const deliveryItemSchema = z.object({
  poId: z.string(),
  orderItemId: z.string(),
  name: z.string(),
  poNumber: z.string(),
  type: z.enum(["Box", "Layer"]),
  finishedSize: z.object({
    length: z.coerce.number(),
    width: z.coerce.number(),
    height: z.coerce.number().optional(),
  }).nullable(),
  quantity: z.coerce.number().min(1, "Jumlah harus minimal 1."),
  availableToShip: z.coerce.number(),
});

const formSchema = z.object({
  deliveryNoteNumber: z.string().min(3, "Nomor surat jalan minimal 3 karakter."),
  customerId: z.string().min(1, "Pelanggan harus dipilih."),
  deliveryDate: z.date({ required_error: "Tanggal pengiriman harus diisi." }),
  expedition: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  items: z.array(deliveryItemSchema).min(1, "Minimal harus ada 1 item untuk dikirim."),
});

type DeliveryFormValues = z.infer<typeof formSchema>

interface DeliveryFormProps {
  onSuccess?: () => void;
}

export function DeliveryForm({ onSuccess }: DeliveryFormProps) {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isPending, startTransition] = useTransition();
  const [readyItems, setReadyItems] = useState<ReadyToShipItem[]>([]);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        deliveryNoteNumber: "",
        customerId: "",
        deliveryDate: new Date(),
        items: [],
    },
    mode: "onChange",
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const selectedCustomerId = form.watch("customerId");

  useEffect(() => {
    const fetchCustomers = async () => {
        try {
            const fetchedCustomers = await getCustomers();
            setCustomers(fetchedCustomers);
        } catch (error) {
            toast({ title: "Error", description: "Gagal memuat data pelanggan.", variant: "destructive" });
        }
    };
    fetchCustomers();
  }, [toast]);
  
  useEffect(() => {
      form.setValue('items', []);
      if (!selectedCustomerId) {
          setReadyItems([]);
          return;
      }
      
      const fetchReadyItems = async () => {
        startTransition(async () => {
           try {
               const items = await getReadyToShipItems(selectedCustomerId);
               setReadyItems(items);
           } catch(error) {
                toast({ title: "Error", description: "Gagal memuat item siap kirim.", variant: "destructive" });
           }
        });
      };
      fetchReadyItems();
  }, [selectedCustomerId, toast, form]);
  
  const handleItemSelectionChange = (itemId: string, checked: boolean) => {
    const currentFormItems = form.getValues('items');
    
    if (checked) {
        const itemToAdd = readyItems.find(item => item.id === itemId);
        if (itemToAdd) {
             const newFormItem: z.infer<typeof deliveryItemSchema> = {
                poId: itemToAdd.poId,
                orderItemId: itemToAdd.id,
                name: itemToAdd.name,
                poNumber: itemToAdd.poNumber,
                quantity: itemToAdd.availableToShip,
                availableToShip: itemToAdd.availableToShip,
                type: itemToAdd.type,
                finishedSize: itemToAdd.finishedSize ? {
                    length: itemToAdd.finishedSize.length,
                    width: itemToAdd.finishedSize.width,
                    height: itemToAdd.finishedSize.height,
                } : null,
            };
            append(newFormItem);
        }
    } else {
        const itemIndexToRemove = currentFormItems.findIndex(item => item.orderItemId === itemId);
        if (itemIndexToRemove > -1) {
            remove(itemIndexToRemove);
        }
    }
  }

  const onSubmit = async (values: DeliveryFormValues) => {
    try {
      const selectedCustomer = customers.find(c => c.id === values.customerId);
      if (!selectedCustomer) throw new Error("Pelanggan tidak valid.");

      const deliveryData: Omit<Delivery, "id"> = {
        ...values,
        customerName: selectedCustomer.name,
        deliveryDate: values.deliveryDate.toISOString(),
      };
      
      await createDelivery(deliveryData);

      toast({
        title: "Sukses!",
        description: `Surat Jalan berhasil dibuat.`,
      });
      if (onSuccess) {
        onSuccess();
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Gagal membuat surat jalan. Silakan coba lagi.`,
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
                name="deliveryNoteNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Nomor Surat Jalan</FormLabel>
                    <FormControl>
                    <Input placeholder="cth: SJ/2024/001" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={isPending ? "Memuat..." : "Pilih pelanggan"} />
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
                name="deliveryDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Pengiriman</FormLabel>
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
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="expedition" render={({ field }) => (<FormItem><FormLabel>Ekspedisi</FormLabel><FormControl><Input placeholder="(Opsional)" {...field} value={field.value ?? ""} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="vehicleNumber" render={({ field }) => (<FormItem><FormLabel>No. Kendaraan</FormLabel><FormControl><Input placeholder="(Opsional)" {...field} value={field.value ?? ""} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Nama Supir</FormLabel><FormControl><Input placeholder="(Opsional)" {...field} value={field.value ?? ""} /></FormControl></FormItem>)}/>
        </div>
        
        <Separator />
        
        <div>
           <h3 className="text-lg font-medium mb-2">Pilih Item untuk Dikirim</h3>
            {isPending && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Memuat item...</div>}
            {!isPending && readyItems.length === 0 && selectedCustomerId && <p className="text-sm text-muted-foreground">Tidak ada item yang siap dikirim untuk pelanggan ini.</p>}
            {!isPending && readyItems.length > 0 && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Nama Item</TableHead>
                                <TableHead>No. PO</TableHead>
                                <TableHead>Siap Kirim</TableHead>
                                <TableHead className="w-40">Jumlah Kirim</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {readyItems.map((item) => {
                                const fieldIndex = fields.findIndex(field => field.orderItemId === item.id);
                                return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={fieldIndex > -1}
                                            onCheckedChange={(checked) => handleItemSelectionChange(item.id, !!checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {item.finishedSize ? (item.type === 'Box' ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height} cm` : `${item.finishedSize.length}x${item.finishedSize.width} cm`) : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.poNumber}</TableCell>
                                    <TableCell>{item.availableToShip.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {fieldIndex > -1 && (
                                            <FormField
                                                control={form.control}
                                                name={`items.${fieldIndex}.quantity`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" {...field} max={item.availableToShip} min={1} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
            )}
           {form.formState.errors.items && !form.formState.errors.items.root && <FormMessage className="mt-2">{form.formState.errors.items.message}</FormMessage>}
        </div>

        <div className="flex justify-end gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting || isPending || !form.formState.isValid}>
              {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan & Buat Surat Jalan'}
            </Button>
        </div>
      </form>
    </Form>
  )
}

    