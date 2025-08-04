
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function SettingsPage() {
  return (
    <div className="w-full space-y-4">
      <div className="grid gap-4">
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
