import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiCall } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Phone, Mail, MapPin, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ProfileData {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  joinedAt?: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Demonstration of using the authenticated API caller
    const fetchProfile = async () => {
      try {
        // In a real app, this would be: await apiCall<ProfileData>("/api/v1/profile");
        // We will simulate a network request delay and then return context data + extra mock info
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Let's pretend the API returned this successfully using the token
        const mockApiResponse: ProfileData = {
          id: user?.id || "unknown",
          name: user?.name || "Unknown User",
          phone: user?.phone || "N/A",
          email: user?.email || "N/A",
          address: "123 Delivery St, Dhaka, Bangladesh",
          joinedAt: "October 2023",
        };

        setProfile(mockApiResponse);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Profile</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-2 text-center sm:text-left">
              <Avatar className="h-24 w-24 border-4 border-muted">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {loading ? <Skeleton className="h-8 w-48 mb-2" /> : profile?.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {loading ? <Skeleton className="h-4 w-32" /> : `Member since ${profile?.joinedAt}`}
                </CardDescription>
                <div className="pt-2">
                  <Badge variant="secondary" className="font-normal text-xs">Verified Account</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 animate-fade-in">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    {loading ? <Skeleton className="h-4 w-40 mt-1" /> : (
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone Number</p>
                    {loading ? <Skeleton className="h-4 w-32 mt-1" /> : (
                      <p className="text-sm text-muted-foreground">{profile?.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Saved Address</p>
                    {loading ? <Skeleton className="h-4 w-56 mt-1" /> : (
                      <p className="text-sm text-muted-foreground">{profile?.address}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-center">
                <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto gap-2">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Simple Badge fallback component if Badge isn't imported from ui
function Badge({ children, className, variant = "default" }: any) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants: any = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}
