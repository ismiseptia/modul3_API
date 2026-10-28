# Mini-App Task Management (Expo, Express, & MySQL)

Proyek ini adalah aplikasi manajemen tugas berbasis mobile (Expo) dengan backend Node.js (Express) dan database MySQL, lengkap dengan sistem autentikasi JWT dan fitur Push Notification.

---

## 📋 Prasyarat
Pastikan komputer Anda sudah terinstal:
- Node.js & npm
- XAMPP / MySQL Server
- Expo Go (di HP fisik) atau Android Emulator

---

## 🗄️ 1. Membuat Database MySQL
1. Buka phpMyAdmin atau terminal MySQL.
2. Buat database baru dengan nama `db_tugas` (atau sesuai konfigurasi Anda).
3. Jalankan kueri SQL berikut untuk membuat tabel yang dibutuhkan:
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     nama VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE push_tokens (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     expo_push_token TEXT NOT NULL,
     dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );

   CREATE TABLE tugas (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     judul VARCHAR(255) NOT NULL,
     deskripsi TEXT,
     status ENUM('pending', 'selesai') DEFAULT 'pending',
     dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );

Masuk ke folder backend:
Bash
cd backend
npm install

Buat file .env di dalam folder backend berdasarkan contoh berikut:

Cuplikan kode
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_tugas
JWT_SECRET=rahasia_jwt_anda

npm run dev

Buka terminal baru dan masuk ke folder frontend (frontend-expo):

Bash
cd frontend-expo
npm install
npx expo start

+------------------+             +-------------------+
|      users       |             |    push_tokens    |
+------------------+             +-------------------+
| PK id            |<----------+ | PK id             |
|    nama          |           | | FK user_id        |
|    email         |           | |    expo_push_token|
+------------------+           | +-------------------+
         |                     |
         | 1                   | N
         |                     |
         |                     +-------------------+
         |                                         |
         | 1                                       | N
         v                                         v
+------------------+                        (Opsional jika ingin
|      tugas       |                         digambar terpisah)
+------------------+
| PK id            |
| FK user_id       |
|    judul         |
|    deskripsi     |
|    status        |
+------------------+