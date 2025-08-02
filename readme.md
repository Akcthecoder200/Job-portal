# 🚀 TalentConnect: Full-Stack Job Platform with Blockchain Payments

A modern job portal connecting talent and employers, featuring secure authentication, customizable profiles, AI-powered skill extraction, advanced job posting and filtering, and blockchain-based payments.

---

## 🌟 Features

### 1. **Authentication & Profile Management**
- **JWT Authentication:** Secure registration and login.
- **Profile Editing:** Update name, bio, LinkedIn URL, wallet address, and skills.
- **Skill Management:** Add/remove skills manually or extract via AI.
- **Wallet Integration:** Link MetaMask or Phantom wallet for decentralized identity.

### 2. **Job Posting & Feed**
- **Post Jobs:** Authenticated users can post jobs with title, description, skills, budget/salary, location, and tags.
- **Blockchain Payment:** Pay a platform fee before posting jobs, verified on-chain.
- **Job Feed:** View all job listings and posts in a central feed.
- **Filtering:** Search jobs by skill, location, or tags.
- **User Posts:** View jobs posted by the logged-in user.

### 3. **AI-Powered Features**
- **Skill Extraction:** Use Gemini API to extract and suggest skills from resumes.
- **Smart Suggestions:** Get AI-powered job recommendations and match scores.
- **Matching:** AI compares user profile and job description for match score and rationale.

### 4. **Security & Data**
- **MongoDB Atlas:** All data stored securely in the cloud.
- **Password Hashing:** User passwords hashed with bcryptjs.
- **CORS & Environment:** Secure API access and environment variable management.

---

## 🛠️ Technologies Used

### Frontend
- **React** – SPA user interface
- **Tailwind CSS** – Responsive styling
- **Lucide React** – Icon library
- **ethers.js** – Ethereum blockchain integration
- **React Router** – Routing and navigation

### Backend
- **Node.js & Express** – REST API and server logic
- **MongoDB Atlas & Mongoose** – Cloud database and ORM
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **CORS** – Cross-origin requests
- **dotenv** – Environment variables
- **Google Gemini API** – AI skill extraction and matching

---

## 🚦 Getting Started

### 1. **Clone the Repository**
```sh
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. **Backend Setup**
```sh
cd backend
npm install
```
Create a `.env` file:
```
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=your_mongodb_atlas_connection_string_here
GENERATIVE_AI_API_KEY=your_gemini_api_key_here
ADMIN_WALLET_ADDRESS=your_admin_wallet
PLATFORM_FEE_ETH=platform_fees
SEPOLIA_RPC_URL=your_sepolia_network_url
```
Start the backend server:
```sh
npm start
```

### 3. **Frontend Setup**
```sh
cd ../frontend
npm install
```
Create a `.env` file:
```
VITE_BACKEND_URL=your_backend_url
```
Start the frontend:
```sh
npm start
```
Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 📂 Project Structure

```
job portal/
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── jobController.js
│   │   ├── generativeController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   ├── middlewares/
│   │   └── authUser.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── jobModel.js
│   ├── routes/
│   │   ├── userRoute.js
│   │   ├── jobRoute.js
│   │   ├── paymentRoute.js
│   │   ├── generativeRoute.js
│   │   └── dashboardRoute.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── UserPost.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SuggestJob.jsx
│   │   │   ├── MatchScore.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── context/
│   │   │   └── context.js
│   │   └── App.jsx
│   └── main.jsx
└── readme.md
```

---

## 🧩 Key Functionality

- **User Authentication:** JWT-based, with protected routes.
- **Profile Management:** Edit profile, add/remove skills, wallet integration.
- **Job Posting:** Form with payment step, skill/tag management, and validation.
- **Job Listing:** Central feed, filtering by skill/tag/location, user posts.
- **AI Integration:** Skill extraction from resume, smart job suggestions, match scoring.
- **Blockchain Payment:** Ethers.js integration for job posting fees.
- **Error Handling:** Robust backend and frontend error messages.
- **Responsive Design:** Mobile-friendly UI with Tailwind CSS.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

For questions or feedback, please open an issue or contact [your-email@example.com](mailto:your-email@example.com)