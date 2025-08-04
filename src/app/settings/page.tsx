
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const FlagIndonesia = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" className="w-6 h-4 mr-2 rounded-sm">
        <path fill="#E13A43" d="M0 0h24v8H0z" />
        <path fill="#FFFFFF" d="M0 8h24v8H0z" />
    </svg>
);

const FlagUK = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" className="w-6 h-4 mr-2 rounded-sm">
        <defs>
            <path id="uk-union" d="M0 0h24v16H0z" fill="#0A174E"/>
            <path id="uk-st-andrew" d="m0 0 24 16m0-16L0 16" stroke="#fff" strokeWidth="3.2"/>
            <path id="uk-st-patrick" d="m0 0 24 16m0-16L0 16" stroke="#E13A43" strokeWidth="2"/>
            <path id="uk-st-george" d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="4.8"/>
            <path id="uk-st-george-inner" d="M12 0v16M0 8h24" stroke="#E13A43" strokeWidth="3.2"/>
        </defs>
        <use href="#uk-union"/>
        <use href="#uk-st-andrew"/>
        <use href="#uk-st-patrick"/>
        <use href="#uk-st-george"/>
        <use href="#uk-st-george-inner"/>
    </svg>
);

const FlagChina = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" className="w-6 h-4 mr-2 rounded-sm">
      <path fill="#E13A43" d="M0 0h24v16H0z"/>
      <g fill="#FFDE00">
        <path d="m4.4 4.8 1.487-1.088-.567 1.727 1.487 1.088-1.838-.001L4.4 8l-.568-1.475-1.838.001 1.488-1.088-.567-1.727z"/>
        <g transform="matrix(.744 -.544 .544 .744 8.8 2.4)">
           <path d="M0 1.4L-1 .4h2z" transform="rotate(18)"/>
           <path d="M0 1.4L-1 .4h2z" transform="rotate(90)"/>
        </g>
         <g transform="matrix(.744 -.544 .544 .744 11.2 4.8)">
           <path d="M0 1.4L-1 .4h2z" transform="rotate(-18)"/>
           <path d="M0 1.4L-1 .4h2z" transform="rotate(54)"/>
        </g>
         <g transform="matrix(.744 -.544 .544 .744 11.2 8)">
           <path d="M0 1.4L-1 .4h2z"/>
           <path d="M0 1.4L-1 .4h2z" transform="rotate(72)"/>
        </g>
         <g transform="matrix(.744 -.544 .544 .744 8.8 9.6)">
           <path d="M0 1.4L-1 .4h2z" transform="rotate(18)"/>
           <path d="M0 1.4L-1 .4h2z" transform="rotate(-54)"/>
        </g>
      </g>
    </svg>
);


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
              Pilih bahasa yang digunakan di seluruh aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <RadioGroup defaultValue="id" className="gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="id" id="r-id" />
                <Label htmlFor="r-id" className="flex items-center cursor-pointer">
                  <FlagIndonesia />
                  Bahasa Indonesia
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="r-en" />
                <Label htmlFor="r-en" className="flex items-center cursor-pointer">
                  <FlagUK />
                  English
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cn-simplified" id="r-cn-s" />
                <Label htmlFor="r-cn-s" className="flex items-center cursor-pointer">
                  <FlagChina />
                  中文 (简体)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
