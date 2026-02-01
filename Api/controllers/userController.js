const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase.config');

// Helper function to sanitize user data
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

// Register
exports.register = async (req, res) => {
  try {
    console.log("=== REGISTER USER START ===");
    console.log("req.body:", req.body);

    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        message: "username, email, password are required",
      });
    }

    console.log("✅ All validations passed, registering user...");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'USER'
    });

    await user.save();

    console.log("✅ User registered successfully:", user._id);
    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("❌ Error in register:", error);
    res.status(500).json({ error: "Server error at register", message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    console.log("=== LOGIN USER START ===");
    console.log("Login attempt:", {
  identifier: req.body.identifier,
});


    const { identifier, password } = req.body;

    if (!identifier || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        message: "identifier and password are required",
      });
    }

    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return res.status(401).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET || 'secret', { expiresIn: '1d' });

    // Set JWT in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    console.log("✅ User logged in successfully:", user._id);
    res.json({
      message: "Login successful",
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ error: "Server error at login", message: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    console.log("=== LOGOUT START ===");
    
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log("✅ User logged out successfully");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Error in logout:", error);
    res.status(500).json({ error: "Server error at logout", message: error.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    console.log("=== GET PROFILE START ===");
    console.log("User ID:", req.user._id);

    // User is already fetched in authenticate middleware
    if (!req.user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile retrieved successfully");
    res.json(sanitizeUser(req.user));
  } catch (error) {
    console.error("❌ Error in getProfile:", error);
    res.status(500).json({ error: "Server error at get profile", message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("=== UPDATE PROFILE START ===");
    console.log("User ID:", req.authorId);
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Has file:", !!req.file);

    const { password, username, email } = req.body;

    // Check password
    if (!password) {
      console.log("❌ Password required for profile update");
      return res.status(400).json({ message: "Password is required to update profile" });
    }

    const user = await User.findById(req.authorId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    // Handle image upload
    let imageUrl = user.image; // Keep existing if no new file
    if (req.file) {
      // Delete old image if exists
      if (user.image && user.image.includes('supabase')) {
        const oldFileName = user.image.split('/').pop();
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from('Profile')
            .remove([oldFileName]);
          if (deleteError) {
            console.log("⚠️ Failed to delete old image:", deleteError);
          } else {
            console.log("✅ Old image deleted");
          }
        }
      }

      // Upload new image
      const fileName = `user_${user._id}_${Date.now()}.${req.file.mimetype.split('/')[1]}`;
      const { data, error } = await supabase.storage
        .from('Profile')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        console.log("❌ Failed to upload image:", error);
        return res.status(500).json({ message: "Failed to upload image" });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('Profile')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
      console.log("✅ New image uploaded:", imageUrl);
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    user.image = imageUrl;

    await user.save();

    console.log("✅ Profile updated successfully");
    res.json({
      message: "Profile Updated Successfully!",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("❌ Error in updateProfile:", error);
    res.status(500).json({ error: "Server error at update profile", message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    console.log("=== CHANGE PASSWORD START ===");
    console.log("User ID:", req.authorId);
    console.log("Has oldPassword and newPassword:", !!(req.body.oldPassword && req.body.newPassword));

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "oldPassword and newPassword are required" });
    }

    const user = await User.findById(req.authorId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      console.log("❌ Old password incorrect");
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    console.log("✅ Password changed successfully");
    res.json({ message: "Password Changed Successfully!" });
  } catch (error) {
    console.error("❌ Error in changePassword:", error);
    res.status(500).json({ error: "Server error at change password", message: error.message });
  }
};

// Get all users (ADMIN ONLY)
exports.getAllUsers = async (req, res) => {
  try {
    console.log("=== GET ALL USERS START ===");
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can access all users" });
    }

    const users = await User.find().select('-password');
    console.log(`✅ Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error);
    res.status(500).json({ error: "Server error at get all users", message: error.message });
  }
};

// Update user role (ADMIN ONLY)
exports.updateUserRole = async (req, res) => {
  try {
    console.log("=== UPDATE USER ROLE START ===");
    const { id } = req.params;
    const { role } = req.body;
    console.log("User ID to update:", id);
    console.log("New role:", role);
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can update user roles" });
    }

    if (!id) {
      console.log("❌ No user ID provided");
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!role) {
      console.log("❌ No role provided");
      return res.status(400).json({ message: "Role is required" });
    }

    const validRoles = ['USER', 'SERVICE', 'ADMIN'];
    if (!validRoles.includes(role)) {
      console.log("❌ Invalid role:", role);
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User role updated successfully");
    res.json({
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    console.error("❌ Error in updateUserRole:", error);
    res.status(500).json({ error: "Server error at update user role", message: error.message });
  }
};

// Delete user (ADMIN ONLY)
exports.deleteUser = async (req, res) => {
  try {
    console.log("=== DELETE USER START ===");
    const { id } = req.params;
    console.log("User ID to delete:", id);
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    if (!id) {
      console.log("❌ No user ID provided");
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user image from Supabase if exists
    if (user.image && user.image.includes('supabase')) {
      try {
        const imagePath = user.image.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('Profile')
            .remove([imagePath]);
          console.log("✅ User image deleted from Supabase");
        }
      } catch (err) {
        console.log("⚠️ Failed to delete user image:", err.message);
      }
    }

    // Delete user
    await User.findByIdAndDelete(id);

    console.log("✅ User deleted successfully");
    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error in deleteUser:", error);
    res.status(500).json({ error: "Server error at delete user", message: error.message });
  }
};