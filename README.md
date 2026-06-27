# 📝 BlogNest — Full-Stack Blogging Platform

A full-featured blogging platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Users can write, publish, and discover blog posts with features like likes, comments, author following, dark mode, and category filtering.

---

## 🚀 Live Demo
https://blognestprofile.netlify.app/

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, protected routes
- ✍️ **Create / Edit / Delete Posts** — Full CRUD with cover image upload
- 🖼️ **Cloudinary Image Uploads** — Cover images and profile avatars
- ❤️ **Like & Unlike Posts** — Real-time like count
- 💬 **Comment System** — Add and delete comments on posts
- 👥 **Follow / Unfollow Authors** — Build your reading list
- 🔍 **Search & Filter** — Search by title, filter by category
- 📄 **Pagination** — Browse all posts across pages
- 🌙 **Dark Mode** — System-aware with manual toggle
- 📱 **Fully Responsive** — Mobile-first with Bootstrap 5

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI framework |
| React Router v6 | Client-side routing |
| Bootstrap 5 | Styling & responsive layout |
| Bootstrap Icons | Icon set |
| Axios | HTTP requests |
| React Toastify | Notifications |
| Context API | Global state (auth, theme) |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary + Multer | Image storage |

---

## 📁 Project Structure

```
blognest/
├── server/                  # Express backend
│   ├── controllers/         # Route logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & upload middleware
│   └── index.js             # Entry point
│
└── client/                  # React frontend
    └── src/
        ├── components/      # Reusable UI components
        ├── context/         # Auth & Theme context
        ├── pages/           # Route pages
        └── utils/           # Axios instance
```

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blognest.git
cd blognest
```

### 2. Setup the Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

**Required `.env` values for server:**

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Setup the Frontend

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Posts
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/posts` | Public |
| GET | `/api/posts/:id` | Public |
| POST | `/api/posts` | Private |
| PUT | `/api/posts/:id` | Private (Author only) |
| DELETE | `/api/posts/:id` | Private (Author only) |
| PUT | `/api/posts/:id/like` | Private |
| GET | `/api/posts/user/:userId` | Public |

### Comments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/comments/:postId` | Public |
| POST | `/api/comments/:postId` | Private |
| DELETE | `/api/comments/:id` | Private (Author only) |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users/:id` | Public |
| PUT | `/api/users/profile` | Private |
| PUT | `/api/users/:id/follow` | Private |

---

## 📸 Screenshots

> *(Add screenshots after running the app)*

---

## 👤 Author

**Zayn** — Frontend Developer  
🔗 [GitHub](https://github.com/your-username) • [LinkedIn](https://linkedin.com/in/your-profile)

---

## 📄 License

MIT License
