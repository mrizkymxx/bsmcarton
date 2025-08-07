
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const hardcodedPassword = "kikicool";

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      alert("Login Berhasil!");
      router.push("/"); // Arahkan ke halaman utama (dashboard)
    } else {
      alert("Kata sandi salah!");
      setPassword("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Silakan masukkan kata sandi untuk mengakses dasbor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="********"
                required
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Masuk
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
