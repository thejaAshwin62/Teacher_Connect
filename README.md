# Teacher Connect - Appointment Management System

## 📝 Project Description

**Teacher Connect** is a comprehensive web application designed to streamline teacher-student interactions through an efficient appointment scheduling system. The platform bridges the communication gap between teachers and students by providing a structured way to manage consultations, meetings, and academic interactions.

### 🎯 Purpose
- Simplify the process of scheduling student-teacher meetings
- Reduce administrative overhead in managing appointments
- Provide a centralized platform for academic interactions
- Enable efficient time management for both teachers and students
- Facilitate clear communication channels through integrated chat

<div align="center">
    <h2>Landing Page </h2>
<a href="https://teacher-connect.onrender.com/" target="_blank"><a href="https://teacher-connect.onrender.com/"><img src="https://i.ibb.co/YQP0TWn/Screenshot-2024-11-22-223447.png" alt="EA" border="0"></a>

<h2> Booking Page  </h2>
    <a href="https://teacher-connect.onrender.com/" target="_blank"><a href="https://teacher-connect.onrender.com/"><img src="https://i.ibb.co/5GNtw9c/Screenshot-2024-11-22-223734.png" alt="EA" border="0"></a>


<h2> Schedule Page  </h2>
    <a href="https://teacher-connect.onrender.com/" target="_blank"><a href="https://teacher-connect.onrender.com/"><img src="https://i.ibb.co/9GbHgDh/Screenshot-2024-11-22-223806.png" alt="EA" border="0"></a>    

<h2> Stats Admin Page  </h2>
    <a href="https://teacher-connect.onrender.com/" target="_blank"><a href="https://teacher-connect.onrender.com/"><img src="https://i.ibb.co/qBP0kFL/Screenshot-2024-11-22-223842.png" alt="EA" border="0"></a>    
        
</div>

### 💡 Key Features by Role

#### For Students
- **Easy Appointment Booking**: Browse available teachers and schedule appointments
- **Real-time Chat**: Direct communication with teachers
- **Status Tracking**: Monitor appointment requests and updates
- **History Management**: Access past appointments and interactions
- **Profile Management**: Maintain personal information and preferences

#### For Teachers
- **Availability Management**: Set and update available time slots
- **Appointment Control**: Accept, reject, or reschedule appointments
- **Student Communication**: Real-time chat with appointed students
- **Schedule Overview**: View daily, weekly, and monthly appointments
- **Profile Customization**: Manage professional information and department details

#### For Administrators
- **User Management**: Oversee both teacher and student accounts
- **Registration Control**: Approve or reject new user registrations
- **System Monitoring**: Track appointments and user activities
- **Analytics Dashboard**: View system statistics and usage patterns
- **Department Management**: Organize teachers by departments

### 🔧 Technical Implementation

#### Frontend Architecture
- **React Components**: Modular and reusable UI components
- **State Management**: Efficient data flow and state updates
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Real-time Updates**: Dynamic content updates without page refresh
- **Form Validation**: Client-side input validation and error handling

#### Backend Structure
- **RESTful API**: Well-structured endpoints for data operations
- **Authentication**: JWT-based secure user authentication
- **Database Design**: Optimized MongoDB schema for data storage
- **File Handling**: Cloudinary integration for profile pictures
- **Email Service**: Automated notifications via Nodemailer

### 🎨 User Interface
- **Modern Design**: Clean and intuitive user interface
- **Responsive Layout**: Seamless experience across devices
- **Interactive Elements**: Dynamic forms and real-time updates
- **Accessibility**: WCAG compliant design elements
- **Theme Consistency**: Unified color scheme and typography

### 🔐 Security Features
- **Secure Authentication**: Protected user sessions
- **Data Encryption**: Encrypted sensitive information
- **Input Sanitization**: Protection against malicious inputs
- **Role-based Access**: Controlled feature access by user role
- **Session Management**: Secure token handling and validation

## 🌟 Features

### 🧑‍🎓 For Students
- **Book Appointments:** Seamlessly schedule appointments with teachers.
- **Real-Time Chat:** Communicate instantly with teachers.
- **Appointment Status:** Check the status of booked appointments.
- **History Management:** Access and manage your past appointments.

