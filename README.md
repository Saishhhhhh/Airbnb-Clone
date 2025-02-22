# 🏡 Airbnb Clone

## 🚀 Overview

This is a **full-stack Airbnb Clone** built using **Node.js, Express, MongoDB, and EJS**. The application allows users to book and list rental properties with authentication, image uploads, and session management.

## 🎯 Features

- 🔑 **User Authentication** (Signup/Login with session-based authentication)
- 🏠 **Host Dashboard** (List and manage properties)
- 📸 **Image Upload** (Using Multer for property images)
- 🛒 **Booking System** (Users can book listed properties)
- 📊 **Session Management** (Using Express-Session & MongoDB Store)
- 🎨 **EJS Templates** (Server-side rendering for dynamic pages)
- 🛡️ **Secure Password Storage** (Using bcrypt.js for hashing)

---

## 🏗️ Tech Stack

### Backend:

- **Node.js** & **Express.js** - Server-side framework
- **MongoDB** & **Mongoose** - Database management
- **Multer** - Image upload handling
- **Express-Session** - User session management
- **Connect-MongoDB-Session** - Store sessions in MongoDB
- **bcrypt.js** - Password hashing

### Frontend:

- **EJS** - Server-side rendering
- **Tailwind CSS** - Styling & responsive design

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```sh
$ git clone https://github.com/Saishhhhhh/Airbnb-Clone.git
$ cd Airbnb-Clone
```

### 2️⃣ Install Dependencies

```sh
$ npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
SESSION_SECRET=your_secret_key
```

### 4️⃣ Start the Development Server

```sh
$ npm run dev
```

> The server will run at **[http://localhost:3000](http://localhost:3000)**

---

## 📜 Folder Structure

```
Airbnb-Clone/
│── controllers/      # Route logic (error handling, authentication, etc.)
│── models/           # Mongoose models for User, Listing, etc.
│── public/           # Static assets (CSS, JS, images)
│── routes/           # Route handlers for Store, Auth, Host, etc.
│── views/            # EJS templates for UI
│── utils/            # Utility functions (path utils, helper functions)
│── uploads/          # Uploaded images (stored locally for now)
│── app.js            # Main server file
│── .env              # Environment variables
│── package.json      # Project dependencies & scripts
```

---

## 🖼️Screenshots

Home Page
![Home-Page](ScreenShots/homePage.png)

SignUp Page
![SignUpPage](ScreenShots/SignUp.png)

Login Page
![LoginPage](ScreenShots/Login.png)

Favourites Page
![Favourites](ScreenShots/Favourites.png)

New Home Registration Page
![NewRegistration](ScreenShots/NewRegistration.png)

Home Details Page
![HomeDetail](ScreenShots/HomeDetail.png)