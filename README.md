# Bill Split App

A full-stack application to easily split bills among friends, track shared expenses, and settle up with ease.

---

## 📁 Project Structure

This repository contains two main folders at the root:

- `client/` — Frontend React application
- `server/` — Backend Node.js/Express API

Below is the recommended folder structure :

```
BILL-SPLIT/
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── practice.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/neha-lahari/nehalahari_spider_task2.git
cd nehalahari_spider_task2
```

#### 2. Install dependencies

Install both client and server dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

#### 3. Environment Variables

Create a `.env` file in both `client/` and `server/` folders.

Example `.env` for `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret
```

#### 4. Running the app

##### Start the backend server (with nodemon):

```bash
cd server
nodemon index.js
```

##### Start the frontend app:

Open a new terminal, then:

```bash
cd client
npm start
```

---

## ✨ Features

- Add participants
- Create groups
- Add and split expenses
- Track balances and settlements
- Simple and intuitive UI

---