### 🧑‍🏫 For Teachers
- **Availability Management:** Define and manage your availability slots.
- **Appointment Requests:** Accept or reject appointment requests.
- **Real-Time Chat:** Connect with students through instant messaging.
- **Profile Management:** Update and manage your professional profile.

### 🔑 For Admins
- **Teacher Account Management:** Approve or reject teacher registrations.
- **System Statistics:** Gain insights into system activity.
- **Appointment Monitoring:** Oversee all scheduled and completed appointments.

---

## 🛠️ Tech Stack

### Frontend
- **React.js:** Dynamic and interactive user interfaces.
- **TailwindCSS:** Modern utility-first CSS framework for styling.
- **DaisyUI:** Pre-styled components for rapid development.
- **Lucide Icons:** Lightweight and customizable icon set.
- **React Router DOM:** Efficient navigation across pages.
- **React Toastify:** Elegant toast notifications for alerts.

### Backend
- **Node.js:** JavaScript runtime for scalable applications.
- **Express.js:** Minimalist web framework for the backend.
- **MongoDB:** NoSQL database for flexible data storage.
- **JWT Authentication:** Secure user authentication and authorization.
- **Cloudinary:** Reliable cloud-based image storage and management.
- **Nodemailer:** Email notifications for communication.

---

## 🚀 Deployment

**Live Application:**  
[Teacher Connect](https://github.com/thejaAshwin62/Teacher_Connect)

## 🚀 Deployment on Render

### Prerequisites
1. A Render account
2. GitHub repository with your project
3. MongoDB Atlas database

### Steps to Deploy

1. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Get your MongoDB connection string
   - Add IP address `0.0.0.0/0` to network access

2. **Render Configuration**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure your web service:
     ```
     Name: teacher-connect
     Runtime: Node
     Build Command: npm install && npm run build-client
     Start Command: node index.js
     ```

3. **Environment Variables**
   Add these in Render's environment variables section:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   JWT_LIFETIME=1d
   CLIENT_URL=https://your-app-name.onrender.com

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   ```

4. **Auto-Deploy Configuration**
   - Enable auto-deploy from main/master branch
   - Set up branch protection rules if needed

### Important Notes
- Ensure your `package.json` has the correct build and start scripts
- Configure CORS in your backend to accept requests from your Render domain
- Make sure all environment variables are properly set
- Use `process.env.PORT || 3000` in your server code

### Troubleshooting
- Check Render logs for deployment issues
- Verify environment variables are correctly set
- Ensure build process completes successfully
- Monitor application logs for runtime errors

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thejaAshwin62/Teacher_Connect.git
   cd Teacher_Connect
   ```
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add required environment variables (e.g., MongoDB URI, JWT secret, Cloudinary keys).
4. Run the development server:
   ```bash
   cd .. (root directory)
   npm run dev
   ```
5. Access the application at `http://localhost:3000`.

---

## 🤝 Contribution

This project is brought to life by:  
- **Theja Ashwin H**  
- **Sowdeshwari B**  
- **Maheshwar**

Contributions are welcome! If you'd like to contribute, please submit a pull request or report an issue.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🚀 Available Scripts

In the project directory, you can run:

### Development Scripts
```bash
# Run both frontend and backend in development mode
npm run dev

# Run only the backend server with nodemon
npm run server

# Run only the frontend client
npm run client
```

### Production Scripts
```bash
# Setup production build
npm run setup-production

# Build the client
npm run build-client

# Move distribution files (Windows)
npm run move-dist-windows

# Move distribution files (Unix)
npm run move-dist-unix

# Move distribution files (Auto-detects OS)
npm run move-dist

# Start production server
npm start
```

### Script Details:
- `dev`: Runs frontend and backend concurrently using concurrently package
- `server`: Runs backend with nodemon for development
- `client`: Runs frontend Vite development server
- `setup-production`: Installs dependencies and builds client
- `build-client`: Builds the frontend for production
- `move-dist`: Moves built files to public directory
- `start`: Runs the production server
