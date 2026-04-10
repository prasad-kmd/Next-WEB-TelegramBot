"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

export function ConnectivityListener() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online", {
        id: "connectivity-toast",
        description: "Your internet connection has been restored.",
        icon: <Wifi className="h-4 w-4" />,
        duration: 5000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline", {
        id: "connectivity-toast",
        description: "Please check your internet connection.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}
