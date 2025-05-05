## 🚀 Live Demo

- **Frontend (Vercel):** [https://quiz-app-mern-stack-flame.vercel.app](https://quiz-app-mern-stack-flame.vercel.app)  
- **Backend (Render):** [https://quiz-app-1mt1.onrender.com](https://quiz-app-1mt1.onrender.com)

# QuizApp

QuizApp is a web-based application for creating, managing, and taking quizzes. It is built using React, Tailwind CSS, and Node.js.

## Features

- User authentication (login, register, logout)
- Admin dashboard for managing quizzes and students
- Analytics for quiz performance
- Quiz builder with modification functionality
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Framer motion to make ui look better

## Project Structure

### Backend

- **index.js**: Entry point for the backend server
- **config/**: Configuration files for database and email
- **controllers/**: Controllers for handling business logic
- **middleware/**: Middleware for authentication
- **models/**: Mongoose models for database schemas
- **routes/**: API routes for different functionalities

### Frontend

- **src/**: Main source folder for the React application
  - **api/**: API functions for backend communication
  - **auth/**: Components for authentication (login, register, etc.)
  - **common/**: Common utilities and components
  - **components/**: Reusable UI components
  - **pages/**: Pages for admin and user functionalities
  - **styles/**: Custom and Tailwind CSS styles
  - **utils/**: Utility functions

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd project-quizApp
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` folder with the required variables (e.g., database URL, email credentials).

### Create a `.env` file in both the `backend` and `frontend` folders with the required variables.

---

#### ✅ Frontend (`.env` in the root of the frontend folder):

```
VITE_API_BASE_URL=http://localhost:4000
VITE_API_KEY=1234567890
VITE_API_EXPIRY=1d
```

---

#### ✅ Backend (`.env` in the backend folder):

```
MONGO_URI=mongodb+srv://amank:123@cluster0.z5rkc.mongodb.net/quizapp-db
PORT=4000
JWT_SECRET=1234567890
JWT_EXPIRY=1d
CLIENT_URL=localhost:5173

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mukeshrani.aman@gmail.com
EMAIL_PASS=cxhw fwmy ffpp igna
EMAIL_FROM=mukeshrani.aman@gmail.com
```

4. Start the development servers:

   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

5. Open the application in your browser at `http://localhost:3000`.

## Technologies Used

### Frontend

- React
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express
- MongoDB (Mongoose)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

If you have any questions or feedback, send an email at [mukeshrani.aman@gmail.com](mailto:mukeshrani.aman@gmail.com?subject=Tailwind+React+QuizApp).
