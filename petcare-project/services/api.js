import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true, // ⭐ สำคัญที่สุด
});

instance.interceptors.request.use((config) => {
  // ❌ ไม่ต้องแนบ token เองแล้ว
  // browser จะส่ง cookie ให้อัตโนมัติ

  // สำหรับ FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default instance;
