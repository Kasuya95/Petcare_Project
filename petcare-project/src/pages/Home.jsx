import React from "react";
import { useNavigate } from "react-router";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero */}
      <section
        className="hero min-h-[80vh]"
        style={{
          backgroundImage:
            "url('https://currumbinvetservices.com.au/wp-content/uploads/2024/12/exotic-pet-home.jpg')",
        }}
      >
        {/* overlay */}
        <div className="hero-overlay bg-black/50"></div>

        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <div className="badge badge-outline mb-4">🐾 Pet Care Booking</div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              ดูแลสัตว์เลี้ยงของคุณ
              <br />
              <span className="text-warning">อย่างมืออาชีพ</span>
            </h1>

            <p className="py-4 sm:py-6 text-sm sm:text-base md:text-lg opacity-90">
              ระบบจองบริการอาบน้ำ ตัดขน ฝากเลี้ยง และพาเดินเล่น สะดวก รวดเร็ว
              ปลอดภัย สำหรับคนรักสัตว์
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <button className="btn btn-warning btn-sm sm:btn-md md:btn-lg" onClick={() => navigate("/services")}>จองบริการเลย</button>
              <button className="btn btn-outline btn-sm sm:btn-md md:btn-lg text-white border-white" onClick={() => navigate("/services")}>
                ดูบริการทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4">บริการของเรา</h2>
        <p className="text-center text-sm sm:text-base text-base-content/70 mb-8 sm:mb-12">
          ครบทุกการดูแลสัตว์เลี้ยงในที่เดียว
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Grooming */}
          <div className="card bg-base-200 shadow-xl hover:-translate-y-2 transition">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="Grooming"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="card-title justify-center">อาบน้ำ - ตัดขน</h3>
              <p>ดูแลความสะอาดและความสวยงามโดยช่างผู้เชี่ยวชาญ</p>
            </div>
          </div>

          {/* Boarding */}
          <div className="card bg-base-200 shadow-xl hover:-translate-y-2 transition">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/194/194279.png"
                alt="Pet Boarding"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="card-title justify-center">ฝากเลี้ยงสัตว์</h3>
              <p>ดูแลเหมือนสมาชิกในครอบครัว อบอุ่น ปลอดภัย</p>
            </div>
          </div>

          {/* Walking */}
          <div className="card bg-base-200 shadow-xl hover:-translate-y-2 transition">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1998/1998627.png"
                alt="Pet Walking"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="card-title justify-center">พาเดินเล่น</h3>
              <p>เสริมสุขภาพและความสุขให้สัตว์เลี้ยงของคุณ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-base-200 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          ทำไมต้องเลือกเรา
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                alt="Professional Team"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-lg">ทีมงานมืออาชีพ</h3>
              <p className="text-base-content/70">
                ผ่านการฝึกอบรมและมีประสบการณ์จริง
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                alt="Easy Booking"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-lg">จองง่าย รวดเร็ว</h3>
              <p className="text-base-content/70">
                เลือกวัน เวลา และบริการได้ภายในไม่กี่คลิก
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
                alt="Safe & Care"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="font-semibold text-lg">ปลอดภัยและใส่ใจ</h3>
              <p className="text-base-content/70">
                คำนึงถึงสุขภาพและความปลอดภัยของสัตว์เลี้ยงเป็นหลัก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-neutral text-neutral-content">
        <h2 className="text-4xl font-bold mb-4">
          เริ่มต้นดูแลสัตว์เลี้ยงของคุณวันนี้
        </h2>
        <p className="mb-8 opacity-80">สมัครสมาชิกและจองบริการได้ทันที</p>
        <button className="btn btn-primary btn-lg"  onClick={() => navigate("/register")}>เริ่มต้นใช้งาน</button>
      </section>
    </div>
  );
};

export default Home;
