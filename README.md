# Stock Manager

## 📌 Overview
The **Stock Manager** is an intuitive solution designed to modernize and simplify stock management for warehouse personnel. This application enables real-time product tracking, barcode scanning, and manual input for better stock control, reducing human errors.

## 🚀 Features

### 🔐 Authentication
- Secure login using a personal secret code.

### 📦 Product Management
#### Product Identification
- **Barcode Scanner**: Integrated scanner using `expo-barcode-scanner` for quick identification.
- **Manual Input**: Option to manually enter barcode in case of scanner failure.

#### Automatic Database Check
- **Existing Product**:
  - Modify stock by adding or removing quantities.
  - View product details (name, type, price, quantity per warehouse).
- **New Product**:
  - Form-based creation with required fields: `name`, `type`, `price`, `supplier`, `initial quantity`, `image (optional)`.

### 📋 Product List
- Display all stored products with:
  - Name, Type, Price, Quantity, and Stock Status.
  - **Stock Indicators**:
    - 🔴 Red: Out of stock
    - 🟡 Yellow: Low stock (<10 units)
- **Actions**:
  - 🏷️ "Restock" button to increase quantity.
  - ❌ "Unload" button to decrease quantity.

### 🔎 Advanced Features
- **Search & Filter**: By `name`, `type`, `price`, or `supplier`.
- **Sorting**: Sort by `price`, `alphabetically`, or `quantity`.

### 📊 Statistics & Reports
- Dashboard displaying:
  - Total number of products
  - Total number of cities
  - Products out of stock
  - Total stock value
  - Most frequently added/removed products

### 📂 Data Export
- Generate product reports in **PDF format** using `expo-print`.

---

## 🛠️ Setup Instructions

### ⚙️ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Expo CLI](https://expo.dev/)

### 📥 Installation
Clone the repository:
```sh
$ git clone https://github.com/hissoune/stock-manager
$ cd stock-manager
```
Install dependencies:
```sh
$ npm install
```

### 🔌 Backend Setup
This project uses **JSON Server** for mock backend API.
1. Move to the directory containing `db.json`.
2. Install JSON Server globally:
   ```sh
   $ npm i -g json-server
   ```
3. Start the backend:
   ```sh
   $ npx json-server db.json --watch
   ```

### ▶️ Running the App
Start the Expo development server:
```sh
$ npm start
```

---

## 📝 Usage Guide
1. **Login**: Enter your secret code to access the app.
2. **Scan a Product**:
   - Use the barcode scanner to fetch product details.
   - If unavailable, manually enter the barcode.
3. **Manage Stock**:
   - Add or remove quantities.
   - Add new products if not found.
4. **Monitor Stock**:
   - Use indicators to track low/out-of-stock items.
   - Filter and sort products as needed.
5. **Generate Reports**:
   - Export product reports in PDF format.

---

## 🛠️ Technologies Used
- **Frontend**: React Native Expo
- **Backend**: JSON Server
- **State Management**:  Redux 
- **Database**: JSON (Mock Data)
- **PDF Generation**: `expo-print`

---

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Open a pull request.

---

## 🛡️ License
This project is licensed under the [MIT License](LICENSE).

---

## 📞 Support
For any questions or support, feel free to reach out via email or open an issue on GitHub.

