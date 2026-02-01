import { useState } from "react";
import serviceApi from "../../services/service.service";
import { useNavigate } from "react-router";
import { Clock, DollarSign, Type, AlignLeft, Image as ImageIcon, Tag } from "lucide-react";

const CATEGORIES = [
  {
    id: "GROOMING",
    name: "อาบน้ำ/ตัดขน",
    icon: "✂️",
    description: "บริการอาบน้ำและตัดขนสำหรับสัตว์เลี้ยง"
  },
  {
    id: "BOARDING",
    name: "ฝากเลี้ยง",
    icon: "🏠",
    description: "บริการฝากเลี้ยงระหว่างคืน"
  },
  {
    id: "TRAINING",
    name: "การฝึกสอน",
    icon: "🎓",
    description: "บริการฝึกสอนพฤติกรรมสัตว์เลี้ยง"
  },
  {
    id: "VACCINATION",
    name: "การฉีดวัคซีน",
    icon: "💉",
    description: "บริการฉีดวัคซีนและทำความสะอาด"
  },
  {
    id: "DENTAL",
    name: "ทำความสะอาดฟัน",
    icon: "🦷",
    description: "บริการทำความสะอาดฟันสัตว์เลี้ยง"
  },
  {
    id: "OTHER",
    name: "อื่นๆ",
    icon: "📋",
    description: "บริการอื่นๆ"
  }
];

const DURATION_PRESETS = [
  { value: 30, label: "30 นาที" },
  { value: 60, label: "1 ชั่วโมง" },
  { value: 90, label: "1.5 ชั่วโมง" },
  { value: 120, label: "2 ชั่วโมง" },
  { value: 240, label: "4 ชั่วโมง" },
  { value: 480, label: "ทั้งวัน (8 ชั่วโมง)" }
];

const AdminServiceForm = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "GROOMING",
    duration: "60",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const navigate = useNavigate();

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
    setCustomDuration("");
  };

  const handleCustomDuration = (e) => {
    const value = e.target.value;
    setCustomDuration(value);
    if (value) {
      setForm((f) => ({ ...f, duration: value }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const errors = [];
    
    if (!form.name.trim()) {
      errors.push("• ชื่อบริการ");
    }
    if (!form.description.trim()) {
      errors.push("• คำอธิบาย");
    }
    if (!form.price || form.price <= 0) {
      errors.push("• ราคา (ต้องมากกว่า 0)");
    }
    if (!form.duration || form.duration <= 0) {
      errors.push("• ระยะเวลา");
    }
    if (!form.category) {
      errors.push("• หมวดหมู่");
    }
    if (!image) {
      errors.push("• รูปบริการ");
    }
    
    if (errors.length > 0) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน:\n" + errors.join("\n"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("duration", form.duration);
      formData.append("image", image);
      await serviceApi.createService(formData);
      navigate("/admin/services");
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">เพิ่มบริการใหม่</h1>
        <p className="text-gray-600 mb-6">กรอกข้อมูลบริการและเลือกหมวดหมู่</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <Type size={18} className="text-primary" />
                ชื่อบริการ
              </span>
            </label>
            <input
              className="input input-bordered focus:input-primary"
              name="name"
              placeholder="เช่น อาบน้ำพิเศษ, ฝากเลี้ยง 1 คืน"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Category Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <Tag size={18} className="text-primary" />
                หมวดหมู่บริการ
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChange({ target: { name: "category", value: cat.id } })}
                  className={`p-3 rounded-lg border-2 transition text-left ${
                    form.category === cat.id
                      ? "border-primary bg-primary bg-opacity-10"
                      : "border-base-300 hover:border-primary"
                  }`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div className="text-xs text-gray-600">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <DollarSign size={18} className="text-success" />
                  ราคา (บาท)
                </span>
              </label>
              <input
                className="input input-bordered focus:input-primary"
                name="price"
                type="number"
                placeholder="0"
                value={form.price}
                onChange={handleChange}
                min={0}
                step={100}
              />
            </div>

            {/* Duration */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Clock size={18} className="text-info" />
                  ระยะเวลา
                </span>
              </label>
              {form.duration && (
                <div className="text-sm text-gray-500 mb-2">
                  ระยะเวลาที่เลือก: <span className="font-semibold text-primary">{formatDuration(form.duration)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Duration Presets */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">เลือกจากตัวเลือกทั่วไป</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
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
          </div>

          {/* Custom Duration */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">หรือกรอกระยะเวลาเอง (นาที)</span>
            </label>
            <input
              className="input input-bordered focus:input-primary"
              type="number"
              placeholder="กรอกจำนวนนาที"
              value={customDuration}
              onChange={handleCustomDuration}
              min={1}
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <AlignLeft size={18} className="text-secondary" />
                คำอธิบาย
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered focus:textarea-primary"
              name="description"
              placeholder="อธิบายรายละเอียดของบริการ เช่น สิ่งที่รวมอยู่, ข้อแนะนำ"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <ImageIcon size={18} className="text-warning" />
                รูปบริการ
              </span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-input"
                onChange={handleImageChange}
              />
              <label htmlFor="image-input" className="cursor-pointer">
                {!preview ? (
                  <div>
                    <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">คลิกเพื่อเลือกรูปภาพ</p>
                    <p className="text-xs text-gray-500">JPG, PNG (แนะนำขนาด 800x600px)</p>
                  </div>
                ) : (
                  <img src={preview} alt="preview" className="w-full h-48 object-cover rounded mb-2" />
                )}
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview("");
                    document.getElementById("image-input").value = "";
                  }}
                  className="btn btn-sm btn-outline mt-2"
                >
                  เปลี่ยนรูป
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" /></svg>
                <div>
                  <h3 className="font-bold">ข้อมูลไม่ครบถ้วน</h3>
                  <div className="text-sm whitespace-pre-line">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            className="btn btn-primary w-full btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                กำลังบันทึก...
              </>
            ) : (
              "สร้างบริการใหม่"
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            className="btn btn-outline w-full"
          >
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminServiceForm;
