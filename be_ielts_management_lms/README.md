# IELTS Management LMS - Backend

Backend API cho hệ thống quản lý học sinh IELTS (IELTS Learning Management System).

## 🚀 Tính năng

- **Xác thực & Phân quyền**: JWT authentication với 3 roles (Admin, Teacher, Student)
- **Quản lý Users**: Quản lý tài khoản học sinh và giáo viên
- **Quản lý Courses**: Tạo và quản lý các khóa học IELTS
- **Quản lý Classes**: Lớp học, lịch học, enrollment
- **Đánh giá (Assessments)**: Ghi nhận điểm số 4 kỹ năng IELTS
- **Điểm danh (Attendance)**: Theo dõi sự có mặt của học sinh
- **Tài liệu học tập (Materials)**: Upload và quản lý tài liệu
- **Dashboard**: Thống kê cho Admin, Teacher, Student
- **API Documentation**: Swagger UI

## 📁 Cấu trúc Project

```
ielts_management_lms/
├── config/
│   └── default.json           # App configuration
├── scripts/
│   ├── create-db.js           # Database creation script
│   └── seed-data.js           # Seed sample data
├── src/
│   ├── constants/
│   │   └── messages.js        # Error/success messages
│   ├── db/
│   │   ├── init.js            # Database initialization
│   │   └── sequelize.js       # Sequelize instance
│   ├── docs/
│   │   └── swagger.js         # Swagger configuration
│   ├── entities/
│   │   ├── auth/              # Authentication
│   │   ├── student/           # Student management
│   │   ├── teacher/           # Teacher management
│   │   ├── course/            # Course management
│   │   ├── class/             # Class management
│   │   ├── assessment/        # Assessments & scores
│   │   ├── attendance/        # Attendance tracking
│   │   ├── material/          # Learning materials
│   │   └── dashboard/         # Dashboard stats
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── authorizeRoles.js  # Role-based access
│   │   └── validate.js        # Request validation
│   ├── utils/
│   │   ├── appError.js        # Custom error class
│   │   ├── response.js        # Response helpers
│   │   └── email.js           # Email utilities
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 5.0
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies

```bash
cd ielts_management_lms
npm install
```

### Bước 2: Cấu hình môi trường

Copy file `.env.example` thành `.env` và điều chỉnh các giá trị:

```bash
cp .env.example .env
```

Cập nhật thông tin database và JWT secret trong `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ielts_lms_db

JWT_SECRET=your_secret_key_change_this
```

### Bước 3: Khởi động MongoDB

Đảm bảo MongoDB đang chạy trên local:

```bash
# Kiểm tra MongoDB service
mongosh
```

MongoDB sẽ tự động tạo database khi có dữ liệu đầu tiên.

### Bước 4: Chạy server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3001`

## 📚 API Documentation

Khi server đang chạy, truy cập Swagger UI tại:

```
http://localhost:3001/api-docs
```

## 🔑 Authentication

API sử dụng JWT tokens. Có 2 cách để gửi token:

1. **Authorization Header**:
```
Authorization: Bearer <token>
```

2. **Cookie** (tự động set sau khi login):
```
Cookie: token=<token>
```

## 👥 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access - Quản lý tất cả resources |
| **Teacher** | Quản lý classes, students, assessments, materials |
| **Student** | Xem thông tin cá nhân, classes, assessments của mình |

## 📊 Database Models

### User (Auth)
- id, email, password, role, firstName, lastName, phone, avatar

### Student
- id, userId, studentCode, dateOfBirth, currentLevel, targetBand

### Teacher
- id, userId, teacherCode, specialization, experience, certifications

### Course
- id, name, code, description, level, duration, price

### Class
- id, courseId, teacherId, className, startDate, endDate, schedule

### Assessment
- id, studentId, classId, assessmentType, listeningScore, readingScore, writingScore, speakingScore

### Attendance
- id, studentId, classId, attendanceDate, status

### Material
- id, courseId, teacherId, title, materialType, fileUrl

## 🔧 Scripts

```bash
# Development
npm run dev

# Production
npm start

# Seed sample data
npm run seed

# Create database
npm run create-db
```

## 🌟 Default Admin Account

Sau khi chạy server lần đầu, admin account sẽ được tạo tự động:

```
Email: admin@ieltslms.com
Password: Admin@123456
```

⚠️ **Quan trọng**: Đổi password sau khi login lần đầu!

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/logout` - Đăng xuất
- GET `/api/auth/me` - Lấy thông tin user hiện tại
- POST `/api/auth/change-password` - Đổi password

### Students
- GET `/api/students` - Danh sách students
- GET `/api/students/:id` - Chi tiết student
- POST `/api/students` - Tạo student
- PUT `/api/students/:id` - Cập nhật student
- DELETE `/api/students/:id` - Xóa student

### Teachers, Courses, Classes, Assessments, Attendance, Materials
- Tương tự cấu trúc CRUD

### Dashboard
- GET `/api/dashboard/admin` - Dashboard cho Admin
- GET `/api/dashboard/teacher` - Dashboard cho Teacher
- GET `/api/dashboard/student` - Dashboard cho Student

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

IELTS Management LMS Team
