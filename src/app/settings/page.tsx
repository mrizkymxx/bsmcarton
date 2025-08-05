
import { Separator } from "@/components/ui/separator"
import { AppearanceForm } from "./_components/appearance-form"
import AppLayout from "@/components/layout/app-layout"

function SettingsContent() {
    return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of the app. Switch between light and dark themes.
            </p>
          </div>
          <Separator />
          <AppearanceForm />
        </div>
    )
}

export default function SettingsPage() {
  return (
    <AppLayout>
        <SettingsContent />
    </AppLayout>
  )
}
