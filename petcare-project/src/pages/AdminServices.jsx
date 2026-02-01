import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Edit2, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import Button from "../components/Button";
import Card from "../components/Card";
import serviceApi from "../../services/service.service";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");
    serviceApi.getAllServices()
      .then((res) => setServices(res.data))
      .catch(() => setError("เกิดข้อผิดพลาดในการโหลดบริการ"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (serviceId) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณแน่ใจว่าต้องการลบบริการนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await serviceApi.deleteService(serviceId);
        setServices(services.filter((s) => s._id !== serviceId));
        Swal.fire("สำเร็จ", "ลบบริการแล้ว", "success");
      } catch (err) {
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบบริการได้", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">จัดการบริการ</h2>
          <Button
            variant="primary"
            onClick={() => navigate("/admin/services/create")}
          >
            <Plus size={18} /> สร้างบริการใหม่
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <div className="space-y-4">
            {services.map((s, i) => (
              <Card key={s._id} shadow="md">
                <div className="flex flex-col sm:grid sm:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-4 items-stretch sm:items-center">
                  {/* Image */}
                  <div className="sm:col-span-1 lg:col-span-1">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-full h-24 sm:h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-24 sm:h-20 bg-base-200 rounded flex items-center justify-center">
                        <span className="text-xs">ไม่มีรูป</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <h3 className="font-bold text-sm sm:text-base line-clamp-1">{s.name}</h3>
                    <p className="text-xs text-gray-500">{s.category}</p>
                    <p className="text-xs line-clamp-1">{s.description}</p>
                  </div>

                  {/* Price & Duration */}
                  <div className="sm:col-span-1 lg:col-span-2 text-right">
                    <p className="font-bold text-sm sm:text-base text-primary">{s.price} ฿</p>
                    <p className="text-xs text-gray-500">{Math.floor(s.duration / 60)} ชม.</p>
                  </div>

                  {/* Buttons */}
                  <div className="sm:col-span-2 lg:col-span-4 flex gap-2 w-full">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => navigate(`/admin/services/edit/${s._id}`)}
                    >
                      <Edit2 size={14} /> แก้ไข
                    </Button>
                    <Button
                      size="sm"
                      variant="error"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => handleDelete(s._id)}
                    >
                      <Trash2 size={14} /> ลบ
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
