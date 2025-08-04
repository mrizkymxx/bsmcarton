
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { useEffect } from "react"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  font: z.enum(["inter", "roboto", "poppins"], {
    required_error: "Please select a font.",
  }),
  fontSize: z.enum(["sm", "base", "lg"], {
    required_error: "Please select a font size.",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
  const { setTheme, theme } = useTheme()
  const { toast } = useToast()

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "dark",
      font: "inter",
      fontSize: "base",
    },
  })

  useEffect(() => {
    form.setValue("theme", theme === "light" || theme === "dark" ? theme : "dark");
    const currentFont = localStorage.getItem("font") || "inter";
    const currentFontSize = localStorage.getItem("fontSize") || "base";
    form.setValue("font", currentFont as "inter" | "roboto" | "poppins");
    form.setValue("fontSize", currentFontSize as "sm" | "base" | "lg");
  }, [theme, form]);

  function onSubmit(data: AppearanceFormValues) {
    setTheme(data.theme);
    
    localStorage.setItem("font", data.font);
    localStorage.setItem("fontSize", data.fontSize);

    const root = document.documentElement;
    root.style.setProperty("--font-sans", `var(--font-${data.font})`);
    if(data.fontSize === 'sm') root.style.setProperty("--font-size-base", '14px');
    if(data.fontSize === 'base') root.style.setProperty("--font-size-base", '16px');
    if(data.fontSize === 'lg') root.style.setProperty("--font-size-base", '18px');

    toast({
      title: "Appearance updated!",
      description: `Theme, font, and font size have been updated.`,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the application.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-4/5 rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Light
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-4/5 rounded-lg bg-slate-400" />
                          <div className="h-2 w-full rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-full rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-full rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Dark
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Font</FormLabel>
                    <FormDescription>Select the font for the application.</FormDescription>
                    <FormMessage />
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="inter" />
                            </FormControl>
                            <FormLabel className="font-normal font-inter">Inter</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="roboto" />
                            </FormControl>
                            <FormLabel className="font-normal font-roboto">Roboto</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="poppins" />
                            </FormControl>
                            <FormLabel className="font-normal font-poppins">Poppins</FormLabel>
                        </FormItem>
                    </RadioGroup>
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Font Size</FormLabel>
                    <FormDescription>Adjust the base font size for the application.</FormDescription>
                    <FormMessage />
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="sm" />
                            </FormControl>
                            <FormLabel className="font-normal">Small</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="base" />
                            </FormControl>
                            <FormLabel className="font-normal">Default</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="lg" />
                            </FormControl>
                            <FormLabel className="font-normal">Large</FormLabel>
                        </FormItem>
                    </RadioGroup>
                </FormItem>
            )}
        />


        <Button type="submit">Update appearance</Button>
      </form>
    </Form>
  )
}
