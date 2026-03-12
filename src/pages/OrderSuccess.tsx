import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MapPin, Clock, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        className="max-w-sm w-full text-center space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 className="w-12 h-12 text-primary animate-scale-check" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Placed! / অর্ডার সম্পন্ন!</h1>
          <p className="text-muted-foreground mt-1">Your parcel request has been submitted</p>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono font-bold text-sm">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Est. Pickup
              </span>
              <span className="font-semibold text-sm">30–60 min</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            className="w-full h-12 text-base font-semibold gap-2"
            onClick={() => navigate(`/track/${orderId}`)}
          >
            <MapPin className="w-5 h-5" />
            Track Order / অর্ডার ট্র্যাক করুন
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Back to Dashboard / ড্যাশবোর্ডে ফিরুন
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
