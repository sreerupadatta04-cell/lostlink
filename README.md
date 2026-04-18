# 🔗 LostLink – Smart Lost & Found System

A full-stack web application where users register belongings, generate QR codes, and receive anonymous notifications when a finder scans their tag.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| QR Code | `qrcode` npm package |
| Notifications | Console-simulated (email/SMS) |

---

## 📁 Project Structure

```
lostlink/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemsController.js
│   │   ├── qrController.js
│   │   ├── messagesController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   ├── qr.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AddItem.jsx
    │   │   ├── ItemDetail.jsx
    │   │   ├── ScanPage.jsx
    │   │   └── AdminPanel.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## ⚡ Quick Setup

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **MongoDB** running locally on port 27017 OR a [MongoDB Atlas](https://cloud.mongodb.com) connection string

---

### Step 1 – Clone / Extract the project

```bash
cd lostlink
```

---

### Step 2 – Setup Backend

```bash
cd backend
npm install
```

Edit `.env` if needed (defaults work with local MongoDB):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lostlink
JWT_SECRET=lostlink_super_secret_jwt_key_2024
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lostlink`

Start the backend:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

You should see:
```
✅ MongoDB connected successfully
🚀 LostLink server running on port 5000
```

---

### Step 3 – Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 4 – Open the App

Visit: **http://localhost:5173**

---

## 🎮 Demo Flow

### As a User (Item Owner):

1. **Register** at `/register` — create your account
2. Go to **Dashboard** → click **Register Item**
3. Fill in item details (name, description, category)
4. Get your **QR code** — download or copy the scan link
5. Watch the **Notifications** bell for alerts

### As a Finder (no login needed):

1. Open the scan URL directly: `http://localhost:5173/scan/<qrCodeId>`
2. See item basic info (owner details are hidden)
3. Click **"Report Found – Notify Owner"**
4. Fill in message + optional contact info
5. Submit — owner gets notified instantly

### Back as Owner:

1. Check the 🔔 notification bell in the navbar
2. Go to **Dashboard** → click the item → **Messages** tab
3. Read the finder's message and reply
4. Mark item as **Recovered** when done

---

## 🔐 Admin Access

To make a user an admin, update their role in MongoDB:

```bash
# Connect to MongoDB shell
mongosh lostlink

# Update user role
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Admin panel is at: `http://localhost:5173/admin`

---

## 🔗 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | 🔒 JWT | Get current user |
| POST | `/api/items` | 🔒 JWT | Register item + generate QR |
| GET | `/api/items` | 🔒 JWT | Get user's items (with filters) |
| GET | `/api/items/:id` | 🔒 JWT | Get single item |
| PATCH | `/api/items/:id/status` | 🔒 JWT | Update item status |
| DELETE | `/api/items/:id` | 🔒 JWT | Delete item |
| GET | `/api/qr/:qrCodeId` | Public | Get item by QR (finder page) |
| POST | `/api/messages` | Public | Finder sends message |
| GET | `/api/messages/:itemId` | 🔒 JWT | Owner reads messages |
| POST | `/api/messages/reply` | 🔒 JWT | Owner replies |
| GET | `/api/notifications` | 🔒 JWT | Get notifications |
| PATCH | `/api/notifications/read-all` | 🔒 JWT | Mark all read |
| GET | `/api/admin/users` | 🔒 Admin | All users |
| GET | `/api/admin/items` | 🔒 Admin | All items |
| GET | `/api/admin/reports` | 🔒 Admin | All messages + stats |
| DELETE | `/api/admin/users/:id` | 🔒 Admin | Delete user |

---

## 🌟 Features Implemented

- ✅ JWT authentication (register, login, logout)
- ✅ Protected routes (frontend + backend)
- ✅ Item registration with QR code generation (base64 PNG)
- ✅ QR code download
- ✅ Public scan page (no login required)
- ✅ Anonymous finder messaging
- ✅ Owner reply system
- ✅ Real-time notification panel
- ✅ Simulated email/SMS notifications (console logs)
- ✅ Dashboard with search + filter
- ✅ Item status management (safe → found → recovered)
- ✅ Admin panel (users, items, reports, stats)
- ✅ Mobile responsive UI
- ✅ Password hashing (bcrypt)
- ✅ Environment variables
- ✅ Error handling + form validation
- ✅ Loading states throughout

---

## 🛠️ Troubleshooting

**MongoDB connection failed:**
- Make sure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check your `MONGO_URI` in `.env`

**Port already in use:**
- Change `PORT=5000` in backend `.env`
- Frontend port can be changed in `vite.config.js`

**CORS errors:**
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly

**QR code not showing:**
- Check backend is running and `qrcode` package is installed
- Check browser console for errors

---

## 📝 Notes

- Email/SMS notifications are **simulated** via `console.log` in the backend terminal — look for 📧 prefixed messages
- QR codes are stored as base64 PNG data in MongoDB
- Owner personal information is never exposed to finders
- All communication goes through LostLink's anonymous messaging layer
