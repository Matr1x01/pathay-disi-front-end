import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RECENT_ORDERS } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Send, LogOut, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  picked_up: "bg-info/10 text-info border-info/30",
  in_transit: "bg-accent/10 text-accent border-accent/30",
  delivered: "bg-primary/10 text-primary border-primary/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pending / অপেক্ষমান",
  picked_up: "Picked Up / সংগৃহীত",
  in_transit: "In Transit / পথে",
  delivered: "Delivered / ডেলিভারি",
  cancelled: "Cancelled / বাতিল",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-5 pb-10 rounded-b-3xl">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Welcome back / স্বাগতম</p>
            <h1 className="text-xl font-bold">Hi, {user?.name} 👋</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6">
        {/* CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => navigate("/dashboard/new-order")}
            className="w-full h-16 text-lg font-bold gap-3 rounded-2xl shadow-lg"
          >
            <Send className="w-6 h-6" />
            Send New Parcel / নতুন পার্সেল পাঠান
          </Button>
        </motion.div>

        {/* Recent orders */}
        <div className="mt-8">
          <h2 className="font-bold text-base mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Recent Orders / সাম্প্রতিক অর্ডার
          </h2>

          <div className="space-y-3">
            {RECENT_ORDERS.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/track/${order.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm font-semibold">{order.id}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {order.pickup} → {order.dropoff}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-muted-foreground">{order.date}</span>
                      <span className="font-semibold text-foreground">৳{order.amount}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
