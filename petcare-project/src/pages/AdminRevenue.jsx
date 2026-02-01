import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminRevenue = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/api/v1/admin/revenue")
      .then((res) => setRevenue(res.data))
      .catch(() => setError("เกิดข้อผิดพลาดในการโหลดข้อมูลรายได้"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">📊 รายงานรายได้</h2>
        {loading ? (
          <div className="text-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4">กำลังโหลด...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : revenue ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600 mb-2">รายได้รวมทั้งหมด</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success">{revenue.total} ฿</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600 mb-2">รายได้เดือนนี้</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{revenue.thisMonth} ฿</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600 mb-2">รายได้วันนี้</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-info">{revenue.today} ฿</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminRevenue;
