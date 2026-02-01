// src/services/auth.service.js
import api from "./api";

const API_URL =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_AUTH_URL;

/**
 * REGISTER
 */
const register = (username, email, password, role = "USER") => {
  return api.post(`${API_URL}/register`, {
    username,
    email,
    password,
    role,
  });
};

/**
 * LOGIN
 * backend จะ set cookie ให้เอง
 */
const login = (identifier, password) => {
  return api.post(`${API_URL}/login`, {
    identifier,
    password,
  });
};

/**
 * GET PROFILE (ใช้เช็ค login)
 */
const getProfile = () => {
  return api.get(`${API_URL}/profile`);
};

/**
 * UPDATE PROFILE
 */
const updateProfile = (data) => {
  return api.put(`${API_URL}/profile`, data);
};

/**
 * CHANGE PASSWORD
 */
const changePassword = (oldPassword, newPassword) => {
  return api.put(`${API_URL}/change-password`, {
    oldPassword,
    newPassword,
  });
};

/**
 * LOGOUT
 * backend ต้อง clear cookie
 */
const logout = () => {
  return api.post(`${API_URL}/logout`);
};

const AuthService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};

export default AuthService;
