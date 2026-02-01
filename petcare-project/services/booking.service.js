import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/booking";

// Create a new booking
export const createBooking = (data) => api.post(API_URL, data);

// Get bookings for current user
export const getMyBookings = () => api.get(`${API_URL}/my`);

// Get all bookings (admin only)
export const getAllBookings = () => api.get(API_URL);

// Update booking status (admin/service only)
export const updateBookingStatus = (id, status) =>
  api.put(`${API_URL}/${id}/status`, { status });

// Cancel a booking
export const cancelBooking = (id) => api.put(`${API_URL}/${id}/cancel`);

// Undo cancel a booking (restore within 15 minutes)
export const undoCancel = (id) => api.put(`${API_URL}/${id}/undo-cancel`);

export default {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  undoCancel,
};
