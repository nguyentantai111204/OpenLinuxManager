# Hướng Dẫn Cài Đặt OpenLinuxManager (10 Bước Hoàn Chỉnh)

Chào mừng bạn! Đây là quy trình "chuẩn" để cài đặt hệ thống giám sát Linux này cho bạn bè của bạn, giúp họ tốn ít công sức nhất:

### B1: Tải Ubuntu + VMware
Tải và cài đặt **VMware Workstation Player** (miễn phí) và file ISO **Ubuntu Desktop 22.04 LTS** (hoặc mới hơn).

### B2: Cài đặt Ubuntu
Chạy Ubuntu trên VM. Tạo thông tin user (Nhớ kỹ **username** và **password** vì đây sẽ là quyền root để quản lý hệ thống).

### B3: Cập nhật hệ thống
Mở Terminal trong Ubuntu và chạy:
```bash
sudo apt update && sudo apt upgrade -y
```

### B4: Cài đặt Git & Docker
```bash
sudo apt install git docker.io -y
```

### B5: Kích hoạt Docker
```bash
sudo systemctl enable --now docker
# Kiểm tra: sudo systemctl status docker (thấy active running là xong)
```

### B6: Phân quyền Docker cho User (Rất quan trọng)
```bash
sudo usermod -aG docker $USER
exit
```
**LƯU Ý:** Sau lệnh `exit`, hãy đăng nhập lại vào Ubuntu để quyền Docker có hiệu lực.

### B7: Kiểm tra Docker
```bash
docker ps
# Nếu không thấy lỗi "Access Denied" là bạn đã thành công.
```

### B8: Cài đặt Docker Compose
```bash
sudo apt install docker-compose -y
```

### B9: Tải Source Code
```bash
git clone https://github.com/nguyentantai111204/OpenLinuxManager.git
cd OpenLinuxManager
```

### B10: Chạy Script Tự Động (Bước cuối cùng)
Đây là bước "vũ khí" giúp bạn không cần sửa file `.env` hay config thủ công:
```bash
chmod +x quick-start.sh
./quick-start.sh
```

**Kết quả:** Hệ thống sẽ tự động tạo password bảo mật, cấu hình môi trường và khởi chạy ứng dụng. Bạn chỉ việc mở trình duyệt và truy cập: `http://localhost:3000`.

---
**💡 Mẹo:** Nếu muốn quản lý các tiến trình hệ thống mượt mà nhất, hãy chạy file `./setup-sudo.sh` (nếu có) để hệ thống không hỏi password mỗi khi bạn thao tác trên giao diện web.
