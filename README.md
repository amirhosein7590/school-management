# 🏫 School Management System

A complete, secure, and scalable school management platform with multi-role access control, attendance tracking, SMS notifications, and real-time messaging.

![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19-green)
![React](https://img.shields.io/badge/React-19-blue)
![Redis](https://img.shields.io/badge/Redis-5.10-red)
![TailwindCss](https://img.shields.io/badge/Tailwind%20CSS-4.0-skyblue)
![React Table](https://img.shields.io/badge/react--table-8.21.3-black)
![React Query](https://img.shields.io/badge/react--query-5.90.14-FF4154)
![Shadcn](https://img.shields.io/badge/shadcn%2Fui-3.5.1-black)
![Zuatand](https://img.shields.io/badge/zustand-5.0.9-brown)

**Live Demo**: [https://medad-dev.ir](https://medad-dev.ir)

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Security](#security)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 👥 Role-Based Access Control
Three distinct user roles with specific permissions:

**Owner** (System Administrator)
- Create and manage schools
- Create and manage managers
- Assign schools to managers
- Set manager permissions (student/teacher CRUD, attendance, etc.)
- Send notifications to all users
- Receive suggestions from users
- Manage SMS credits and subscription plans

**Manager** (School Administrator)
- Full control over their assigned school
- Manage teachers (CRUD, classification)
- Manage students (CRUD, classification)
- Manage classes
- Record teacher attendance
- Generate teacher reports with filters
- Generate student reports
- Dashboard with analytics
- In-app messaging with owner and teachers
- SMS credit management

**Teacher**
- Record student attendance
- Generate student reports
- View personal dashboard
- In-app messaging with manager
- Receive notifications

### 📊 Attendance System
- **Status Types**: Present, Late, Excused, Unexcused, Other
- **Teacher Attendance**: Recorded by manager
- **Student Attendance**: Recorded by teacher
- **Bulk Operations**: Mark all as present/unexcused
- **SMS Notifications**: Automatic alerts to parents
- **Advanced Filters**: Date range, name, status
- **Export**: Excel reports

### 💬 Messaging System
- chat interface
- Role-based communication rules:
  - Owner ↔ All managers
  - Manager ↔ Owner & their teachers
  - Teacher ↔ Their manager only
- Message history and replay

### 📱 Dashboards

**Manager Dashboard**
- Students with >3 absences
- Latest absent student
- Students with perfect attendance
- Teachers with >3 absences
- Latest absent teacher
- Teachers with perfect attendance

**Teacher Dashboard**
- Students with >3 absences
- Latest absent student
- Students with perfect attendance

### 🎯 Subscription Management
- **Free Plan**: 1-week trial
- **Subscription Plan**: 1-year access
- Automatic access blocking on expiry
- SMS credit system
- Plan renewal by owner

### 🔒 Permission Inheritance
When a manager is restricted from recording attendance:
- All their teachers lose attendance recording permission
- Applies to both teacher and student attendance

### 📈 Advanced Reporting
- Separate reports for teachers and students
- Multi-filter search:
  - From date / To date
  - Name search
  - Status filter
- Pagination support
- Excel export

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16.1.5** (Pages Router) | Core framework with SSR |
| **React 19** | UI library |
| **React Hook Form** | Form management & validation |
| **TanStack Query v5** | Server state management |
| **TanStack Table v8** | Advanced tables with sorting/filtering |
| **Zustand** | Client state management |
| **Axios** | HTTP client with interceptors |
| **Jose** | JWT handling |
| **TailwindCSS** | Styling |
| **Sonner** | Toast notifications |
| **React Multi Date Picker** | Persian date picker |
| **ExcelJS** | Excel import/export |
| **CMDK** | Command menu |
| **Shadcn** | Ui Components

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **MongoDB** | Primary database |
| **Mongoose** | ODM with schemas |
| **Redis** | Caching & session management |
| **ioredis** | Redis client |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **cookie** | HTTP cookie handling |

---

## 📁 Project Structure

```bash
├── public/
│ ├── fonts/ # Persian fonts (IRANSans)
│ ├── images/ # Logo, favicon, login image
│ └── files/ # Excel templates for import
│
├── src/
│ ├── components/
│ │ ├── modules/ # Reusable components
│ │ │ ├── Button/
│ │ │ │ ├── button.jsx
│ │ │ │ ├── importFromExcel.jsx
│ │ │ │ └── StatusButton.jsx
│ │ │ ├── Table/
│ │ │ │ ├── table.jsx
│ │ │ │ ├── dataTableSkelton.jsx
│ │ │ │ └── Cell/ # Table Cells With Diffrent Behavior
│ │ │ │ ├── DeleteCell.jsx
│ │ │ │ ├── EditCell.jsx
│ │ │ │ ├── BanCell.jsx
│ │ │ │ ├── sendAbsentSmsCell.jsx
│ │ │ │ └── ...
│ │ │ ├── Form.jsx # Dynamic form component
│ │ │ ├── modal.jsx # Nested modal system
│ │ │ ├── Nav.jsx # Navigation component
│ │ │ ├── pageGuide.jsx # Explain About Current Page
│ │ │ ├── datePicker.jsx
│ │ │ ├── timePicker.jsx
│ │ │ ├── select.jsx # Customized Selector Component
│ │ │ ├── input.jsx
│ │ │ ├── textarea.jsx
│ │ │ ├── spinner.jsx
│ │ │ ├── skeleton.jsx
│ │ │ ├── dialog.jsx
│ │ │ ├── popover.jsx
│ │ │ ├── command.jsx
│ │ │ ├── Card/
│ │ │ │ ├── AttendanceCard.jsx
│ │ │ │ ├── MessageCard.jsx
│ │ │ │ └── PackagesCard.jsx
│ │ │ └── ...
│ │ │
│ │ └── templates/ # Page-specific Components
│ │ ├── teachersManagement/
│ │ │ ├── addTeacher.jsx
│ │ │ └── showTeachers.jsx
│ │ ├── studentsManagement/
│ │ │ ├── addStudent.jsx
│ │ │ └── showStudents.jsx
│ │ ├── teachersAttendances/
│ │ │ ├── addAttendance.jsx
│ │ │ └── showAttendances.jsx
│ │ ├── studentsAttendances/
│ │ │ ├── addAttendance.jsx
│ │ │ └── showAttendances.jsx
│ │ ├── teachersReport/
│ │ │ ├── search.jsx
│ │ │ └── showReport.jsx
│ │ ├── studentsReport/
│ │ │ ├── search.jsx
│ │ │ └── showReport.jsx
│ │ ├── ClassesManagement/
│ │ │ ├── addClass.jsx
│ │ │ └── showClasses.jsx
│ │ ├── managersManagement/
│ │ │ ├── addManager.jsx
│ │ │ └── showManagers.jsx
│ │ ├── schoolsManagement/
│ │ │ ├── addSchool.jsx
│ │ │ └── showSchools.jsx
│ │ ├── InSystemMessage/
│ │ │ ├── messagesList.jsx
│ │ │ ├── sendMessage.jsx
│ │ │ └── messageModalContent.jsx
│ │ ├── managerDashboard/
│ │ │ └── attendanceStats.jsx
│ │ ├── teacherDashboard/
│ │ │ └── attendanceStats.jsx
│ │ └── ForgotPassword/
│ │ └── steper.jsx
│ │
│ ├── constants/ # Static Configurations
│ │ ├── auth/
│ │ │ ├── login.js
│ │ │ └── forgotPassword/
│ │ │ ├── getOtp.js
│ │ │ ├── checkOtp.js
│ │ │ └── resetPassword.js
│ │ ├── teacher/
│ │ │ ├── addTeacher.js
│ │ │ ├── editDeleteTeacher.js
│ │ │ └── teachersClassification.js
│ │ ├── student/
│ │ │ ├── addStudent.js
│ │ │ ├── editDeleteStudent.js
│ │ │ └── studentsClassification.js
│ │ ├── teacherAttendances/
│ │ │ ├── addTeacherAttendance.js
│ │ │ ├── editDeleteTeacherAttendances.js
│ │ │ └── report/
│ │ │ ├── search.js
│ │ │ └── showReport.js
│ │ ├── studentAttendances/
│ │ │ ├── addStudentAttendance.js
│ │ │ ├── editDeleteStudentAttendances.js
│ │ │ └── report/
│ │ │ ├── search.js
│ │ │ └── showReport.js
│ │ ├── class/
│ │ │ ├── addClass.js
│ │ │ └── editDeleteClass.js
│ │ ├── managers/
│ │ │ ├── addManager.js
│ │ │ ├── editDeleteManagers.js
│ │ │ ├── messagesCharge.js
│ │ │ ├── permissions.js
│ │ │ └── setSchool.js
│ │ ├── school/
│ │ │ ├── addSchool.js
│ │ │ ├── editDeleteSchool.js
│ │ │ └── schoolSettings.js
│ │ ├── exportToExcel/
│ │ │ ├── classes.js
│ │ │ ├── teachers.js
│ │ │ ├── students.js
│ │ │ ├── managers.js
│ │ │ ├── schools.js
│ │ │ ├── teacherAttendances.js
│ │ │ └── studentsAttendances.js
│ │ ├── importFromExcel/
│ │ │ ├── teachers.js
│ │ │ └── students.js
│ │ ├── suggests/
│ │ │ ├── addSuggest.js
│ │ │ └── editDeleteSuggestes.js
│ │ ├── addNotification.js
│ │ ├── inSystemMessage.js
│ │ ├── replayMessage.js
│ │ ├── profile.js
│ │ ├── changePassword.js
│ │ ├── home.js
│ │ ├── pageGuide.js
│ │ └── index.js # Central export
│ │
│ ├── hooks/
│ │ ├── useCustomeMutation.js # Mutation wrapper with toast
│ │ ├── useCustomeQuery.js # Query wrapper
│ │ ├── useCustomeInfiniteQuery.js # Infinite scroll support
│ │ └── formMutations/
│ │ └── useEntityMutation.js # Entity-specific mutations
│ │
│ ├── contexts/
│ │ ├── ModalContext.jsx # Nested modal management
│ │ └── UserContext.jsx # User data context
│ │
│ ├── lib/
│ │ ├── requireRole.js # SSR middleware
│ │ ├── permission.js # Page access control
│ │ └── redis.js # Redis client
│ │
│ ├── models/ # Mongoose schemas
│ │ ├── owner.js
│ │ ├── manager.js
│ │ ├── teacher.js
│ │ ├── student.js
│ │ ├── school.js
│ │ ├── class.js
│ │ ├── studentAttendance.js
│ │ ├── teacherAttendance.js
│ │ ├── message.js
│ │ ├── suggest.js
│ │ └── otp.js
│ │
│ ├── pages/
│ │ ├── api/ # API routes
│ │ │ ├── auth/
│ │ │ │ ├── login.js
│ │ │ │ ├── logout.js
│ │ │ │ ├── refresh.js
│ │ │ │ ├── me.js
│ │ │ │ ├── profile.js
│ │ │ │ ├── changePassword.js
│ │ │ │ ├── getOtp.js
│ │ │ │ ├── checkOtp.js
│ │ │ │ └── resetPassword.js
│ │ │ ├── teachers/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── quantity.js
│ │ │ │ ├── classification.js
│ │ │ │ ├── attendanceStats.js
│ │ │ │ ├── mostAbsent.js
│ │ │ │ ├── missing.js
│ │ │ │ ├── groupAdding.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ ├── index.js
│ │ │ │ ├── ban.js
│ │ │ │ ├── permission.js
│ │ │ │ ├── attendances.js
│ │ │ │ └── deleteClass.js
│ │ │ ├── students/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── quantity.js
│ │ │ │ ├── classification.js
│ │ │ │ ├── attendanceStats.js
│ │ │ │ ├── mostAbsent.js
│ │ │ │ ├── groupAdding.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ ├── index.js
│ │ │ │ ├── attendances.js
│ │ │ │ └── deleteClass.js
│ │ │ ├── teachersAttendances/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── report.js
│ │ │ │ ├── all.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ ├── index.js
│ │ │ │ └── sendAttendanceSms.js
│ │ │ ├── studentsAttendances/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── report.js
│ │ │ │ ├── all.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ ├── index.js
│ │ │ │ └── sendAttendanceSms.js
│ │ │ ├── classes/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── quantity.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ └── index.js
│ │ │ ├── managers/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── quantity.js
│ │ │ │ ├── permissions.js
│ │ │ │ ├── setSchool.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ ├── index.js
│ │ │ │ ├── ban.js
│ │ │ │ ├── plan.js
│ │ │ │ ├── planRenewal.js
│ │ │ │ └── messagesCharge.js
│ │ │ ├── schools/
│ │ │ │ ├── index.js
│ │ │ │ ├── search.js
│ │ │ │ ├── quantity.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ └── index.js
│ │ │ ├── messages/
│ │ │ │ ├── index.js
│ │ │ │ └── [id]/
│ │ │ │ ├── getReceiver.js
│ │ │ │ └── replay.js
│ │ │ ├── notifications/
│ │ │ │ ├── index.js
│ │ │ │ └── [id].js
│ │ │ ├── suggests/
│ │ │ │ ├── index.js
│ │ │ │ ├── deleteMany.js
│ │ │ │ └── [id]/
│ │ │ │ └── index.js
│ │ │ └── ...
│ │ │
│ │ ├── auth/
│ │ │ ├── login.jsx
│ │ │ └── forgotPassword/
│ │ │ ├── index.jsx
│ │ │ └── reset.jsx
│ │ ├── school/
│ │ │ ├── home.jsx
│ │ │ ├── profile.jsx
│ │ │ ├── changePassword.jsx
│ │ │ ├── inSystemMessage.jsx
│ │ │ ├── schoolsManagement.jsx
│ │ │ ├── managersManagement.jsx
│ │ │ ├── setSchool.jsx
│ │ │ ├── managersPermissions.jsx
│ │ │ ├── schoolSettings.jsx
│ │ │ ├── classesManagement.jsx
│ │ │ ├── teachersManagement.jsx
│ │ │ ├── teachersClassification.jsx
│ │ │ ├── teachersAttendances.jsx
│ │ │ ├── teachersReport.jsx
│ │ │ ├── studentsManagement.jsx
│ │ │ ├── studentsClassification.jsx
│ │ │ ├── studentsAttendances.jsx
│ │ │ ├── studentsReport.jsx
│ │ │ ├── dashboard/
│ │ │ │ ├── manager.jsx
│ │ │ │ └── teacher.jsx
│ │ │ ├── packages/
│ │ │ │ ├── index.jsx
│ │ │ │ └── message.jsx
│ │ │ ├── notificationsManagement.jsx
│ │ │ ├── suggestsManagement.jsx
│ │ │ └── ...
│ │ ├── _app.js
│ │ ├── _document.js
│ │ └── index.js
│ │
│ ├── store/ # Zustand stores
│ │ ├── authStore.js # Authentication state
│ │ └── tableStore.js # Table selection state
│ │
│ ├── layouts/
│ │ └── dashboardLayout.jsx # Main layout wrapper
│ │
│ ├── styles/
│ │ └── globals.css
│ │
│ └── utils/
│ ├── axiosPublic.js # Public API client
│ ├── axiosPrivate.js # Private API client with interceptors
│ ├── db.js # MongoDB Connection
│ ├── tokenConf.js # JWT Configuration
│ ├── cookieOptions.js # Cookie Settings
│ ├── passwordConf.js # Password Hashing
│ ├── findUserByProp.js # User Lookup Utility
│ ├── findUserByProps.js
│ ├── RBAC.js # Role-based Helpers
│ ├── registryEntity.js # Config Registry
│ ├── sendSms.js # SMS Service
│ ├── cache.js # Redis Cache Helpers
│ ├── dateToSolar.js # Persian Date Conversion
│ ├── pageNameHandler.js
│ └── shadcn-utils.js
│
├── .env.example # Not Included In The Project For Security Reasons
├── next.config.mjs
├── package.json
├── jsconfig.json
├── postcss.config.mjs
├── components.json # Shadcn Config
```

## 📊 Database Schema

### Owner
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  userName: String,
  password: String,        // bcrypt hashed
  role: "owner",
  phone: String,
  nationalCode: String,     // unique
  gender: "male" | "female",
  isBanned: Boolean
}
```

### Manager

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  nationalCode: String,     // unique
  personnelCode: String,    // unique
  phone: String,
  role: "manager",
  gender: "male" | "female",
  isBanned: Boolean,
  expTime: Number,          // subscription expiry timestamp
  plan: "free" | "subscription",
  messagesCharge: Number,   // SMS credits
  school: ObjectId,         // ref: School
  birthDay: Date,
  notifications: [{
    text: String,
    status: "success" | "error" | "warning",
    _id: ObjectId
  }],
  actionsPermissions: {
    createStudent: Boolean,
    editStudent: Boolean,
    deleteStudent: Boolean,
    createTeacher: Boolean,
    editTeacher: Boolean,
    deleteTeacher: Boolean,
    createClass: Boolean,
    editClass: Boolean,
    deleteClass: Boolean,
    overrideSchoolSettings: Boolean,
    teacherAbsent: Boolean,
    studentAbsent: Boolean
  }
}
```

### Teacher

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  phone: String,
  nationalCode: String,     // unique
  personnelCode: String,    // unique
  isBanned: Boolean,
  school: ObjectId,         // ref: School
  class: ObjectId,          // ref: Class (optional)
  manager: ObjectId,        // ref: Manager
  birthDay: Date,
  gender: "male" | "female",
  role: "teacher",
  actionsPermissions: {
    studentAbsent: Boolean
  },
  notifications: [{
    text: String,
    status: String,
    _id: ObjectId
  }]
}
```

### Student

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  nationalCode: String,     // unique
  parentPhone: String,
  school: ObjectId,         // ref: School
  class: ObjectId,          // ref: Class
  manager: ObjectId,        // ref: Manager
  teacher: ObjectId,        // ref: Teacher
  birthDay: Date,
  grade: Number
}
```

### School

```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  level: Number,            // 1: elementary, 2: middle, 3: high
  shift: "morning" | "afternoon",
  phone: String,
  gender: "boyish" | "girlish",
  manager: ObjectId         // ref: Manager
}
```

### Class

```javascript
{
  _id: ObjectId,
  name: String,
  school: ObjectId,         // ref: School
  grade: Number,
  capacity: Number,
  teacher: ObjectId         // ref: Teacher
}
```

### Student Attendance

```javascript
{
  _id: ObjectId,
  student: ObjectId,        // ref: Student
  class: ObjectId,          // ref: Class
  teacher: ObjectId,        // ref: Teacher
  school: ObjectId,         // ref: School
  date: Date,
  status: "present" | "late" | "excused" | "unexcused" | "other",
  description: String,
  time: String              // "HH:MM" format
}
```

### Teacher Attendance

```javascript
{
  _id: ObjectId,
  teacher: ObjectId,        // ref: Teacher
  manager: ObjectId,        // ref: Manager
  date: Date,
  status: "present" | "late" | "excused" | "unexcused" | "other",
  description: String
}
```

### Message (In System Message)

```javascript
{
  _id: ObjectId,
  text: String,
  sender: ObjectId,         // ref: Manager/Teacher
  receiver: ObjectId,       // ref: Manager/Teacher/Owner
  createdAt: Date,
  updatedAt: Date
}
```

### Suggest

```javascript
{
  _id: ObjectId,
  subject: String,
  sender: ObjectId,
  senderModel: "Manager" | "Teacher",
  text: String
}
```

### Otp

```javascript
{
  _id: ObjectId,
  phone: String,
  code: String,             // 5-digit code
  expTime: Number,          // expiry timestamp
  resetToken: String,       // password reset token
  resetTokenExp: Number     // token expiry
}
```

## 🔒 Security

### Authentication Flow

- Login: National Code + Role → JWT tokens

- OTP Verification: For password reset

- JWT Strategy: Access token + Refresh token

- HttpOnly Cookies: Tokens stored securely

- Token Rotation: Automatic refresh on expiry

### Authorization Layers

- Page Level: SSR middleware checks role permissions

- API Level: Route handlers verify user roles

- Data Level: Queries filter by user's school/manager

- Action Level: Fine-grained permissions in user schema

### Security Measures

- Password hashing with bcrypt

- JWT with short expiration (1 Day)

- Redis blacklist for revoked tokens

- Rate limiting on auth endpoints

- Input validation on all forms

- XSS protection via React escaping

- CSRF protection via SameSite cookies

- Session invalidation on ban/expiry

<div align="center"> <sub>Built By <a href="https://github.com/amirhosein7590">Amirhossein Gholami</a></sub> </div