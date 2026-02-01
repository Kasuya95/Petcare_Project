
import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { CalendarDays, Clock, PawPrint } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Card from "../components/Card";
import serviceApi from "../../services/service.service";
import bookingApi from "../../services/booking.service";

const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
];

const Booking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: "",
    time: "",
    petName: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    if (!userInfo) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบเพื่อทำการจองบริการ",
        icon: "info",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    setLoading(true);
    setError("");
    serviceApi.getServiceById(serviceId)
      .then((res) => setService(res.data))
      .catch(() => setError("ไม่พบข้อมูลบริการ"))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleSubmit = async () => {
    const { date, time, petName, note } = form;
    if (!date || !time || !petName) {
      Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }
    Swal.fire({
      title: "ยืนยันการจอง",
      html: `
        <div style="text-align:left">
          <p><b>บริการ:</b> ${service?.name}</p>
          <p><b>วันที่:</b> ${date}</p>
          <p><b>เวลา:</b> ${time}</p>
          <p><b>สัตว์เลี้ยง:</b> ${petName}</p>
          <p><b>ราคา:</b> ${service?.price} บาท</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "ไปชำระเงิน",
      cancelButtonText: "ยกเลิก",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const resp = await bookingApi.createBooking({
            serviceId: serviceId,
            bookingDate: date,
            bookingTime: time,
            petName,
            note,
          });
          const bookingId = resp.data.booking._id;
          Swal.fire("จองสำเร็จ", "กรุณาชำระเงินภายใน 15 นาที 🐾", "success").then(() => {
            navigate(`/payment/${bookingId}`);
          });
        } catch (err) {
          Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message || "ไม่สามารถจองได้", "error");
        }
      }
    });
  };

  if (loading) return <div className="text-center py-10">กำลังโหลด...</div>;
  if (error || !service) return <div className="text-center text-error py-10">{error || "ไม่พบข้อมูลบริการ"}</div>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* LEFT: Service Summary */}
        <div className="md:col-span-1">
          <Card shadow="xl" className="sticky top-6">
            <h2 className="text-xl font-bold mb-3">{service.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{service.description}</p>
            <div className="divider" />
            <div className="text-3xl font-bold text-primary mb-3">{service.price} ฿</div>
            <span className="badge badge-outline">PetCare Service</span>
          </Card>
        </div>

        {/* RIGHT: Booking Form */}
        <div className="md:col-span-2">
          <Card shadow="xl">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">ข้อมูลการจอง</h1>

              <FormInput
                label="วันที่เข้ารับบริการ"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                clearable
              />

              <div className="form-control">
                <label className="label font-medium">ช่วงเวลา</label>
                <select
                  name="time"
                  value={form.time}
                  className="select select-bordered"
                  onChange={handleChange}
                >
                  <option value="">เลือกเวลา</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="ชื่อสัตว์เลี้ยง"
                name="petName"
                value={form.petName}
                placeholder="เช่น Milo, Luna"
                onChange={handleChange}
                clearable
              />

              <div className="form-control">
                <label className="label font-medium">หมายเหตุ</label>
                <textarea
                  name="note"
                  value={form.note}
                  className="textarea textarea-bordered"
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                  onChange={handleChange}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmit}
              >
                🐾 ยืนยันการจอง
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default Booking;
