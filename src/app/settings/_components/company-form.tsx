
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
import { Textarea } from "@/components/ui/textarea"

const companyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

const defaultValues: Partial<CompanyFormValues> = {
  name: "BSMcarton",
  address: "Jl. Industri Raya No. 123, Cikarang, Bekasi",
}

export function CompanyForm() {
  const { toast } = useToast()

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: CompanyFormValues) {
    toast({
      title: "Company info updated!",
      description: "Your company information has been updated.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} />
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
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Your company address" {...field} />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update company info</Button>
      </form>
    </Form>
  )
}
