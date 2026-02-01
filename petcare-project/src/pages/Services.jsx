
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ServiceCard from "../components/ServiceCard";
import Alert from "../components/Alert";
import serviceApi from "../../services/service.service";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    serviceApi.getAllServices()
      .then((res) => setServices(res.data))
      .catch(() => setError("เกิดข้อผิดพลาดในการโหลดบริการ"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="bg-linear-to-r from-primary to-secondary text-primary-content py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">บริการทางหมดของเรา</h1>
          <p className="opacity-90">
            ครบทุกรูปแบบการดูแลสัตว์เลี้ยง สะดวก ปลอดภัย และไว้ใจทุกขั้นตอน
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-10">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4">กำลังโหลด...</p>
          </div>
        ) : error ? (
          <Alert type="error" title="ข้อผิดพลาด" message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBook={(id) => navigate(`/booking/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;
