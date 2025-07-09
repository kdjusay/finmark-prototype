
# FinMark Prototype

**FinMark** is a modern SaaS prototype for SME financial management.  
This project demonstrates a full-stack application with a secure admin/user login, dashboard management, user CRUD, reporting, and basic e-commerce modules.

---

## 🚦 System Requirements

- **Operating System:** Windows 10/11, MacOS, or Linux
- **Node.js:** v18 or higher ([Download Node.js](https://nodejs.org/))
- **npm:** v9 or higher (included with Node.js)
- **MySQL Community Server:** v8.x ([Download MySQL](https://dev.mysql.com/downloads/mysql/))
- **IDE (Recommended):**  
  - [VS Code](https://code.visualstudio.com/download)  
  - (Or any code editor you prefer)
- **Git** ([Download Git](https://git-scm.com/downloads))

---

## 🛠️ Setup Instructions

### 1. **Clone the Repository**

Open Terminal or CMD and run:
```sh
git clone https://github.com/kdjusay/finmark-prototype.git
cd finmark-prototype
```

---

### 2. **Install Dependencies**

#### **Frontend Setup**

```sh
cd frontend
npm install
npm start
```
- This starts the frontend on [http://localhost:3000](http://localhost:3000)

#### **Backend Setup**

Open a new terminal:
```sh
cd backend
npm install
npm run dev
```
- This starts the backend API on [http://localhost:5000](http://localhost:5000)

---

### 3. **Database Setup**

- Import the provided SQL file to MySQL.  
- **Download SQL File:** [finmark.sql](https://drive.google.com/drive/folders/17CSOnoj-fZDQrq4V5nVumQ9m8abKZb5z?usp=sharing)

#### **How to Import the SQL File**
1. Open [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (or any MySQL GUI).
2. Create a new database, e.g. `finmark_db`.
3. Go to **File → Open SQL Script**, select the `finmark.sql`, and execute the script (lightning bolt/run button).
4. Confirm that the `users` table and initial data are created.

---

### 4. **Open in IDE**

1. **Open VS Code** (or your preferred IDE).
2. **Open Folder:**  
   Go to **File → Open Folder**, then select the `finmark-prototype` folder.
3. You can now edit both `frontend` and `backend` folders.

---

## 🚪 **Login Credentials (Default)**

All user accounts use the same password unless changed by admin.

- **Default Password:** `Finmark@2025`

### **Sample Accounts**

| Email               | Role   | First Name | Last Name | Phone        |
|---------------------|--------|------------|-----------|-------------|
| admin@finmark.com   | admin  | Admin      | User      | +1234567890 |
| johns@example.com   | user   | Johns      | Doe       | +1987654321 |
| jane@example.com    | user   | Jane       | Smith     | +1555666777 |
| demo@finmark.com    | demo   | Demo       | User      | +1111222333 |

---

## 📋 **System Modules & Functionalities**

### 1. **Login Page** (100% Functional)
- Email/password authentication
- Google OAuth login (if enabled)
- Instant error messages
- Role-based redirection after login

### 2. **Admin Dashboard** (100% Functional)
- View all users in table format
- Search/filter users by name/email
- Create new user (admin/user/demo)
- Edit user (update info, reset password)
- Delete user (except main admin)
- Logout and session control

### 3. **User Dashboard** (Prototype)
- View personal profile and information
- Basic navigation to other modules (products, orders, feedback)
- Logout and session control

### 4. **Reports Page** (Prototype)
- Placeholder for business and financial reports
- Accessible for admin (planned for future data)

### 5. **Checkout** (Prototype)
- View items added to cart
- Submit checkout/order (future integration with products/orders)

### 6. **Products** (Prototype)
- Browse list of available products
- Product details (limited)

### 7. **Orders** (Prototype)
- View order history and status
- Basic order status tracking

### 8. **Feedback** (Prototype)
- Submit user concerns or feedback to admin
- All feedback is logged (planned for admin review module)

---

## 🧩 **Tech Stack Overview**

- **Frontend:** React (with Context API, hooks, and custom styling)
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT, bcrypt password hashing
- **Styling:** Pure CSS-in-JS (no external frameworks, fast loading)
- **API:** RESTful JSON endpoints

---

## ℹ️ **Additional Notes**

- All source code is under the `frontend` and `backend` directories.
- For any environment variables (API URLs, database configs), refer to `.env.example` in each directory. **Do not commit real secrets.**
- Google OAuth requires a valid client ID, set via environment variables (ask the project admin if not provided).

---

## 📬 **Support / Questions**

For setup or usage issues, please [open an issue](https://github.com/kdjusay/finmark-prototype/issues) or contact the repository owner.
