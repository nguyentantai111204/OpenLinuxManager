# OpenLinuxManager

OpenLinuxManager là một ứng dụng giám sát và quản lý hệ thống Linux từ xa với giao diện hiện đại, trực quan.

## 🚀 Cách chạy nhanh nhất (Khuyên dùng)

Cách dễ nhất để chạy dự án này mà không cần cài đặt nhiều môi trường (Node.js, PostgreSQL, v.v.) là sử dụng **Docker Compose**.

### Yêu cầu
- Đã cài đặt [Docker](https://docs.docker.com/get-docker/) và [Docker Compose](https://docs.docker.com/compose/install/).

### Các bước thực hiện

1.  **Sao chép cấu hình môi trường**:
    ```bash
    cp .env.example .env
    ```
2.  **Khởi động bằng Docker Compose**:
    ```bash
    docker compose up --build -d
    ```
3.  **Truy cập ứng dụng**:
    Mở trình duyệt và truy cập `http://localhost:3000`.

---

## 🛠 Phát triển (Chạy local)

Nếu bạn muốn thay đổi code và chạy ở chế độ phát triển (development):

### Yêu cầu
- Node.js (v20+)
- PostgreSQL đang chạy

### Các bước thực hiện

1.  **Cài đặt phụ thuộc**:
    ```bash
    npm install
    ```
2.  **Cấu hình .env**: Chỉnh sửa file `.env` với thông tin database của bạn.
3.  **Chạy server (NestJS)**:
    ```bash
    npx nx serve server
    ```
4.  **Chạy client (React + Vite)**:
    ```bash
    npx nx serve client
    ```
    Truy cập giao diện tại `http://localhost:4200`.

---

## 🏗 Cấu trúc dự án

Dự án sử dụng [Nx Monorepo](https://nx.dev):
- `apps/client`: React Frontend sử dụng MUI và SWR.
- `apps/server`: NestJS Backend kết nối trực tiếp với hệ thống Linux qua shell/python.
- `Dockerfile`: Multi-stage build để tối ưu hóa việc triển khai.

