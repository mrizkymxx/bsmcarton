
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./_components/profile-form"
import { AppearanceForm } from "./_components/appearance-form"
import { CompanyForm } from "./_components/company-form"

export default function SettingsPage() {
  return (
    <div className="w-full space-y-4">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account, theme, and company settings.
          </p>
        </div>
      </div>
      <Tabs defaultValue="profile" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
           <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
           <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the app. Switch between light and dark mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceForm />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="company">
           <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
              <CardDescription>
                Manage your company's basic information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
