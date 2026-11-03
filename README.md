# 📚 BookNook — Backend Server

BookNook is a small online library platform. This repository contains the REST API that manages books and borrowing records using Express.js and MongoDB.

## 🌐 Project Links

- **Live Website:** https://booknook-client-nine-xi.vercel.app/
- **Backend API:** https://booknook-server-uroj.onrender.com/
- **Client Repository:** https://github.com/rafsanarahman-06/booknook-client
- **Server Repository:** https://github.com/rafsanarahman-06/booknook-server

## ✨ API Features

- Retrieve all books.
- Retrieve an individual book by ID.
- Add, update, and delete books.
- Create and retrieve borrowing records.
- Return borrowed books.
- Store data in MongoDB.
- Configure CORS for frontend communication.

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JavaScript
- dotenv
- cors
- nodemon

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get a single book |
| POST | `/books` | Add a book |
| PATCH | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| POST | `/borrows` | Create a borrowing record |
| GET | `/borrows` | Get borrowing records |
| DELETE | `/borrows/:id` | Return a borrowed book |

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/rafsanarahman-06/booknook-server.git