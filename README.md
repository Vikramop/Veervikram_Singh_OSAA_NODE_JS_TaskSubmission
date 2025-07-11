# 🔐 Secure Auth Backend API

A secure, Telegram-integrated user authentication system with OTP verification, role-based access, activity logging, CAPTCHA protection, and admin controls.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Telegram Bot**
- **JWT (Access + Refresh)**
- **Markdown Logging + Activity Log Collection**

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Vikramop/Veervikram_Singh_OSAA_NODE_JS_TaskSubmission.git
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/secureauth
JWT_SECRET=your_jwt_secret
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 4. Start the server

```
npm run dev
```

## 📦 API Endpoints

### 🧍 Auth Routes – /api/auth

1. POST /auth/register

Request

```
{
  "username": "john123",
  "passcode": "123456",
  "dob": "1999-09-01",
  "referralCode": "ref123"
}
```

Response

```
{
  "msg": "Registered successfully. Link Telegram to continue."
}
```

2. POST /auth/login
   Request

```
{
  "username": "john123",
  "passcode": "123456"
}
```

Response

```
{
  "msg": "Login OTP sent to your Telegram. Please verify to get your token."
}
```

3. POST /auth/verify-otp
   Request

```
{
  "username": "john123",
  "otp": "123456"
}
```

Response

```
{
  "msg": "OTP verified",
  "token": "<ACCESS_TOKEN>",
  "refreshToken": "<REFRESH_TOKEN>"
}
```

4. POST /auth/logout
   Request

```
Authorization: Bearer <ACCESS_TOKEN>
```

Response

```
{
  "msg": "Logged out successfully"
}
```

## 🔐 Admin Routes – /api/admin

1. GET /admin/users
   Request

```
[
  {
    "_id": "...",
    "username": "john123",
    "role": "admin",
    "isBanned": false
  }
]
```

2. PATCH /admin/user/:id/role

```
{
  "role": "user"
}
```

Response

```
{
  "msg": "User role updated"
}
```

3. PATCH /admin/user/:id/ban
   Request

```
{
  "ban": true
}
```

Response

```
{
  "msg": "User has been banned"
}
```

4. GET /admin/activity-logs
   Response

```
[
  {
    "username": "john123",
    "type": "login_attempt",
    "endpoint": "/api/auth/login",
    "ip": "::1",
    "success": true,
    "createdAt": "2025-07-10T18:16:25.307Z"
  }
]
```

## 🤖 Telegram Bot

Your Telegram bot will respond to:

```
/start link_<username>
```

Example:

```
/start link_john123
```

Bot Response:

```
✅ Telegram linked successfully to john123
```

## 🧠 Features Summary

✅ OTP-based login via Telegram

✅ JWT with refresh tokens

✅ Admin panel (role update, ban/unban)

✅ Markdown + MongoDB activity logs

✅ Telegram bot integration
