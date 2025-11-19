
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../api";
import { toast } from "react-toastify";
import defaultProfilePic from "../assets/default-profile.jpg"; // Adjust path as needed

const ProfilePicture = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      const res = await axiosInstance.post("/user/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAuthUser(res.data.user);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) return;
    try {
      const res = await axiosInstance.delete("/user/profile-picture");
      setAuthUser(res.data.user);
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src={authUser?.profilePic || defaultProfilePic}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border mb-2"
      />
      <label className="cursor-pointer text-sm text-blue-600 hover:underline">
        {uploading ? "Uploading..." : "Change Picture"}
        <input type="file" onChange={handleUpload} hidden accept="image/*" />
      </label>
      {authUser?.profilePic && (
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 mt-1 hover:underline"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default ProfilePicture;
