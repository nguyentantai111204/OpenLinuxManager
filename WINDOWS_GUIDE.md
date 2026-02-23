# Hướng dẫn chạy OpenLinuxManager trên Windows

Vì đây là ứng dụng quản lý hệ thống Linux, bạn cần một môi trường Linux (Máy ảo hoặc WSL2) để chạy.

## Cách 1: Sử dụng VMware + Ubuntu (Khuyên dùng cho trải nghiệm thật)

### Bước 1: Chuẩn bị máy ảo
1. Tải và cài đặt **VMware Player** (Miễn phí) hoặc VirtualBox.
2. Tải file ISO **Ubuntu Desktop** hoặc **Ubuntu Server**.
3. Tạo máy ảo và cài đặt Ubuntu.

### Bước 2: Cài đặt công cụ bên trong Ubuntu
Mở Terminal trong Ubuntu và chạy lệnh sau:
```bash
# Cập nhật và cài đặt Git, Docker
sudo apt update
sudo apt install git docker.io docker-compose -y

# Thêm quyền cho Docker (để không cần gõ sudo)
sudo usermod -aG docker $USER
```
**Lưu ý:** Sau khi chạy lệnh `usermod`, hãy khởi động lại máy ảo (Restart) để áp dụng quyền.

### Bước 3: Chạy dự án
```bash
# Clone dự án
git clone https://github.com/nguyentantai111204/OpenLinuxManager.git
cd OpenLinuxManager

# Tạo file môi trường
cp .env.example .env

# Khởi động Docker
docker compose up --build -d
```
Truy cập: `http://localhost:3000`

---

## Cách 2: Sử dụng WSL2 (Nhanh nhất trên Windows)

Nếu bạn không muốn dùng VMware, hãy sử dụng WSL2 có sẵn trên Windows.

1. Mở PowerShell với quyền Admin và chạy: `wsl --install`.
2. Khởi động lại máy tính.
3. Cài đặt **Docker Desktop** trên Windows và bật tính năng **WSL2 Integration** trong Settings của Docker.
4. Mở terminal Ubuntu (WSL), clone dự án và chạy `docker compose up --build -d`.

---

## ❓ Các câu hỏi thường gặp

**1. Làm sao để truy cập từ trình duyệt Windows vào máy ảo VMware?**
- Trong Ubuntu, gõ lệnh `ip a` để lấy địa chỉ IP (thường là `192.168.x.x`).
- Trên trình duyệt Windows, truy cập `http://<IP-CUA-UBUNTU>:3000`.

**2. Tôi có cần sửa file .env không?**
- Với mục đích chạy thử, file `.env.example` đã có sẵn các cấu hình mặc định. Bạn chỉ cần `cp .env.example .env` là chạy được ngay.
