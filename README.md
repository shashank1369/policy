# 🛡️ Insurance Platform

A dynamic, user-centric insurance platform for both customers and insurance companies. This platform enables customers to calculate their **prominence score**, receive **personalized policy recommendations**, and **purchase insurance policies**. Insurance companies can manage policies, track sales, and gain insights into customer data.

---

## ✨ Features

### 👤 For Customers
- 🔐 **User Authentication**: Secure login and registration
- 📊 **Prominence Calculation**: Calculate your prominence score based on various factors
- 🧠 **Policy Recommendations**: Get suggestions based on your prominence score
- 💬 **Chatbot Assistance**: Ask questions and get policy-related help
- 🛍️ **Policy Purchase**: Purchase policies using different payment methods
- 📈 **Activity Tracking**: View your actions and transaction history
- 🧾 **User Dashboard**: See active policies, score, and recent activities

### 🏢 For Companies
- 🔐 **Company Authentication**: Secure login for insurance providers
- 🛠️ **Policy Management**: Create, edit, and delete insurance policies
- 📂 **Customer Insights**: View data about policyholders
- 📊 **Sales Analytics**: Track sales, revenue, and user distributions
- 📋 **Company Dashboard**: Access charts and statistics

---

## 🛠️ Tech Stack

### 🌐 Frontend
- **React** – UI Library  
- **TypeScript** – Type-safe JavaScript  
- **Tailwind CSS** – Utility-first CSS framework  
- **React Router** – Page navigation  
- **Shadcn UI** – Component library  
- **React Query** – Server-state management  
- **React Hook Form** – Form handling  
- **Zod** – Form validation  

### 🔧 Backend
- **Node.js + Express** – Backend framework  
- **MongoDB + Mongoose** – NoSQL database & ODM  
- **JWT** – Authentication tokens  
- **bcrypt** – Password hashing  

---

## 📁 Project Structure

```
insurance/
├── frontend/               # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Page routes
│   ├── hooks/              # Custom hooks
│   ├── context/            # Context providers
│   └── assets/             # Static assets
├── backend/                # Node.js/Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
└── shared/                 # Shared code
    └── types/              # TypeScript interfaces
```

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

---

### 🔌 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insurance-platform
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open in browser: [http://localhost:8080](http://localhost:8080)

---

## 📦 Deployment

### Backend:
Can be hosted on:
- Heroku
- Render
- DigitalOcean
- Railway

### Frontend:
Recommended platforms:
- Vercel
- Netlify
- GitHub Pages (with build)

---

## 🔄 User Flows

### 🧍‍♂️ Customer
1. Register/Login
2. Calculate Prominence Score
3. View Personalized Policy Recommendations
4. Interact with Chatbot
5. Purchase Policy
6. Track Policies and Activities

### 🧑‍💼 Company
1. Register/Login
2. Create & Manage Policies
3. View Customer and Sales Data
4. Analyze Revenue & Trends

---

## 📃 License

MIT License

---

> 💬 Have suggestions or found a bug? Feel free to open an issue or contribute!
