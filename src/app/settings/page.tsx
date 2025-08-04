
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function SettingsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto flex-1 space-y-4 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Basic settings for your account. (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Features to change the profile will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
