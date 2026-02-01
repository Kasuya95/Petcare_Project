# 🐾 PetCare - Pet Services Booking System

ระบบจองบริการดูแลสัตว์เลี้ยงออนไลน์ที่ครบครัน อบอุ่น และปลอดภัย

## 📋 สารบัญ
- [ภาพรวม](#ภาพรวม)
- [คุณสมบัติ](#คุณสมบัติ)
- [เทคโนโลยี](#เทคโนโลยี)
- [การติดตั้ง](#การติดตั้ง)
- [การใช้งาน](#การใช้งาน)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [API Documentation](#api-documentation)

## 🎯 ภาพรวม

**PetCare** เป็นเว็บแอปพลิเคชันที่ช่วยให้ผู้ใช้สามารถจองบริการดูแลสัตว์เลี้ยงได้สะดวกสบาย เช่น:
- 🛁 อาบน้ำและตัดขน (Grooming)
- 🏠 ฝากเลี้ยงสัตว์ (Boarding)
- 🎓 การฝึกสอน (Training)
- 💉 ฉีดวัคซีน (Vaccination)
- 🦷 ทำความสะอาดฟัน (Dental Care)

และมีระบบ Admin Dashboard เพื่อจัดการบริการและการชำระเงิน

---

## ✨ คุณสมบัติ

### สำหรับผู้ใช้ (User)
- ✅ ลงทะเบียนและเข้าสู่ระบบ (Authentication)
- ✅ ดูรายการบริการทั้งหมด
- ✅ จองบริการกับวันเวลาที่ต้องการ
- ✅ ชำระเงินผ่าน PromptPay QR Code
- ✅ ติดตามสถานะการจอง
- ✅ ดูประวัติการจองและการชำระเงิน
- ✅ ยกเลิกการจอง (หากยังไม่ชำระ)

### สำหรับผู้ดูแลระบบ (Admin)
- ✅ Dashboard สารสังเกต (รายได้, การจอง, ผู้ใช้)
- ✅ จัดการบริการ (สร้าง, แก้ไข, ลบ)
- ✅ ตรวจสอบและอนุมัติการชำระเงิน
- ✅ ดูรายละเอียดการจอง
- ✅ จัดการผู้ใช้

### ทั่วไป
- 📱 Responsive Design (Mobile-First)
- 🌙 Dark/Light Theme Support
- 🎨 User-Friendly Interface
- ⚡ Fast Performance
- 🔐 Secure Authentication

---

## 🛠 เทคโนโลยี

### Frontend (petcare-project)
```
- React 18+
- Vite 7.3.1 (Build tool)
- React Router v6+ (Routing)
- Tailwind CSS (Styling)
- DaisyUI (UI Components)
- Lucide React (Icons)
- SweetAlert2 (Alerts)
- Axios (HTTP Client)
```

### Backend (Api)
```
- Node.js + Express.js
- MongoDB (Database)
- JWT (Authentication)
- Multer (File Upload)
- Bcrypt (Password Hashing)
- Mongoose ODM
```

---

## 💻 การติดตั้ง

### Prerequisites
- Node.js v16+ 
- npm หรือ yarn
- MongoDB

### Frontend Installation

```bash
cd petcare-project

# ติดตั้ง dependencies
npm install

# สร้าง .env.local file
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:3000/api
EOF

# รันแอปพลิเคชัน
npm run dev
```

### Backend Installation

```bash
cd Api

# ติดตั้ง dependencies
npm install

# สร้าง .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/petcare
PORT=3000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
EOF

# รันเซิร์ฟเวอร์
npm start
# หรือ development mode
npm run dev
```

---

## 🚀 การใช้งาน

### Frontend

```bash
# Development mode
npm run dev
# ที่ http://localhost:5173

# Production build
npm run build
npm run preview
```

### Backend

```bash
# Development mode
npm run dev
# เซิร์ฟเวอร์ทำงานที่ http://localhost:3000

# Production mode
npm start
```

---

## 📁 โครงสร้างโปรเจค

```
PetCare/
├── Api/                              # Backend
│   ├── config/                       # Database & configs
│   ├── controllers/                  # Route handlers
│   ├── middlewares/                  # Auth middleware
│   ├── models/                       # Database schemas
│   ├── routers/                      # API routes
│   ├── .env                          # Environment variables
│   └── package.json
│
└── petcare-project/                  # Frontend
    ├── src/
    │   ├── components/               # React components
    │   │   ├── Button.jsx           # Atom component
    │   │   ├── Card.jsx             # Atom component
    │   │   ├── Modal.jsx            # Atom component
    │   │   ├── ServiceCard.jsx      # Molecule component
    │   │   ├── BookingCard.jsx      # Molecule component
    │   │   └── ...
    │   ├── pages/                    # Page components
    │   │   ├── Home.jsx
    │   │   ├── Services.jsx
    │   │   ├── Booking.jsx
    │   │   ├── Payment.jsx
    │   │   ├── Mybooking.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminServices.jsx
    │   │   ├── AdminServiceUpdate.jsx
    │   │   └── ...
    │   ├── services/                 # API services
    │   │   ├── api.js
    │   │   ├── auth.service.js
    │   │   ├── booking.service.js
    │   │   ├── service.service.js
    │   │   └── ...
    │   ├── context/                  # React Context
    │   │   ├── UserContext.jsx
    │   │   └── UserContextProvider.jsx
    │   ├── routes/                   # React Router config
    │   │   └── Router.jsx
    │   └── App.jsx
    ├── .env.local                    # Environment variables
    └── package.json
```

---

## 🔌 API Documentation

### Authentication
```
POST   /api/auth/register           - สมัครสมาชิก
POST   /api/auth/login              - เข้าสู่ระบบ
```

### Services
```
GET    /api/services                - ดูบริการทั้งหมด
GET    /api/services/:id            - ดูรายละเอียดบริการ
POST   /api/services                - สร้างบริการใหม่ (Admin)
PUT    /api/services/:id            - แก้ไขบริการ (Admin)
DELETE /api/services/:id            - ลบบริการ (Admin)
```

### Bookings
```
GET    /api/bookings/my             - ดูการจองของฉัน
GET    /api/bookings/:id            - ดูรายละเอียดการจอง
POST   /api/bookings                - สร้างการจองใหม่
PUT    /api/bookings/:id            - แก้ไขการจอง
DELETE /api/bookings/:id            - ยกเลิกการจอง
```

### Payments
```
GET    /api/payments/my             - ดูการชำระเงินของฉัน
GET    /api/payments/:id            - ดูรายละเอียดการชำระเงิน
POST   /api/payments                - สร้างการชำระเงินใหม่
POST   /api/payments/:id/upload     - อัปโหลดสลิป
PUT    /api/payments/:id/approve    - อนุมัติการชำระเงิน (Admin)
PUT    /api/payments/:id/reject     - ปฏิเสธการชำระเงิน (Admin)
```

### Users
```
GET    /api/users/profile           - ดูข้อมูลโปรไฟล์
GET    /api/users                   - ดูรายชื่อผู้ใช้ทั้งหมด (Admin)
PUT    /api/users/:id               - แก้ไขข้อมูลผู้ใช้
DELETE /api/users/:id               - ลบผู้ใช้ (Admin)
```

---

## 🎨 Component Architecture (Atomic Design)

### Atoms (Base Components)
- `Button.jsx` - ปุ่มพื้นฐาน
- `Card.jsx` - การ์ดพื้นฐาน
- `Badge.jsx` - ป้ายชื่อ
- `Modal.jsx` - ไดอะล็อก
- `FormInput.jsx` - ช่องแบบฟอร์ม
- `Alert.jsx` - ข้อความแจ้งเตือน

### Molecules (Composite Components)
- `ServiceCard.jsx` - การ์ดบริการ
- `BookingCard.jsx` - การ์ดการจอง
- `PaymentCard.jsx` - การ์ดการชำระเงิน

### Pages
- หน้าบ้าน (Home)
- หน้าบริการ (Services)
- หน้าจอง (Booking)
- หน้าชำระเงิน (Payment)
- หน้าการจองของฉัน (MyBooking)
- Admin Dashboard
- Admin Services Management
- Admin Booking Management

---

## 🔐 Authentication Flow

1. **Register** - ผู้ใช้สมัครสมาชิก
2. **Login** - เข้าสู่ระบบด้วย email/username และ password
3. **JWT Token** - เซิร์ฟเวอร์ส่ง JWT token กลับ
4. **Store Token** - เก็บ token ใน localStorage
5. **Protected Routes** - ใช้ token เพื่อเข้าถึง protected routes

---

## 📱 Responsive Breakpoints

- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md, lg)
- **Desktop**: `> 1024px` (xl, 2xl)

---

## 🐛 Troubleshooting

### Frontend Issues

**Error: "Cannot find module"**
```bash
npm install
npm run dev
```

**CORS Error**
```
ตรวจสอบ VITE_API_BASE_URL ใน .env.local
ให้ตรงกับ Backend URL
```

### Backend Issues

**MongoDB Connection Error**
```
ตรวจสอบ MONGODB_URI ใน .env
ให้ MongoDB server ทำงานอยู่
```

**Port Already in Use**
```bash
# ค้นหา process ที่ใช้ port 3000
lsof -i :3000
# ปิด process
kill -9 <PID>
```

---

## 👥 Contributors

- Developer: [Your Name]
- Project Manager: [Your Name]

---

## 📝 License

MIT License - Feel free to use this project for learning purposes

---

## 📞 Contact & Support

- Email: support@petcare.com
- Phone: +66 XXX-XXX-XXXX
- Website: https://petcare.example.com

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)

---

**Happy Coding! 🚀**
