# 🚀 Threadly – A Modern Social Media Platform

Threadly is a full-stack social media application inspired by platforms like Threads and Instagram. It enables users to create posts, interact with others, manage profiles, receive notifications, and enjoy a clean, responsive experience.

Built using the **MERN Stack**, Threadly demonstrates authentication, REST APIs, image uploads, notifications, and modern frontend development.

---

## 📸 Screenshots

> Add screenshots of your application here.

| Home Feed | Profile | Notifications |
|-----------|----------|---------------|
| ![](screenshots/feed.png) | ![](screenshots/profile.png) | ![](screenshots/notifications.png) |

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login using JWT
- Protected Routes
- Persistent Login

### 👤 User Profile
- View Public Profiles
- Edit Profile
- Upload Profile Picture
- Upload Cover Image
- Bio, Website & Location
- Follow / Unfollow Users

### 📝 Posts
- Create Text Posts
- Upload Images
- Edit Posts
- Delete Posts
- Individual Post Page
- Share Posts via Link
- Copy Share Link
- Mobile Native Share Support

### ❤️ Social Interactions
- Like / Unlike Posts
- Animated Like Button
- Comment on Posts
- Delete Own Comments
- Save / Unsave Posts
- Search Posts

### 🔔 Notifications
- Follow Notifications
- Like Notifications
- Comment Notifications
- Mark Notifications as Read
- Navigate Directly to Related Post or Profile

### 🎨 User Experience
- Responsive Design
- Dark Mode
- Toast Notifications
- Image Preview Before Upload
- Loading Indicators
- Modern UI with Bootstrap

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap 5
- React Icons
- React Toastify
- Date-fns

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

### Database
- MongoDB Atlas

### Image Storage
- Cloudinary

---

## 📂 Project Structure

```
Threadly/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/threadly-social.git
```

### Navigate to Project

```bash
cd threadly-social
```

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Posts

- GET `/api/posts`
- POST `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`
- POST `/api/posts/:id/like`
- POST `/api/posts/:id/comment`

### Users

- GET `/api/users/:username`
- PUT `/api/users/profile`
- PUT `/api/users/follow/:id`
- PUT `/api/users/save/:id`

### Notifications

- GET `/api/notifications`
- PUT `/api/notifications/:id`

---

## 🚀 Future Improvements

- Real-Time Chat (Socket.IO)
- Story Feature
- Reels / Short Videos
- Infinite Scrolling
- Hashtags
- Mentions
- Email Verification
- Forgot Password
- Admin Dashboard
- Push Notifications

---

## 📈 Learning Outcomes

This project helped me strengthen my knowledge of:

- MERN Stack Development
- REST API Design
- JWT Authentication
- MongoDB & Mongoose
- Cloudinary Image Upload
- React Context API
- Protected Routes
- CRUD Operations
- State Management
- Responsive UI Design
- Modern React Development

---

## 👨‍💻 Author

**Shivam Verma**

**Full Stack Developer (MERN)**

GitHub:
https://github.com/shivamvermajss

LinkedIn:
https://www.linkedin.com/in/shivam-verma-227b37384/

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It motivates me to build more amazing projects!
