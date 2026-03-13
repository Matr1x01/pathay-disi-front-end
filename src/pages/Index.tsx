import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        className="text-center max-w-sm space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">
          pathayDisi
        </h1>
        <p className="text-muted-foreground">
          Send parcels anywhere in Bangladesh, fast & reliable.
          <br />
          <span className="text-sm">বাংলাদেশের যেকোনো জায়গায় পার্সেল পাঠান</span>
        </p>
        <Button
          className="w-full h-14 text-lg font-bold gap-2"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
        >
          Get Started / শুরু করুন
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
