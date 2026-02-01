import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import paymentApi from "../../services/payment.service";
import bookingApi from "../../services/booking.service";

const PROMPTPAY_NUMBER = "0831542243";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [booking, setBooking] = useState(null);
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: 0,
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(Number(value));
    setFormData(prev => ({ ...prev, amount: Number(value) }));
  };

  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    if (!userInfo) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบเพื่อชำระเงิน",
        icon: "info",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [userInfo, navigate]);

  /* =======================
      LOAD BOOKING
  ======================= */
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Get user's bookings instead of all bookings
        const res = await bookingApi.getMyBookings();
        const found = res.data.find((b) => b._id === bookingId);

        if (!found) {
          Swal.fire("ไม่พบข้อมูลการจอง", "", "error");
          navigate("/my-booking");
          return;
        }

        setBooking(found);
        setAmount(Number(found.serviceId?.price) || 0);
      } catch (err) {
        console.error("Error loading booking:", err);
        Swal.fire("โหลดข้อมูลไม่สำเร็จ", err.response?.data?.message || "", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  const qrUrl = `https://promptpay.io/${PROMPTPAY_NUMBER}/${amount}`;

  /* =======================
      HANDLE FILE
  ======================= */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  /* =======================
      CONFIRM PAYMENT
  ======================= */
  const handleConfirmPayment = async () => {
    if (!file) {
      Swal.fire("กรุณาอัปโหลดสลิปการโอน", "", "warning");
      return;
    }

    if (!bookingId) {
      Swal.fire("ไม่พบข้อมูลการจอง", "", "error");
      return;
    }

    try {
      // 1️⃣ CREATE PAYMENT (JSON)
      const paymentData = {
        bookingId,
        amount: Number(amount),
        method: "PROMPTPAY"
      };

      console.log("Creating payment with data:", paymentData);
      
      const res = await paymentApi.createPayment(paymentData);

      const paymentId = res.data.payment._id;

      // 2️⃣ UPLOAD SLIP
      const formData = new FormData();
      formData.append("image", file);

      await paymentApi.uploadSlip(paymentId, formData);

      Swal.fire({
        title: "ชำระเงินสำเร็จ",
        text: "ระบบกำลังตรวจสอบสลิป",
        icon: "success",
      }).then(() => navigate("/my-booking"));
    } catch (err) {
      console.error("Payment error:", err);
      const errorMsg = err.response?.data?.message || err.message || "ไม่สามารถชำระเงินได้";
      Swal.fire(
        "เกิดข้อผิดพลาด",
        errorMsg,
        "error"
      );
    }
  };

  if (loading) {
    return <div className="text-center py-20">กำลังโหลด...</div>;
  }

  /* =======================
      UI
  ======================= */
  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">ชำระเงิน</h2>
          <p className="text-sm opacity-70">Booking ID: {bookingId}</p>

          {/* QR CODE */}
          <div className="flex justify-center py-4">
            <img
              src={qrUrl}
              alt="PromptPay QR"
              className="w-56 h-56 border rounded-xl"
            />
          </div>

          {/* PAYMENT INFO */}
          <div className="bg-base-200 p-4 rounded-lg space-y-2 text-sm">
            <p>ชื่อบัญชี: <b>PetCare Co.,Ltd.</b></p>
            <p>PromptPay: <b>{PROMPTPAY_NUMBER}</b></p>
            <p className="text-xl font-bold text-primary">
              ฿ {amount.toFixed(2)}
            </p>
          </div>

          {/* UPLOAD */}
          <div className="form-control">
            <label className="label font-medium">อัปโหลดสลิปการโอน</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />
          </div>

          {/* BUTTON */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleConfirmPayment}
          >
            ยืนยันการชำระเงิน
          </Button>

          <p className="text-xs opacity-60">
            * กรุณาชำระเงินภายใน 15 นาที
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Payment;
