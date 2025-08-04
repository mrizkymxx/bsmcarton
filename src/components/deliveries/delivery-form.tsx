
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
import { Customer, Delivery, PurchaseOrder, ReadyToShipItem } from "@/lib/types"
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
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  availableToShip: z.coerce.number(),
});

const formSchema = z.object({
  deliveryNoteNumber: z.string().min(3, "Delivery note number must be at least 3 characters."),
  customerId: z.string().min(1, "Customer must be selected."),
  deliveryDate: z.date({ required_error: "Delivery date is required." }),
  expedition: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverName: z.string().optional(),
  items: z.array(deliveryItemSchema).min(1, "At least one item must be selected for delivery."),
});

type DeliveryFormValues = z.infer<typeof formSchema>

interface DeliveryFormProps {
  purchaseOrder?: PurchaseOrder;
  onSuccess?: () => void;
}

export function DeliveryForm({ purchaseOrder, onSuccess }: DeliveryFormProps) {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isPending, startTransition] = useTransition();
  const [readyItems, setReadyItems] = useState<ReadyToShipItem[]>([]);
  const isFromPO = !!purchaseOrder;

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        deliveryNoteNumber: "",
        customerId: purchaseOrder?.customerId || "",
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
    if (isFromPO) return; // Don't fetch all customers if creating from a specific PO
    const fetchCustomers = async () => {
        try {
            const fetchedCustomers = await getCustomers();
            setCustomers(fetchedCustomers);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load customer data.", variant: "destructive" });
        }
    };
    fetchCustomers();
  }, [toast, isFromPO]);
  
  useEffect(() => {
      form.setValue('items', []);
      if (!selectedCustomerId) {
          setReadyItems([]);
          return;
      }
      
      const fetchReadyItems = async () => {
        startTransition(async () => {
           try {
               const items = await getReadyToShipItems(selectedCustomerId, isFromPO ? purchaseOrder.id : null);
               setReadyItems(items);
           } catch(error) {
                toast({ title: "Error", description: "Failed to load ready-to-ship items.", variant: "destructive" });
           }
        });
      };
      fetchReadyItems();
  }, [selectedCustomerId, toast, form, isFromPO, purchaseOrder]);
  
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
      let selectedCustomer: Customer | undefined;
      if (isFromPO) {
        selectedCustomer = {
          id: purchaseOrder.customerId,
          name: purchaseOrder.customerName,
          // Dummy data for other fields as they are not needed here
          email: '',
          phone: '',
          address: '',
          registered: ''
        };
      } else {
        selectedCustomer = customers.find(c => c.id === values.customerId);
      }

      if (!selectedCustomer) throw new Error("Invalid customer.");

      const deliveryData: Omit<Delivery, "id"> = {
        ...values,
        customerName: selectedCustomer.name,
        deliveryDate: values.deliveryDate.toISOString(),
      };
      
      await createDelivery(deliveryData);

      toast({
        title: "Success!",
        description: `Delivery Note has been successfully created.`,
      });
      if (onSuccess) {
        onSuccess();
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to create delivery note. Please try again.`,
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
                    <FormLabel>Delivery Note Number</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., SJ/2024/001" {...field} />
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
                    <FormLabel>Customer</FormLabel>
                    {isFromPO ? (
                        <Input value={purchaseOrder.customerName} disabled />
                    ) : (
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={isPending ? "Loading..." : "Select customer"} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {customers.map(customer => (
                                <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    )}
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Delivery Date</FormLabel>
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
                            <span>Pick a date</span>
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
            <FormField control={form.control} name="expedition" render={({ field }) => (<FormItem><FormLabel>Expedition</FormLabel><FormControl><Input placeholder="(Optional)" {...field} value={field.value ?? ""} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="vehicleNumber" render={({ field }) => (<FormItem><FormLabel>Vehicle No.</FormLabel><FormControl><Input placeholder="(Optional)" {...field} value={field.value ?? ""} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver's Name</FormLabel><FormControl><Input placeholder="(Optional)" {...field} value={field.value ?? ""} /></FormControl></FormItem>)}/>
        </div>
        
        <Separator />
        
        <div>
           <h3 className="text-lg font-medium mb-2">Select Items for Delivery</h3>
            {isPending && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading items...</div>}
            {!isPending && readyItems.length === 0 && selectedCustomerId && <p className="text-sm text-muted-foreground">No items are ready to ship for this customer.</p>}
            {!isPending && readyItems.length > 0 && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead>PO No.</TableHead>
                                <TableHead>Ready to Ship</TableHead>
                                <TableHead className="w-40">Delivery Qty</TableHead>
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
              {form.formState.isSubmitting ? 'Saving...' : 'Save & Create Delivery Note'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
