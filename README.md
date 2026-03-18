# 🛒 Shoply - Full-Stack E-Commerce Platform

Shoply is a modern, responsive, and fully functional e-commerce web application. It features a robust Spring Boot backend handling secure transactions and data management, paired with a dynamic React frontend for a seamless user experience.

## ✨ Key Features

* **🔐 Secure Authentication:** JWT-based user login and registration (Role-based access for ADMIN and USER).
* **🛍️ Shopping Cart:** Dynamic cart management using React Context API.
* **📊 Admin Dashboard:** A dedicated, secure portal for administrators to manage inventory, track orders, and view sales overviews.
* **🖼️ Cloud Image Hosting:** Seamless product image uploads handled via Cloudinary API.
* **📱 Responsive Design:** A beautiful UI styled with Tailwind CSS, optimized for both desktop and mobile viewing.
* **🔔 Interactive UI:** Real-time toast notifications for user actions (Add to cart, login, etc.).

## 💻 Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* React Router DOM
* React Hot Toast
* Context API (State Management)

**Backend:**
* Java 17 / Spring Boot 3
* Spring Security (JWT Authentication)
* Spring Data JPA / Hibernate
* PostgreSQL (Database)
* Cloudinary (Image Storage)

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js and npm installed
* Java 17 or higher
* PostgreSQL installed and running
* A Cloudinary Account (for image uploads)

### 1. Clone the Repository
```bash
git clone [https://github.com/princedev0407/E-Commerce_Shoply.git](https://github.com/princedev0407/E-Commerce_Shoply.git)
cd E-Commerce_Shoply
```

### 2. Database Setup
Create a new PostgreSQL database for the application:
```sql
CREATE DATABASE ecommerce_db;
```

### 3. Backend Setup & Environment Variables
Navigate to the backend folder:
```bash
cd ecommerce-backend
```

**Configure Environment Variables:**
Add these properties to your environment variables in your IDE, or temporarily add them to your `application.properties`:
```properties
# Database
DB_USER_NAME=your_db_username
DB_PASSWORD=your_db_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
*Run the Spring Boot application. It will start on `http://localhost:8080`.*

### 4. Frontend Setup
Open a new terminal window and navigate to the frontend folder:
```bash
cd ecommerce-frontend
```

**Install Dependencies & Start:**
```bash
npm install
npm run dev
```
*The application UI will now be running at `http://localhost:5173`.*

---