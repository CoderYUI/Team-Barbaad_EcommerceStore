# 🛍️ Barbadiyon ki Dukkan - E-Commerce Platform

A full-stack e-commerce web application with AI chatbot support and payment integration.

## 🚀 Features

- Product catalog with cart functionality
- Razorpay payment integration
- Order tracking by phone number
- AI chatbot powered by Google Gemini 2.0 Flash

## 🛠️ Tech Stack

**Frontend:** React, Vite, React Router
**Backend:** Node.js, Express, MongoDB
**AI:** Google Gemini API
**Payment:** Razorpay

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/CoderYUI/Team-Barbaad_EcommerceStore.git
cd team_barbaad
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_razorpay_key
```

## ▶️ Run Application

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

## 📋 API Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders/search?phone=1234567890` - Search orders
- `POST /api/chat` - Chat with AI

## 🔑 Get API Keys

- **Gemini API:** [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Razorpay:** [Razorpay Dashboard](https://razorpay.com/)
- **MongoDB:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📱 Features

- Browse products and add to cart
- Secure checkout with Razorpay
- Track orders using phone number
- Chat with AI for product info and order tracking

## 👥 Team

**Team Barbaad**

---

Built with ❤️ using, kya hi karoge jaanke!!! 

