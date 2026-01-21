import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { theme } from "../../theme";
import type { UserResponse } from "../../types/auth";
import type { UpdateProfileInput, ChangePasswordInput } from "../../types/user";

import { useToast } from "../../context/ToastContext";

export default function PersonalInfo() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<UpdateProfileInput>({
    firstName: "",
    lastName: "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordInput>({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.changePassword(passwordData);
      showToast("Password changed successfully!", "success");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to change password.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl space-y-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-2" style={{ color: theme.colors.primary }}>Personal Info</h1>
        <p className="opacity-60 font-medium">Manage your personal details and security.</p>
      </div>



      {/* Form Grid */}
      <div className="space-y-10">
        
        {/* Profile Details */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-black/10"></div>
              <span className="text-xs font-black uppercase tracking-widest opacity-40">Basic Details</span>
              <div className="h-px flex-1 bg-black/10"></div>
           </div>

           <form onSubmit={handleUpdateProfile} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase ml-1 opacity-60">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-4 rounded-xl bg-white border border-stone-200 focus:border-stone-400 outline-none font-bold transition-all invalid:border-red-300 invalid:text-red-500"
                    style={{ color: theme.colors.primary }}
                    placeholder="Enter First Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase ml-1 opacity-60">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-4 rounded-xl bg-white border border-stone-200 focus:border-stone-400 outline-none font-bold transition-all"
                    style={{ color: theme.colors.primary }}
                  />
                </div>
             </div>
             
              <div className="space-y-2">
                  <label className="text-xs font-bold uppercase ml-1 opacity-60">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email}
                    disabled
                    className="w-full p-4 rounded-xl bg-stone-50 border border-transparent outline-none font-bold opacity-60 cursor-not-allowed"
                    style={{ color: theme.colors.primary }}
                  />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                  style={{ background: theme.colors.secondary }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
           </form>
        </section>

        {/* Security */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-black/10"></div>
              <span className="text-xs font-black uppercase tracking-widest opacity-40">Security</span>
              <div className="h-px flex-1 bg-black/10"></div>
           </div>

           <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                  <label className="text-xs font-bold uppercase ml-1 opacity-60">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.oldPassword}
                    onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    className="w-full p-4 rounded-xl bg-white border border-stone-200 focus:border-stone-400 outline-none font-bold transition-all"
                    style={{ color: theme.colors.primary }}
                    placeholder="••••••••"
                  />
              </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase ml-1 opacity-60">New Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full p-4 rounded-xl bg-white border border-stone-200 focus:border-stone-400 outline-none font-bold transition-all"
                    style={{ color: theme.colors.primary }}
                    placeholder="••••••••"
                  />
              </div>

               <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl border-2 font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
           </form>
        </section>
      </div>
    </div>
  );
}
