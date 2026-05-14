# 🚜 Farm2Home

**Farm2Home** is a modern, full-stack web application designed to bridge the gap between farmers and consumers. By removing middlemen, the platform ensures that consumers get fresh produce directly from the source, and farmers get a fair price for their hard work.

This project was built for a **Hackathon** and features a premium, accessible UI with multi-language support.

---

## 🌟 Key Features

- **👥 Role-Based Portals**:
  - **Farmer Portal**: List crops, manage inventory, and view market prices.
  - **Consumer Portal**: Browse fresh produce, manage a cart, and place orders.
  - **Delivery Partner**: Manage and track deliveries.
  - **Admin Dashboard**: Oversee platform activity and approvals.
- **🌐 Multi-Language Support**: Includes support for regional languages like **Bengali** to ensure accessibility for farmers.
- **📊 Real-Time Analytics**: Interactive charts using Recharts to track sales and inventory.
- **🛒 Seamless Shopping**: Context-aware cart management and secure checkout flow.
- **🔒 Secure Authentication**: JWT-based authentication with hashed passwords (bcrypt).

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS 4, Lucide React (Icons).
- **Backend**: Next.js Server Actions & API Routes.
- **Database**: MongoDB with Mongoose ODM.
- **State Management**: React Context API (Cart & Language).
- **Styling**: Vanilla CSS & Tailwind CSS for a premium, dynamic UI.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (Local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Farm2Home
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 👥 Hackathon Team

This project is being developed by a **3-member team**:
- **Frontend & UI/UX**: Crafting a premium, accessible user experience.
- **Backend & Integration**: Building secure APIs and database interactions.
- **Product & Pitch**: Defining the vision, testing, and presenting the solution.

---

## 📄 License

This project is for hackathon use. All rights reserved.

Link website :-https://farm2-home-nine.vercel.app
