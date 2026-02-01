import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { PawPrint } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import BookingCard from "../components/BookingCard";
import Button from "../components/Button";
import Modal from "../components/Modal";
import bookingApi from "../../services/booking.service";

const MyBooking = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    if (!userInfo) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบเพื่อดูข้อมูลการจอง",
        icon: "info",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    // Update countdowns every second
    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(bookingId => {
          const remaining = updated[bookingId] - 1;
          if (remaining <= 0) {
            delete updated[bookingId];
          } else {
            updated[bookingId] = remaining;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await bookingApi.getMyBookings();
      setBookings(res.data);
      
      // Initialize countdowns for cancelled bookings
      const newCountdowns = {};
      res.data.forEach(b => {
        if (b.status === 'CANCELLED' && b.cancelledAt) {
          const cancelledTime = new Date(b.cancelledAt).getTime();
          const now = Date.now();
          const remaining = Math.max(0, 15 * 60 - Math.floor((now - cancelledTime) / 1000));
          if (remaining > 0) {
            newCountdowns[b._id] = remaining;
          }
        }
      });
      setCountdowns(newCountdowns);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("ยืนยันการยกเลิกการจองนี้? การจองจะถูกลบเมื่อหลังจาก 15 นาที")) {
      try {
        await bookingApi.cancelBooking(bookingId);
        fetchBookings();
      } catch {
        alert("ไม่สามารถยกเลิกการจองได้");
      }
    }
  };

  const handleUndoCancel = async (bookingId) => {
    try {
      await bookingApi.undoCancel(bookingId);
      fetchBookings();
      alert("ยกเลิกการยกเลิกสำเร็จ!");
    } catch (err) {
      alert(err.response?.data?.message || "ไม่สามารถยกเลิกการยกเลิกได้");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-primary" />
            การจองของฉัน
          </h1>
          <p className="text-gray-600 mt-2">ดูประวัติการจองและสถานะการชำระเงิน</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4">กำลังโหลด...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancel={() => handleCancel(b._id)}
                onUndoCancel={() => handleUndoCancel(b._id)}
                onPayment={() => navigate(`/payment/${b._id}`)}
                onViewSlip={() => setSelectedSlip(b)}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">ยังไม่มีการจอง</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate("/services")}
            >
              ดูบริการทั้งหมด
            </Button>
          </div>
        )}
      </div>

      {/* Slip Modal */}
      <Modal
        isOpen={!!selectedSlip}
        onClose={() => setSelectedSlip(null)}
        title="สลิปการชำระเงิน"
        size="lg"
      >
        {selectedSlip && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">บริการ</p>
                <p className="font-semibold">{selectedSlip.serviceId?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">สัตว์เลี้ยง</p>
                <p className="font-semibold">{selectedSlip.petName}</p>
              </div>
              <div>
                <p className="text-gray-500">ราคา</p>
                <p className="font-semibold text-success">{selectedSlip.serviceId?.price} ฿</p>
              </div>
              <div>
                <p className="text-gray-500">วันที่จอง</p>
                <p className="font-semibold">{formatDate(selectedSlip.bookingDate)}</p>
              </div>
            </div>
            {selectedSlip.slipUrl ? (
              <div className="border rounded bg-gray-50 p-4">
                <img
                  src={selectedSlip.slipUrl}
                  alt="Payment Slip"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="alert alert-warning">ไม่มีรูปสลิป</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBooking;
