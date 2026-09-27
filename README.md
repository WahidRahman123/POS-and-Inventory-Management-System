# POS and Inventory Management System

A full-stack **Point of Sale (POS) and Inventory Management System** built with **React, Node.js, Express.js, and MongoDB**. The project follows a client-server architecture, with a modern React frontend and a REST API backend.

## Project Overview

This system is designed to support day-to-day retail operations through a centralized web application. It separates the user interface from the backend API and database, making the application easier to maintain and extend.

The repository contains two main applications:

- **`client/`** — React-based frontend application
- **`server/`** — Node.js/Express backend and MongoDB integration

## Key Features

- Point of Sale workflow
- Product and inventory management
- Customer-related management
- Business/sales data presentation
- Detailed inventory reports
- Supplier and purchase management
- Automated invoice generation
- Role-based permissions
- Authentication using JWT
- Password hashing with bcrypt
- MongoDB database integration through Mongoose
- REST API communication between frontend and backend
- Print-friendly frontend functionality
- Toast notifications and user feedback
- Responsive user interface
- Security middleware including Helmet, CORS, MongoDB sanitization, and XSS sanitization
- Decimal-safe calculations for financial values
- Day.js-accurate date and time data integration


## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing |
| Redux Toolkit | Application state management |
| React Redux | React integration for Redux |
| Axios | HTTP/API requests |
| Tailwind CSS | UI styling |
| Formik | Form management |
| Yup | Form validation |
| React Toastify | Notifications |
| React Select | Enhanced select inputs |
| React Icons / Lucide React | Icons |
| Day.js | Date/time handling |
| Decimal.js | Accurate decimal calculations |
| React-to-print | Print functionality |
| JWT Decode | JWT payload handling |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Axios | HTTP requests |
| dotenv | Environment configuration |
| Helmet | HTTP security headers |
| CORS | Cross-origin resource sharing |
| express-mongo-sanitize | MongoDB injection protection |
| express-xss-sanitizer | XSS input sanitization |
| Day.js | Date/time handling |
| Decimal.js | Financial calculations |


## Getting Started

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- npm
- MongoDB / MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/WahidRahman123/POS-and-Inventory-Management-System.git
cd POS-and-Inventory-Management-System
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `server/` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the backend

From the `server/` directory:

```bash
node index.js
```

### 5. Install frontend dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 6. Configure frontend environment variables

Create a `.env` file inside the `client/` directory.

Example:

```env
VITE_COMPANY_NAME=your_company_name
VITE_BACKEND_URI=your_backend_url
```

### 7. Start the frontend

```bash
npm run dev
```

Vite will display the local development URL in the terminal, normally:

```text
http://localhost:5173
```

## Security

The backend includes several security-oriented dependencies and middleware:

- JWT-based authentication
- Password hashing with `bcryptjs`
- Helmet security headers
- CORS configuration
- MongoDB query sanitization
- XSS input sanitization
- Environment variables for sensitive configuration

For production deployment, use strong secrets, HTTPS, secure database credentials, and appropriate CORS restrictions.


## Database

The application uses **MongoDB** with **Mongoose** for data modeling and database communication.

For local development, you can use either:

- Local MongoDB
- MongoDB Atlas

Keep database credentials in environment variables rather than committing them to the repository.


## Future Improvements

Possible future enhancements include:

- Advanced sales analytics
- Barcode integration
- Advanced dashboard visualizations
- Automated testing
- API documentation

## Author

**Wahid Rahman**

GitHub: [WahidRahman123](https://github.com/WahidRahman123)

## License

Copyright (c) 2026 Md Wahid Rahman

---

 If you find this project useful, consider giving the repository a star.
