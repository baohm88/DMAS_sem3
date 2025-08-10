# 🎮 BattleGame - CRUD Players & Assets

Dự án demo CRUD Player và Asset sử dụng:

-   **Backend**: ASP.NET Core Web API + MySQL + EF Core
-   **Frontend**: Vite + React + React-Bootstrap + React-Toastify
-   **API Docs**: Swagger UI

---

## 📦 Yêu cầu môi trường

-   **.NET 8 SDK** hoặc mới hơn
-   **Node.js** >= 18.x
-   **MySQL** >= 8.x
-   Git

---

## 🚀 1. Clone project

```bash
git clone https://github.com/baohm88/DMAS_sem3.git
cd DMAS_sem3
```

---

## ⚙ 2. Setup Backend

### 2.1. Vào thư mục backend

```bash
cd BattleGameApi
```

### 2.2. Cài các package cần thiết

```bash
dotnet restore
```

Các package chính:

-   `Pomelo.EntityFrameworkCore.MySql`
-   `Microsoft.EntityFrameworkCore.Design`
-   `Swashbuckle.AspNetCore` (Swagger)

### 2.3. Cấu hình MySQL connection

Mở file `appsettings.json` và chỉnh thông tin kết nối:

```json
{
    "ConnectionStrings": {
        "DefaultConnection": "server=localhost;port=3306;database=BATTLEGAME;user=root;password=;TreatTinyAsBoolean=true;"
    },
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "AllowedHosts": "*"
}
```

> ⚠ Nếu MySQL của bạn có mật khẩu cho user `root`, hãy thêm vào `"password=yourpassword;"`.

### 2.4. Tạo database và migration

```bash
dotnet ef migrations add InitCreate
dotnet ef database update
```

### 2.5. Chạy backend

```bash
dotnet watch run
```

API sẽ chạy ở:

-   HTTP: `http://localhost:5000`
-   HTTPS: `https://localhost:5001`

Swagger UI:  
📄 **[https://localhost:5001/swagger/index.html](https://localhost:5001/swagger/index.html)**

---

## 💻 3. Setup Frontend

### 3.1. Vào thư mục frontend

```bash
cd ../BattleGameFrontend
```

### 3.2. Cài các package cần thiết

```bash
npm install
```

Các package chính:

-   `react-bootstrap`
-   `bootstrap`
-   `react-toastify`
-   `axios`
-   `react-router-dom`

### 3.3. Chỉnh API URL

Mở file `.env` hoặc nơi bạn định nghĩa `API_URL` và chỉnh:

```env
VITE_API_BASE_URL=https://localhost:5001/api
```

### 3.4. Chạy frontend

```bash
npm run dev
```

Ứng dụng chạy ở:

```
http://localhost:5173
```

---

## 🔗 4. Các API Endpoints chính

### Players

-   `GET /api/players` → Lấy danh sách player (có AssetNames + AssetIds)
-   `GET /api/players/{id}` → Lấy chi tiết player
-   `POST /api/players` → Thêm player mới
-   `PUT /api/players/{id}` → Cập nhật player
-   `DELETE /api/players/{id}` → Xóa player

### Assets

-   `GET /api/assets` → Lấy danh sách assets
-   `GET /api/assets/{id}` → Lấy chi tiết asset
-   `POST /api/assets` → Thêm asset mới
-   `PUT /api/assets/{id}` → Cập nhật asset
-   `DELETE /api/assets/{id}` → Xóa asset

---

## 🧪 5. Test nhanh qua Swagger

1. Chạy backend:
    ```bash
    cd backend
    dotnet watch run
    ```
2. Mở trình duyệt truy cập:  
   [https://localhost:5001/swagger/index.html](https://localhost:5001/swagger/index.html)
3. Chọn endpoint muốn test, nhập dữ liệu JSON, nhấn **Execute**.

Ví dụ tạo asset:

```json
{
    "assetName": "Magic Sword",
    "levelRequired": 5
}
```

---

## 📌 6. Ghi chú

-   Khi thêm/sửa Player:
    -   Chỉ có thể gán asset mới nếu `player.Level >= asset.LevelRequired`.
    -   Asset đã sở hữu sẽ vẫn giữ nguyên dù level hiện tại < yêu cầu.
-   Frontend sẽ disable asset không đủ level khi chọn mới, nhưng vẫn hiển thị asset đã có.

---

## 👨‍💻 Tác giả

-   **Tên**: Ha Manh Bao
-   **Email**: baohm88@gmail.com
-   **GitHub**: [https://github.com/baohm88](https://github.com/baohm88)
