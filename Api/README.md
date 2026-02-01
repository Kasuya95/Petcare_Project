# 🐾 PetCare Backend API

ส่วนหลังบ้านของระบบจองบริการดูแลสัตว์เลี้ยง

## 📋 สารบัญ
- [ภาพรวม](#ภาพรวม)
- [เทคโนโลยี](#เทคโนโลยี)
- [การติดตั้ง](#การติดตั้ง)
- [การใช้งาน](#การใช้งาน)
- [โครงสร้างไฟล์](#โครงสร้างไฟล์)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication](#authentication)

## 🎯 ภาพรวม

Backend ของ PetCare เป็น RESTful API ที่สร้างด้วย Node.js + Express.js
โดยใช้ MongoDB เป็นฐานข้อมูล

**Core Features:**
- 🔐 JWT Authentication & Authorization
- 📊 Complete CRUD operations
- 🖼️ File upload support
- ✔️ Input validation
- 🐛 Error handling
- 📝 Logging

## 🛠 เทคโนโลยี

```json
{
  "Runtime": "Node.js v16+",
  "Framework": "Express.js",
  "Database": "MongoDB",
  "Database ODM": "Mongoose",
  "Authentication": "JWT",
  "Hashing": "Bcrypt",
  "File Upload": "Multer",
  "Environment": "dotenv",
  "Validation": "Custom middleware"
}
```

## 💻 การติดตั้ง

### Prerequisites
- Node.js v16+
- MongoDB (local or cloud)
- npm หรือ yarn

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd Api

# 2. ติดตั้ง dependencies
npm install

# 3. สร้าง .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/petcare
PORT=3000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
EOF

# 4. รันเซิร์ฟเวอร์
npm run dev
```

### Environment Variables

```env
# .env
MONGODB_URI=mongodb://localhost:27017/petcare
PORT=3000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 🚀 การใช้งาน

### Development

```bash
# เรียกใช้ dev server (with hot reload)
npm run dev
```

API จะทำงานที่ `http://localhost:3000`

### Production

```bash
# เรียกใช้ production mode
npm start
```

## 📁 โครงสร้างไฟล์

```
Api/
├── config/
│   └── mongodb.js                 # MongoDB connection
│
├── controllers/
│   ├── authMiddleware.js          # Auth controller
│   ├── bookingController.js       # Booking operations
│   ├── paymentController.js       # Payment operations
│   ├── serviceController.js       # Service operations
│   └── userController.js          # User operations
│
├── middlewares/
│   └── authJWT.middleware.js      # JWT verification
│
├── models/
│   ├── Booking.model.js           # Booking schema
│   ├── Payment.model.js           # Payment schema
│   ├── Service.model.js           # Service schema
│   └── User.model.js              # User schema
│
├── routers/
│   ├── auth.router.js             # Auth routes
│   ├── booking.router.js          # Booking routes
│   ├── payment.router.js          # Payment routes
│   ├── service.router.js          # Service routes
│   └── user.router.js             # User routes
│
├── uploads/                       # Uploaded files
├── .env                           # Environment variables
├── server.js                      # Entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201
{
  "user": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john_doe", // or email
  "password": "password123"
}

Response: 200
{
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Services

#### Get all services
```http
GET /api/services

Response: 200
{
  "services": [
    {
      "_id": "...",
      "name": "Grooming",
      "category": "GROOMING",
      "price": 500,
      "duration": 60,
      "description": "...",
      "image": "..."
    }
  ]
}
```

#### Get service by ID
```http
GET /api/services/:id

Response: 200
{
  "service": {...}
}
```

#### Create service (Admin only)
```http
POST /api/services
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- name: string
- category: enum
- price: number
- duration: number
- description: text
- image: file

Response: 201
{
  "service": {...}
}
```

#### Update service (Admin only)
```http
PUT /api/services/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Response: 200
{
  "service": {...}
}
```

#### Delete service (Admin only)
```http
DELETE /api/services/:id
Authorization: Bearer <token>

Response: 200
{
  "message": "Service deleted"
}
```

### Bookings

#### Get my bookings
```http
GET /api/bookings/my
Authorization: Bearer <token>

Response: 200
{
  "bookings": [
    {
      "_id": "...",
      "userId": "...",
      "serviceId": "...",
      "bookingDate": "2024-02-01",
      "bookingTime": "10:00 - 11:00",
      "petName": "Milo",
      "status": "PENDING",
      "note": "..."
    }
  ]
}
```

#### Create booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "...",
  "bookingDate": "2024-02-01",
  "bookingTime": "10:00 - 11:00",
  "petName": "Milo",
  "note": "Has sensitive skin"
}

Response: 201
{
  "booking": {...}
}
```

#### Cancel booking
```http
PUT /api/bookings/:id/cancel
Authorization: Bearer <token>

Response: 200
{
  "booking": {...}
}
```

#### Undo cancel booking
```http
PUT /api/bookings/:id/undo-cancel
Authorization: Bearer <token>

Response: 200
{
  "booking": {...}
}
```

### Payments

#### Get my payments
```http
GET /api/payments/my
Authorization: Bearer <token>

Response: 200
{
  "payments": [
    {
      "_id": "...",
      "bookingId": "...",
      "userId": "...",
      "amount": 500,
      "status": "PENDING",
      "slipUrl": "...",
      "createdAt": "..."
    }
  ]
}
```

#### Create payment
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "...",
  "amount": 500,
  "method": "PROMPTPAY"
}

Response: 201
{
  "payment": {...}
}
```

#### Upload payment slip
```http
POST /api/payments/:id/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- image: file (image only)

Response: 200
{
  "payment": {
    "slipUrl": "..."
  }
}
```

#### Approve payment (Admin only)
```http
PUT /api/payments/:id/approve
Authorization: Bearer <token>

Response: 200
{
  "payment": {...}
}
```

#### Reject payment (Admin only)
```http
PUT /api/payments/:id/reject
Authorization: Bearer <token>

Response: 200
{
  "payment": {...}
}
```

### Users

#### Get all users (Admin only)
```http
GET /api/users
Authorization: Bearer <token>

Response: 200
{
  "users": [...]
}
```

#### Get user profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response: 200
{
  "user": {...}
}
```

#### Update user profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "...",
  "email": "..."
}

Response: 200
{
  "user": {...}
}
```

## 📊 Database Models

### User Model
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Service Model
```javascript
{
  name: String,
  category: String,
  price: Number,
  duration: Number,
  description: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  userId: ObjectId,
  serviceId: ObjectId,
  bookingDate: Date,
  bookingTime: String,
  petName: String,
  status: String, // PENDING, PAID, CANCELLED
  note: String,
  cancelledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  bookingId: ObjectId,
  userId: ObjectId,
  amount: Number,
  method: String, // PROMPTPAY
  status: String, // PENDING, APPROVED, REJECTED
  slipUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### JWT Flow

```
1. User registers/logs in
2. Server creates JWT token
3. Client sends token in Authorization header
4. Server verifies token
5. If valid, allow access
6. If invalid/expired, return 401
```

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware

```javascript
// Verify JWT token
const authJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

## 📝 Error Handling

### Error Codes

```
200 OK - Request successful
201 Created - Resource created
400 Bad Request - Invalid input
401 Unauthorized - Authentication required
403 Forbidden - Permission denied
404 Not Found - Resource not found
409 Conflict - Resource already exists
500 Internal Server Error - Server error
```

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## 🧪 Testing API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "email": "test@test.com",
    "password": "123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test",
    "password": "123456"
  }'

# Get services
curl http://localhost:3000/api/services
```

### Using Postman

1. Import API collection
2. Set base URL: `http://localhost:3000/api`
3. Add authorization token in headers
4. Test endpoints

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED

Solution:
1. Make sure MongoDB is running
2. Check MONGODB_URI in .env
3. Verify network connectivity
```

### JWT Token Invalid
```
Error: JsonWebTokenError

Solution:
1. Check token format
2. Verify JWT_SECRET in .env
3. Ensure token is not expired
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

## 📊 API Rate Limiting

Currently no rate limiting implemented.
Consider adding:
- Express-rate-limit
- Helmet for security headers
- CORS configuration

## 🔒 Security Considerations

1. ✅ Hash passwords with bcrypt
2. ✅ Use JWT for authentication
3. ✅ Validate input data
4. ✅ Use HTTPS in production
5. ⚠️ Add CORS configuration
6. ⚠️ Add rate limiting
7. ⚠️ Add request validation
8. ⚠️ Add helmet for security headers

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Introduction](https://jwt.io)
- [RESTful API Design](https://restfulapi.net)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for pet lovers everywhere 🐾**
