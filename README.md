# Gmax Loyalty System

## Description

The **Gmax Loyalty System** is a simple web-based application designed to track and manage loyalty points for customers.

> **Note:** This system is intended for local development and is optimized to run using **XAMPP** for database management.

---

## Features

* **Customer Registration**
  Allows customers to register and create their profiles.

* **Dashboard**
  Displays customer data along with their current loyalty points.

* **Transaction Management**
  Add, update, and track transactions that affect customer loyalty points.

---

## Prerequisites

Before running the system, ensure you have the following installed:

* Web browser (Chrome, Firefox, etc.)
* Node.js (LTS version recommended)
* XAMPP (for MySQL database)

### Required Tools

1. **Git (Optional)**
   Used to clone the repository.
   Download: [https://git-scm.com/install/windows](https://git-scm.com/install/windows)

2. **Node.js**
   Required to run the backend server.
   Download: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

3. **XAMPP**
   Used to run Apache and MySQL locally.
   Download: [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html)

---

## Installation Guide

> **Important:** The installation and setup steps below are **one-time only**. Once everything is configured, you do **not** need to repeat these steps every time you run the application except **npm run dev and node index.js**.

### 1. Download the Project

Download the project ZIP file:
[https://github.com/MoisesVeloso/Loyalty_Gmax_New/archive/refs/heads/main.zip](https://github.com/MoisesVeloso/Loyalty_Gmax_New/archive/refs/heads/main.zip)

Extract the file to your desired directory.

---

### 2. Setup XAMPP (Database)

1. Open **XAMPP Control Panel**
2. Start:

   * Apache
   * MySQL
3. Open **phpMyAdmin** ([http://localhost/phpmyadmin](http://localhost/phpmyadmin))
4. Create a new database (e.g., `gmax_loyalty`)
5. Import the included `.sql` file from the project (usually located in the `database/` folder)

---

### 3. Setup Backend

1. Open terminal inside the project folder
2. Navigate to the backend directory (if applicable):

   ```bash
   cd backend
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the server:

   ```bash
   npm start
   ```

   or

   ```bash
   node index.js
   ```

---

### 4. Setup Frontend

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run the frontend:

   ```bash
   npm run dev
   ```

   or

   ```bash
   npm start
   ```

---

### 5. Access the Application

Open your browser and go to:

```
http://localhost:3000
```

*(or the port specified in your project)*

---


---

## Notes

* Ensure XAMPP services are running before starting the app
* Check `.env` file for database configuration (if applicable)
* Make sure ports are not already in use

---

## Author

Developed by **Moises Veloso**
