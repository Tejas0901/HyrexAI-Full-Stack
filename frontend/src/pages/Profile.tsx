import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, LogOut, Mail, Shield, User } from "lucide-react";
import { useEffect } from "react";

const Profile = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Home</span>
        </button>

        <div className="glass-card rounded-2xl p-8 border border-border/30">
          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-muted text-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              {user.provider && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                  <Shield size={12} />
                  {user.provider}
                </span>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
                <User size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm text-foreground">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
                <Mail size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full rounded-xl h-11 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
