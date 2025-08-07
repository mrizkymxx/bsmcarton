
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const storedLoginStatus = localStorage.getItem("isLoggedIn");
      const sessionIsLoggedIn = storedLoginStatus === "true";
      
      setIsLoggedIn(sessionIsLoggedIn);

      if (!sessionIsLoggedIn && pathname !== "/login") {
        router.push("/login");
      } else if (sessionIsLoggedIn && pathname === "/login") {
        router.push("/");
      }
    } catch (error) {
        // If localStorage is not available, default to not logged in
        setIsLoggedIn(false);
        if (pathname !== "/login") {
            router.push("/login");
        }
    }
  }, [pathname, router]);

  // While checking auth, show a loading state
  if (isLoggedIn === null) {
    return (
       <div className="flex items-center justify-center min-h-screen">
          <Skeleton className="h-screen w-screen" />
       </div>
    );
  }

  // If on the login page, render it without the main app layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If logged in and not on the login page, render the children (the main app)
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // This case should ideally not be reached due to the redirects, but serves as a fallback.
  return null;
}
