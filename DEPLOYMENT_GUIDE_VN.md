# Hướng dẫn triển khai OpenLinuxManager cho bạn bè

Tài liệu này hướng dẫn cách cài đặt và chạy dự án **OpenLinuxManager** trên máy ảo Ubuntu sử dụng Docker Compose.

---

## 1. Yêu cầu hệ thống (Máy ảo VMware)

Để đảm bảo ứng dụng chạy mượt mà, bạn nên cấu hình máy ảo Ubuntu với các thông số sau:

*   **Hệ điều hành:** Ubuntu 22.04 LTS hoặc mới hơn.
*   **CPU:** Tối thiểu 2 Cores.
*   **RAM:** Tối thiểu 4GB (Khuyên dùng 8GB để chạy mượt cả Docker và các dịch vụ).
*   **Dung lượng ổ cứng (Disk):** 
    *   Tối thiểu: **20GB** trống.
    *   Khuyên dùng: **40GB - 60GB** (Để có không gian cho Docker images, logs và database).
*   **Mạng:** Chế độ `Bridged` để có thể truy cập internet.

---

## 2. Cài đặt các công cụ cần thiết

Mở terminal trong Ubuntu và chạy các lệnh sau:

### Bước 1: Cập nhật hệ thống
```bash
sudo apt update && sudo apt upgrade -y
```

### Bước 2: Cài đặt Git
```bash
sudo apt install git -y
```

### Bước 3: Cài đặt Docker và Docker Compose
```bash
# Cài đặt Docker
sudo apt install docker.io -y

# Khởi động và cho phép Docker chạy cùng hệ thống
sudo systemctl enable --now docker

# Thêm user hiện tại vào nhóm docker để không cần gõ sudo mỗi lần chạy lệnh docker
sudo usermod -aG docker $USER
# Lưu ý: Bạn cần Log out và Log in lại để thay đổi này có hiệu lực.

# Cài đặt Docker Compose
sudo apt install docker-compose -y
```

---

## 3. Pull code và khởi chạy dự án

### Bước 1: Clone dự án từ GitHub
```bash
git clone https://github.com/nguyentantai111204/OpenLinuxManager.git
cd OpenLinuxManager
```

### Bước 2: Cấu hình môi trường
```bash
cp .env.example .env
```
*(Bạn có thể chỉnh sửa file `.env` nếu muốn thay đổi password database, nhưng mặc định là có thể chạy được ngay).*

### Bước 3: Chạy dự án bằng Docker Compose
```bash
docker-compose up --build -d
```

---

## 4. Truy cập ứng dụng

Sau khi lệnh trên hoàn thành, bạn có thể truy cập vào giao diện quản lý tại:

*   **Địa chỉ:** `http://<IP-của-máy-ảo>:3000` (Nếu chạy trong Docker Compose, backend thường gộp frontend vào cổng 3000 hoặc tùy cấu hình nginx).
*   Nếu bạn đang chạy trực tiếp trên máy ảo thì là: `http://localhost:3000`.

> [!TIP]
> Để biết IP của máy ảo, hãy gõ lệnh: `hostname -I` hoặc `ifconfig`.

---

## 5. Một số lưu ý quan trọng
*   Dự án này tương tác trực tiếp với hệ thống Linux (CPU, RAM, Processes...), vì vậy nó cần được chạy trên môi trường Linux thật hoặc máy ảo Linux.
*   Nếu gặp lỗi liên quan đến quyền truy cập database hoặc file, hãy kiểm tra lại logs bằng lệnh: `docker-compose logs -f`.
