import { useEffect } from "react";
import { toast } from "react-toastify";

export default function InternetStatus() {
  useEffect(() => {
    const handleOffline = () => {
      toast.error("No internet connection", {
        id: "internet-status",
        duration: Infinity,
      });
    };

    const handleOnline = () => {
      toast.dismiss("internet-status");
      toast.success("Internet connection restored");
    };

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}