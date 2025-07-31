# 🚀 Full-Stack Job Platform with Blockchain Payments

A modern job platform connecting talent with opportunities, featuring user authentication, AI-powered skill extraction, job posting, and blockchain-based payment for job listings.

---

## 🌟 Features

### 1. **Authentication & Profile Management**
- **Secure Access:** Register and log in with JWT-based authentication.
- **Customizable Profiles:** Edit your name, bio, LinkedIn URL, and wallet address.
- **AI-Powered Skills:** Extract and suggest skills using the Gemini API.
- **Decentralized Identity:** Link your MetaMask or Phantom wallet.

### 2. **Job Posting & Feed**
- **Post Jobs:** Authenticated users can post jobs with title, description, skills, and budget/salary.
- **Dynamic Feed:** View all job listings and public posts in a central feed.
- **Advanced Filtering:** Filter jobs by skill, location, or tags.
- **Secure Data:** All data stored securely in MongoDB Atlas.

### 3. **Blockchain Payment Integration**
- **Pre-Post Fee:** Pay a platform fee to the admin wallet before posting a job.
- **Web3 Integration:** Connect and transact via MetaMask using ethers.js.
- **On-Chain Verification:** Confirm payments on the blockchain for transparency.

---

## 🛠️ Technologies Used

### Frontend
- **React** – User interface
- **Tailwind CSS** – Responsive styling
- **Lucide React** – Icon library
- **ethers.js** – Ethereum blockchain integration

### Backend
- **Node.js & Express** – API and server logic
- **MongoDB Atlas & Mongoose** – Cloud database
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **CORS** – Cross-origin requests
- **dotenv** – Environment variables
- **Google Gemini API** – AI skill extraction

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
```
Start the backend server:
```sh
npm start
```

### 3. **Frontend Setup**
```sh
cd ../frontend
npm install
npm start
```
Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

For questions or feedback, please open an issue or contact [your-email@example.com](mailto:your-email@example.com)