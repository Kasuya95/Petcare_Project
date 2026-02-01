import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import AuthService from "../../services/auth.service";
import Swal from "sweetalert2";

const Profile = () => {
  const { userInfo, logIn } = useContext(UserContext);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    image: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (userInfo) {
      setProfileData({
        username: userInfo.username || "",
        email: userInfo.email || "",
        image: userInfo.image || "",
      });
      setImagePreview(userInfo.image || "https://gitlab.com/Kasuya95/nft8bits/-/raw/main/3.jpg?ref_type=heads");
    }
  }, [userInfo]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire("Error", "Please select an image file only", "error");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    // Prompt for password confirmation
    const { value: password } = await Swal.fire({
      title: 'Confirm Password',
      input: 'password',
      inputLabel: 'Enter your password to confirm changes',
      inputPlaceholder: 'Password',
      inputValidator: (value) => {
        if (!value) {
          return 'Password is required!';
        }
      },
      showCancelButton: true,
    });

    if (!password) return; // Cancelled

    try {
      const formData = new FormData();
      formData.append('password', password);
      if (profileData.username) formData.append('username', profileData.username);
      if (profileData.email) formData.append('email', profileData.email);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await AuthService.updateProfile(formData);

      if (response.status === 200) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        // Update context
        const newImage = selectedFile ? response.data.user.image : userInfo.image;
        logIn({ ...userInfo, ...profileData, image: newImage });
        setSelectedFile(null); // Reset
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update profile", "error");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire("Error", "New passwords do not match", "error");
      return;
    }

    try {
      const response = await AuthService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );

      if (response.status === 200) {
        Swal.fire("Success", "Password changed successfully!", "success");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to change password", "error");
    }
  };

  if (!userInfo) {
    return <div className="text-center mt-10">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* Profile Picture */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Profile Picture</h2>
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src={imagePreview || "https://gitlab.com/Kasuya95/nft8bits/-/raw/main/3.jpg?ref_type=heads"} alt="Profile" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered"
            />
          </div>
        </div>
      </div>

      {/* Update Profile */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Update Profile</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="input input-bordered"
            />
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={handleUpdateProfile}>
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Old Password</span>
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="input input-bordered"
            />
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-secondary" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;