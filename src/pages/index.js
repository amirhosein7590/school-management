import { Button } from "@/components/modules/button";
import { toast } from "sonner";
import { XCircleIcon } from "lucide-react";

function Index() {
  return (
    <>
      <Button
        onClick={() => {
          toast.success("این یک پیغام نمایشی است", {
            icon: null,
            duration: 5000,
            closeButton : true,
            style: {
              textAlign: "center",
              direction: "rtl",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          });
        }}
      >
        Show Toast
      </Button>
      <div>سلام به همگی</div>
    </>
  );
}

export default Index;
