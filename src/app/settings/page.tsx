import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
          <CardDescription>
            This page is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Fitur untuk pengaturan akun dan aplikasi akan tersedia di sini.</p>
        </CardContent>
      </Card>
    </div>
  )
}
