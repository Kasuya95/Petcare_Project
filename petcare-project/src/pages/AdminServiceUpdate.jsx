import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Clock, DollarSign, Type, AlignLeft, Image as ImageIcon, Tag, ArrowLeft } from "lucide-react";
import serviceApi from "../../services/service.service";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Card from "../components/Card";

const CATEGORIES = [
  { id: "GROOMING", name: "อาบน้ำ/ตัดขน", icon: "✂️" },
  { id: "BOARDING", name: "ฝากเลี้ยง", icon: "🏠" },
  { id: "TRAINING", name: "การฝึกสอน", icon: "🎓" },
  { id: "VACCINATION", name: "การฉีดวัคซีน", icon: "💉" },
  { id: "DENTAL", name: "ทำความสะอาดฟัน", icon: "🦷" },
  { id: "OTHER", name: "อื่นๆ", icon: "📋" }
];

const DURATION_PRESETS = [
  { value: 30, label: "30 นาที" },
  { value: 60, label: "1 ชั่วโมง" },
  { value: 90, label: "1.5 ชั่วโมง" },
  { value: 120, label: "2 ชั่วโมง" },
  { value: 240, label: "4 ชั่วโมง" },
  { value: 480, label: "ทั้งวัน (8 ชั่วโมง)" }
];

const AdminServiceUpdate = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await serviceApi.getServiceById(serviceId);
        const service = res.data;
        setForm({
          name: service.name,
          price: service.price,
          description: service.description,
          category: service.category,
          duration: service.duration.toString(),
        });
        setPreview(service.image);
        setError("");
      } catch (err) {
        setError("ไม่พบข้อมูลบริการ");
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลบริการ", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <p className="text-error text-lg font-semibold mb-4">{error}</p>
            <Button onClick={() => navigate("/admin/services")}>
              ← กลับไป
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!form) return null;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDurationPreset = (minutes) => {
    setForm((f) => ({ ...f, duration: minutes.toString() }));
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const mins = parseInt(minutes);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainder = mins % 60;
      return remainder > 0 ? `${hours} ชม. ${remainder} นาที` : `${hours} ชม.`;
    }
    return `${mins} นาที`;
  };

  const handleSubmit = async () => {
    const { name, price, description, category, duration } = form;

    if (!name || !price || !description || !category || !duration) {
      Swal.fire("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    setSubmitting(true);
    try {
      const updateData = {
        name,
        price: Number(price),
        description,
        category,
        duration: Number(duration),
      };

      // Upload image if changed
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await serviceApi.uploadServiceImage(formData);
        updateData.image = uploadRes.data.imageUrl;
      }

      await serviceApi.updateService(serviceId, updateData);
      Swal.fire("สำเร็จ", "อัปเดตบริการเสร็จแล้ว ✓", "success").then(() => {
        navigate("/admin/services");
      });
    } catch (err) {
      Swal.fire("ข้อผิดพลาด", err.response?.data?.message || "อัปเดตไม่สำเร็จ", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => navigate("/admin/services")}
          >
            <ArrowLeft size={20} /> กลับไป
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">แก้ไขบริการ</h1>
        </div>

        {/* Form */}
        <Card shadow="lg">
          <div className="space-y-6">
            {/* Name */}
            <FormInput
              label="ชื่อบริการ"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="เช่น อาบน้ำ + ตัดขน"
            />

            {/* Category */}
            <div className="form-control">
              <label className="label font-semibold">
                <Tag size={18} className="mr-2" /> หมวดหมู่
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="select select-bordered"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <FormInput
              label="ราคา (บาท)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="500"
            />

            {/* Duration */}
            <div className="form-control">
              <label className="label font-semibold">
                <Clock size={18} className="mr-2" /> ระยะเวลา
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleDurationPreset(preset.value)}
                    className={`btn btn-sm ${
                      parseInt(form.duration) === preset.value
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="กรอกเอง (นาที)"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="input input-bordered"
              />
              <p className="text-sm text-gray-500 mt-2">
                {formatDuration(form.duration)}
              </p>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label font-semibold">
                <AlignLeft size={18} className="mr-2" /> รายละเอียด
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="textarea textarea-bordered min-h-24"
                placeholder="อธิบายรายละเอียดบริการ..."
              />
            </div>

            {/* Image */}
            <div className="form-control">
              <label className="label font-semibold">
                <ImageIcon size={18} className="mr-2" /> ภาพถ่าย
              </label>
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                {image ? "เลือกไฟล์ใหม่" : "ปล่อยว่างถ้าไม่ต้องเปลี่ยนรูป"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/admin/services")}
                className="sm:flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={submitting}
                className="sm:flex-1"
              >
                {submitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminServiceUpdate;
