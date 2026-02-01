import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/service";

// Get all services
export const getAllServices = () => api.get(API_URL);

// Get service by ID
export const getServiceById = (id) => api.get(`${API_URL}/${id}`);

// Create a new service (admin only)
export const createService = (data) => api.post(API_URL, data);

// Update a service (admin only)
export const updateService = (id, data) => api.put(`${API_URL}/${id}`, data);

// Delete a service (admin only)
export const deleteService = (id) => api.delete(`${API_URL}/${id}`);

export default {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
