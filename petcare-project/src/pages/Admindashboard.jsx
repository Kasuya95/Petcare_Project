// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  PawPrint,
  Users,
  CreditCard,
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import api from "../../services/api";


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get("/payment/admin/stats"),
          api.get("/payment/admin/bookings/pending"),
        ]);
        if (!isMounted) return;
        setStats(statsRes.data);
        setPendingBookings(bookingsRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
        } else {
          setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const statCards = stats
    ? [
        {
          title: "การจองวันนี้",
          value: stats.todayBookings,
          icon: <CalendarDays />, 
          color: "bg-primary",
        },
        {
          title: "รอตรวจสอบ",
          value: stats.pendingPayments,
          icon: <CreditCard />, 
          color: "bg-warning",
        },
        {
          title: "ผู้ใช้ทั้งหมด",
          value: stats.totalUsers,
          icon: <Users />, 
          color: "bg-info",
        },
        {
          title: "รายได้รวม",
          value: `${stats.totalRevenue} ฿`,
          icon: <PawPrint />, 
          color: "bg-success",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">📊 Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card bg-base-100 shadow animate-pulse h-24 sm:h-28" />
              ))
            : statCards.map((s, i) => (
                <div key={i} className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                  <div className="card-body flex flex-col sm:flex-row items-center gap-4">
                    <div className={`p-3 rounded-full text-white ${s.color}`}>
                      {s.icon}
                    </div>
                    <div className="text-center sm:text-left w-full">
                      <p className="text-xs sm:text-sm text-gray-500">{s.title}</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold">{s.value}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Waiting Verify */}
        <Card shadow="md">
          <h2 className="font-semibold mb-4 text-lg sm:text-xl">
            💳 รอตรวจสอบการชำระเงิน
          </h2>
          {loading ? (
            <div className="text-center text-gray-400 py-8">กำลังโหลด...</div>
          ) : error ? (
            <div className="text-center text-error py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="text-xs sm:text-sm">#</th>
                    <th className="text-xs sm:text-sm">ผู้ใช้</th>
                    <th className="text-xs sm:text-sm hidden sm:table-cell">บริการ</th>
                    <th className="text-xs sm:text-sm">ราคา</th>
                    <th className="text-xs sm:text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.length > 0 ? (
                    pendingBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="text-xs sm:text-sm">{b.id}</td>
                        <td className="text-xs sm:text-sm">{b.user?.username || "-"}</td>
                        <td className="text-xs sm:text-sm hidden sm:table-cell">{b.service?.name || "-"}</td>
                        <td className="text-xs sm:text-sm">{b.price} ฿</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate("/admin/bookings")}
                            className="text-xs sm:text-sm"
                          >
                            ตรวจสอบ
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-4">
                        ไม่มีรายการรอตรวจสอบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/admin/services")}
          >
            จัดการบริการ
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/admin/bookings")}
          >
            จัดการการจอง
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/admin/users")}
          >
            จัดการผู้ใช้
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
