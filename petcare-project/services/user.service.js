import AuthService from "./auth.service";
import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/user";

// Get all users (admin only)
export const getAllUsers = () => api.get(`${API_URL}/all`);

// Update user role (admin only)
export const updateUserRole = (userId, role) => 
  api.put(`${API_URL}/${userId}/role`, { role });

// Delete user (admin only)
export const deleteUser = (userId) => 
  api.delete(`${API_URL}/${userId}`);

export default {
  ...AuthService,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
