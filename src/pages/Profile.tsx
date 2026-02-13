import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { auth } from "@/lib/auth";

const Profile = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        age: "",
        gender: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setIsLoading(true);
        const response = await apiClient.getProfile();

        if (response.data) {
            setProfileData({
                name: response.data.user.name || "",
                email: response.data.user.email || "",
                age: response.data.user.age?.toString() || "",
                gender: response.data.user.gender || "",
            });
        } else {
            toast({
                title: "Error",
                description: "Failed to load profile",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);

        const response = await apiClient.updateProfile({
            name: profileData.name,
            age: profileData.age ? parseInt(profileData.age) : undefined,
            gender: profileData.gender || undefined,
        });

        if (response.data) {
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            setIsEditing(false);
            // Update local storage
            auth.setUser(response.data.user);
        } else {
            toast({
                title: "Error",
                description: response.message || "Failed to update profile",
                variant: "destructive",
            });
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 py-12 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading profile...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
                        <p className="text-muted-foreground">Manage your account information</p>
                    </div>

                    <div className="rounded-2xl bg-card border border-border p-8 shadow-lg">
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        className="pl-10"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative mt-2">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="pl-10"
                                        value={profileData.email}
                                        disabled
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <Label htmlFor="age">Age</Label>
                                <div className="relative mt-2">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Your age"
                                        className="pl-10"
                                        value={profileData.age}
                                        onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <div className="relative mt-2">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="gender"
                                        type="text"
                                        placeholder="Gender"
                                        className="pl-10"
                                        value={profileData.gender}
                                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            {!isEditing ? (
                                <>
                                    <Button
                                        variant="hero"
                                        className="flex-1"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link to="/dashboard">Back to Dashboard</Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="hero"
                                        className="flex-1"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            loadProfile();
                                        }}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
