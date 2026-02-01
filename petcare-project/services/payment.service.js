import api from "./api";

export const createPayment = (data) =>
  api.post("/payment", data);

export const uploadSlip = (id, formData) =>
  api.post(`/payment/${id}/upload-slip`, formData);

export const getMyPayments = () =>
  api.get("/payment");

export default {
  createPayment,
  uploadSlip,
  getMyPayments,
};
