
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Pengaturan dasar untuk akun Anda. (Segera Hadir)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Fitur untuk mengubah profil akan tersedia di sini.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Bahasa</CardTitle>
            <CardDescription>
              Pilih bahasa yang digunakan di seluruh aplikasi. (UI Placeholder)
            </CardDescription>
          </CardHeader>
          <CardContent>
             <RadioGroup defaultValue="id">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="id" id="r-id" />
                <Label htmlFor="r-id">Bahasa Indonesia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="r-en" />
                <Label htmlFor="r-en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cn" id="r-cn" />
                <Label htmlFor="r-cn">中文 (Mandarin)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
