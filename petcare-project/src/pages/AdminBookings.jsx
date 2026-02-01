import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle, Clock, RefreshCw, Eye } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";

const AdminBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const pendingRes = await api.get("/payment/admin/bookings/pending");
      setPendingBookings(pendingRes.data);
      
      const allRes = await api.get("/payment/admin/all");
      setAllBookings(allRes.data);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
    Swal.fire("สำเร็จ", "อัปเดตข้อมูลแล้ว", "success");
  };

  const handleApprove = async (booking) => {
    const result = await Swal.fire({
      title: "อนุมัติการชำระเงิน?",
      html: `<div style="text-align: left; font-size: 14px;">
        <p><b>ผู้ใช้:</b> ${booking.user?.username || booking.bookingId?.userId?.username}</p>
        <p><b>บริการ:</b> ${booking.bookingId?.serviceId?.name || booking.service?.name}</p>
        <p><b>จำนวนเงิน:</b> <span style="color: #22c55e; font-weight: bold;">${booking.amount || booking.price} ฿</span></p>
      </div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยันการอนุมัติ",
      confirmButtonColor: "#22c55e",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const bookingId = booking.id || booking.bookingId?._id;
        if (!bookingId) {
          Swal.fire("ข้อผิดพลาด", "ไม่สามารถหาข้อมูลการจองได้", "error");
          return;
        }
        await api.put(`/payment/admin/bookings/${bookingId}/approve`);
        await fetchBookings();
        Swal.fire("สำเร็จ", "อนุมัติการชำระเงินแล้ว", "success");
      } catch (err) {
        Swal.fire("ข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถอนุมัติได้", "error");
      }
    }
  };

  const handleReject = async (booking) => {
    const result = await Swal.fire({
      title: "ปฏิเสธการชำระเงิน?",
      html: `<div style="text-align: left; font-size: 14px;">
        <p><b>ผู้ใช้:</b> ${booking.user?.username || booking.bookingId?.userId?.username}</p>
        <p><b>บริการ:</b> ${booking.bookingId?.serviceId?.name || booking.service?.name}</p>
        <p><b>จำนวนเงิน:</b> <span style="color: #ef4444; font-weight: bold;">${booking.amount || booking.price} ฿</span></p>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยันการปฏิเสธ",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const bookingId = booking.id || booking.bookingId?._id;
        if (!bookingId) {
          Swal.fire("ข้อผิดพลาด", "ไม่สามารถหาข้อมูลการจองได้", "error");
          return;
        }
        await api.put(`/payment/admin/bookings/${bookingId}/reject`);
        await fetchBookings();
        Swal.fire("สำเร็จ", "ปฏิเสธการชำระเงินแล้ว", "success");
      } catch (err) {
        Swal.fire("ข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถปฏิเสธได้", "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <div className="badge badge-lg badge-warning gap-2"><Clock size={14} />รอตรวจสอบ</div>;
      case "PAID":
        return <div className="badge badge-lg badge-success gap-2"><CheckCircle size={14} />อนุมัติแล้ว</div>;
      case "REJECTED":
        return <div className="badge badge-lg badge-error gap-2"><XCircle size={14} />ปฏิเสธแล้ว</div>;
      default:
        return <div className="badge">{status}</div>;
    }
  };

  const getFilteredBookings = () => {
    if (filter === "pending") return pendingBookings;
    if (filter === "approved") return allBookings.filter(b => b.status === "PAID");
    if (filter === "rejected") return allBookings.filter(b => b.status === "REJECTED");
    if (filter === "all") return allBookings;
    return allBookings;
  };

  const displayedBookings = getFilteredBookings();
  const pendingCount = pendingBookings.length;
  const approvedCount = allBookings.filter(b => b.status === "PAID").length;
  const rejectedCount = allBookings.filter(b => b.status === "REJECTED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">จัดการการชำระเงิน</h1>
            <p className="text-sm sm:text-base text-gray-600">ตรวจสอบและอนุมัติการชำระเงินจากผู้ใช้</p>
          </div>
          <button
            className={`btn btn-outline btn-sm gap-2 ${refreshing ? "loading" : ""}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} />
            รีเฟรช
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card bg-warning bg-opacity-10 border border-warning hover:shadow-lg transition-shadow">
            <div className="card-body p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-warning text-xs sm:text-sm font-semibold">รอตรวจสอบ</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-warning mt-2">{pendingCount}</p>
                </div>
                <Clock className="text-warning opacity-50" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-success bg-opacity-10 border border-success hover:shadow-lg transition-shadow">
            <div className="card-body p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-success text-xs sm:text-sm font-semibold">อนุมัติแล้ว</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success mt-2">{approvedCount}</p>
                </div>
                <CheckCircle className="text-success opacity-50" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-error bg-opacity-10 border border-error hover:shadow-lg transition-shadow">
            <div className="card-body p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-error text-xs sm:text-sm font-semibold">ปฏิเสธแล้ว</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-error mt-2">{rejectedCount}</p>
                </div>
                <XCircle className="text-error opacity-50" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-info bg-opacity-10 border border-info hover:shadow-lg transition-shadow">
            <div className="card-body p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-info text-xs sm:text-sm font-semibold">ทั้งหมด</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-info mt-2">{allBookings.length}</p>
                </div>
                <Eye className="text-info opacity-50" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body p-0">
            <div className="tabs tabs-bordered text-xs sm:text-sm md:text-base overflow-x-auto">
              <button
                className={`tab tab-lg flex-1 text-xs sm:text-sm md:text-base ${filter === "pending" ? "tab-active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                <Clock size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">รอตรวจสอบ</span>
                <span className="badge badge-warning badge-sm ml-1 sm:ml-2">{pendingCount}</span>
              </button>
              <button
                className={`tab tab-lg flex-1 text-xs sm:text-sm md:text-base ${filter === "approved" ? "tab-active" : ""}`}
                onClick={() => setFilter("approved")}
              >
                <CheckCircle size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">อนุมัติแล้ว</span>
                <span className="badge badge-success badge-sm ml-1 sm:ml-2">{approvedCount}</span>
              </button>
              <button
                className={`tab tab-lg flex-1 text-xs sm:text-sm md:text-base ${filter === "rejected" ? "tab-active" : ""}`}
                onClick={() => setFilter("rejected")}
              >
                <XCircle size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">ปฏิเสธแล้ว</span>
                <span className="badge badge-error badge-sm ml-1 sm:ml-2">{rejectedCount}</span>
              </button>
              <button
                className={`tab tab-lg flex-1 text-xs sm:text-sm md:text-base ${filter === "all" ? "tab-active" : ""}`}
                onClick={() => setFilter("all")}
              >
                ทั้งหมด
                <span className="badge badge-info badge-sm ml-1 sm:ml-2">{allBookings.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-gray-600">กำลังโหลด...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        ) : displayedBookings.length > 0 ? (
          <div className="space-y-4">
            {displayedBookings.map((b, i) => (
              <div key={b._id || b.id} className="card bg-base-100 shadow-md hover:shadow-lg transition">
                <div className="card-body p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start mb-4 gap-3">
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">#{i + 1}</div>
                      <h3 className="text-base sm:text-lg font-bold">{b.user?.username || b.bookingId?.userId?.username || "-"}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(b.status)}
                      <div className="text-xl sm:text-2xl font-bold text-success">{b.amount || b.price || 0} ฿</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold">บริการ</p>
                      <p className="font-semibold text-sm">{b.bookingId?.serviceId?.name || b.service?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold">สัตว์เลี้ยง</p>
                      <p className="font-semibold text-sm">{b.bookingId?.petName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold">วันที่จอง</p>
                      <p className="font-semibold text-sm">{b.bookingId?.bookingDate ? new Date(b.bookingId.bookingDate).toLocaleDateString("th-TH") : "-"}</p>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-between items-start sm:items-center">
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      {b.slipUrl && (
                        <button
                          className="btn btn-sm btn-outline btn-info gap-2 text-xs"
                          onClick={() => setSelectedSlip(b)}
                        >
                          <Eye size={14} />
                          ดูสลิป
                        </button>
                      )}
                    </div>

                    {(filter === "pending" || b.status === "PENDING") && (
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                        <button
                          className="btn btn-sm btn-success gap-2 text-xs"
                          onClick={() => handleApprove(b)}
                        >
                          <CheckCircle size={14} />
                          อนุมัติ
                        </button>
                        <button
                          className="btn btn-sm btn-error gap-2 text-xs"
                          onClick={() => handleReject(b)}
                        >
                          <XCircle size={14} />
                          ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center py-12">
              <p className="text-gray-600 text-lg">
                {filter === "pending" ? "ไม่มีรายการรอตรวจสอบ ✨" : `ไม่มีรายการ${filter}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Slip Modal */}
      {selectedSlip && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">สลิปการชำระเงิน</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedSlip(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-200 p-4 rounded">
                  <p className="text-gray-600 text-xs font-semibold">ผู้ใช้</p>
                  <p className="font-bold text-lg">{selectedSlip.user?.username || selectedSlip.bookingId?.userId?.username}</p>
                </div>
                <div className="bg-base-200 p-4 rounded">
                  <p className="text-gray-600 text-xs font-semibold">บริการ</p>
                  <p className="font-bold">{selectedSlip.bookingId?.serviceId?.name || selectedSlip.service?.name}</p>
                </div>
                <div className="bg-base-200 p-4 rounded">
                  <p className="text-gray-600 text-xs font-semibold">ราคา</p>
                  <p className="font-bold text-success text-lg">{selectedSlip.amount || selectedSlip.price} ฿</p>
                </div>
                <div className="bg-base-200 p-4 rounded">
                  <p className="text-gray-600 text-xs font-semibold">สถานะ</p>
                  <p>{getStatusBadge(selectedSlip.status)}</p>
                </div>
              </div>

              {/* Slip Image */}
              {selectedSlip.slipUrl ? (
                <div className="border-2 border-dashed border-base-300 rounded p-4">
                  <img
                    src={selectedSlip.slipUrl}
                    alt="Payment Slip"
                    className="w-full h-auto rounded"
                  />
                </div>
              ) : (
                <div className="alert alert-warning">ไม่มีรูปสลิป</div>
              )}
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn"
                onClick={() => setSelectedSlip(null)}
              >
                ปิด
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setSelectedSlip(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminBookings;