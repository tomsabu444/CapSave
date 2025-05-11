# 🖼️ CapSave – Fullstack Media Upload & Album Management Platform


## 🌐 Live Preview  **[https://capsave.tomsabu.com](https://capsave.tomsabu.com)**

## 🔧 Tech Stack

| Technology | Why It’s Used |
| ----- | ----- |
| **React.js** | Build fast, component-based, responsive frontend for web app. |
| **TailwindCSS** | Quickly design clean, responsive UI without writing custom CSS. |
| **Express.js** | Build lightweight backend REST APIs to handle albums and media upload. |
| **MongoDB Atlas** | NoSQL database to store user, album, and media metadata easily and flexibly. |
| **Docker** | Containerize backend app to run independently across any server. |
| **AWS** | Deploy Docker backend in servers. |
| **Cloudflare Pages** | Host the frontend (React app) quickly with CDN speed and easy deployment. |
| **Cloudflare DNS** | Manage domain/subdomain routing securely and efficiently. |
| **GitHub** | Version control, code collaboration, and automate deployment pipelines (CI/CD). |
| **AWS S3 Bucket** | Store uploaded photos and videos securely and retrieve them via backend APIs. |

---

## ⚙️ Environment Setup

You need to configure both **backend** and **frontend** `.env` files to run CapSave locally. take copy from .env.example

### 📂 Backend `.env` (in `backend/.env`)

```env
PORT=5000
MONGODB_URL=
FIREBASE_ADMIN_SDK_BASE64=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
```

- Encode your entire Firebase Admin SDK JSON file as base64 and assign it to `FIREBASE_ADMIN_SDK_BASE64`.
- Never commit real `.env` values to source control.

---

### 📂 Frontend `.env` (in `frontend/.env`)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
VITE_API_BASE_URL=http://localhost:5000
```

- Prefix all frontend variables with `VITE_` as required by Vite.
- `VITE_API_BASE_URL` should point to your running backend server.

---

## 🚀 Setup Instructions

## 📦 Installation Requirements

- **Node.js** ≥ v18.x (recommended)
- **Docker** & Docker Compose installed on your machine

### Option 1: Docker Dev Environment

```bash
docker-compose -f ./docker-compose.dev.yml up --build
```
This spins up both frontend and backend in a development-friendly Docker setup.

### Option 2: Local Development

```bash
# 1. Start Frontend
cd frontend
npm install
npm run dev
```

Open a new terminal:

```bash
# 2. Start Backend
cd backend
npm install
npm run dev
```


## ✅ Functional Requirements

### 1. User Management
- [x] User registration, login, and logout.
- [ ] Each user should have their own albums and media (private to them only).
- [x] Token-based authentication for securing user sessions (using Firebase Auth).

### 2. Album Management
- [ ] Create a new album.
- [ ] Rename an existing album.
- [ ] List all albums belonging to the logged-in user.
- [ ] Delete an album (along with its associated media).
- [ ] Only authenticated users can perform album management.

### 3. Media Capture & Management
- [ ] Capture photos directly from the browser using the device's camera.
- [ ] Record videos from the browser.
- [ ] Detect and list available cameras (front/rear or multiple webcams).
- [ ] Allow users to switch between cameras.
- [ ] Assign captured photos and videos to specific albums.
- [ ] View gallery with photos/videos grouped by album.
- [ ] Play recorded videos and view full-size images.
- [ ] Delete individual media items (photos or videos).

### 4. Additional Features 
- [ ] Drag & Drop: Allow reordering or moving media between albums easily.
- [ ] Media Tagging: Allow users to add simple tags to media (like "Birthday", "Vacation").
- [ ] Media Search/Filter: Search media items by title, tag, or album.
- [ ] Media Download: Users can download their own photos or videos.
- [ ] Dark/Light Theme Toggle: User can switch between dark mode and light mode for better UX.
- [ ] **Media Share Button:** Allow users to share a link to a specific photo or video via URL.

---

## ✅ Non-Functional Requirements

- [ ] Fully **responsive** user interface (mobile-friendly and desktop-friendly).
- [ ] Code should be **well-structured, readable, and modular**.
- [ ] Implement **proper error handling** and **input validations** on both backend and frontend.

---



## 📂 Project Structure

```
.
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   └── index.html
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

## 📚 Documentation

- 📖 Eraser Doc: [CapSave Design Docs](https://app.eraser.io/workspace/ECxICX8E0TyYn47dV6cJ?origin=share)

---

## 🧪 API Endpoints

### 🔐 User API

| Method | Endpoint         | Description                         |
|--------|------------------|-------------------------------------|
| POST   | `/v1/users`      | Creates user after Firebase login   |

### 📁 Album API

| Method | Endpoint                   | Description                            |
|--------|----------------------------|----------------------------------------|
| GET    | `/v1/albums`               | List all albums for authenticated user |
| POST   | `/v1/albums`               | Create a new album                     |
| PUT    | `/v1/albums/:albumId`      | Rename an existing album               |
| DELETE | `/v1/albums/:albumId`      | Delete album and associated media      |

### 🖼 Media API

| Method | Endpoint                   | Description                            |
|--------|----------------------------|----------------------------------------|
| POST   | `/v1/media`                | Upload a photo/video to a specific album (multipart) |
| GET    | `/v1/media/:albumId`       | Fetch all media items from an album    |
| DELETE | `/v1/media/:mediaId`       | Delete a media item                    |

_All routes require Firebase token via `Authorization: Bearer <id_token>`_

---