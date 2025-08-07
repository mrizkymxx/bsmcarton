
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
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const hardcodedPassword = "kikicool";

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      // Store login status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548598132-75276f528dba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}
    >
      <Card className="w-full max-w-sm mx-4 bg-black/30 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-white/80 pt-2">
            Please enter your password to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2 relative">
              <Label htmlFor="password" className="sr-only">Password</Label>
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                required
                className="bg-white/10 border-white/20 pl-10 placeholder:text-white/60 focus:ring-white"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-white text-primary hover:bg-white/90 rounded-full font-bold text-base py-6">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
