<p align="center">
  <img src="https://raw.githubusercontent.com/nguyentantai111204/OpenLinuxManager/main/apps/client/src/assets/logo.png" alt="OpenLinuxManager Logo" width="120">
</p>

<h1 align="center">OpenLinuxManager</h1>

<p align="center">
  <strong>A high-performance, web-based Linux system management dashboard.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Nx-143055?style=for-the-badge&logo=nx&logoColor=white" alt="Nx">
  <br>
  <img src="https://img.shields.io/github/license/nguyentantai111204/OpenLinuxManager" alt="License">
  <img src="https://img.shields.io/github/stars/nguyentantai111204/OpenLinuxManager" alt="Stars">
  <img src="https://img.shields.io/github/issues/nguyentantai111204/OpenLinuxManager" alt="Issues">
</p>

---

[Tiếng Việt bên dưới](#tiếng-việt) | [English](#english)

<div id="english">

## 🌟 Overview

OpenLinuxManager is a modern, responsive, and secure web interface designed for managing Linux servers. It provides real-time monitoring, terminal access, and essential system management tools directly from your browser.

## ✨ Key Features

- 📊 **Real-time Monitoring**: Visualize CPU, RAM, Storage, and Uptime with smooth charts and live updates.
- 🐚 **Web Terminal**: Fully functional xterm-compatible terminal with PTY support.
- ⚙️ **Process Management**: Monitor, kill, terminate, or suspend system processes.
- 👥 **User Management**: Easily list, create, and manage system users.
- 🛠 **Service Control**: Manage systemd services (start, stop, etc.).
- 📜 **Audit Logs**: Track important system changes and actions.
- 🐳 **Docker-Ready**: Deploy in seconds using Docker Compose.

## 🛠 Tech Stack

- **Monorepo**: [Nx](https://nx.dev)
- **Frontend**: React, Material UI, SWR, Socket.io-client
- **Backend**: NestJS, Socket.io, Node-pty, PostgreSQL
- **Monitoring**: Native Linux commands & Python scripts

## 🚀 Quick Start (Docker)

1.  **Clone the project**:
    ```bash
    git clone https://github.com/nguyentantai111204/OpenLinuxManager.git
    cd OpenLinuxManager
    ```

2.  **Run with Quick Start script**:
    ```bash
    ./quick-start.sh
    ```
    *This will set up your `.env` and start everything via Docker.*

3.  **Access the Dashboard**:
    Open [http://localhost:3000](http://localhost:3000)

## 🏗 Development Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    ```bash
    cp .env.example .env
    ```
3.  **Start Services**:
    ```bash
    # Start Backend
    npx nx serve server
    
    # Start Frontend
    npx nx serve client
    ```

---

<div id="tiếng-việt">

## 🌟 Giới thiệu

OpenLinuxManager là một giao diện web hiện đại, nhạy bén và an toàn được thiết kế để quản lý máy chủ Linux. Nó cung cấp khả năng giám sát thời gian thực, truy cập terminal và các công cụ quản lý hệ thống thiết yếu ngay từ trình duyệt của bạn.

## ✨ Tính năng chính

- 📊 **Giám sát thời gian thực**: Trực quan hóa CPU, RAM, Lưu trữ và Uptime với biểu đồ mượt mà.
- 🐚 **Web Terminal**: Terminal tương thích xterm đầy đủ chức năng với hỗ trợ PTY.
- ⚙️ **Quản lý tiến trình**: Giám sát, dừng (kill), hoặc tạm dừng các tiến trình hệ thống.
- 👥 **Quản lý người dùng**: Danh sách, tạo và quản lý người dùng hệ thống dễ dàng.
- 🛠 **Quản lý dịch vụ**: Điều khiển các dịch vụ systemd (start, stop, v.v.).
- 📜 **Nhật ký hệ thống**: Theo dõi các thay đổi và hành động quan trọng trên hệ thống.
- 🐳 **Sẵn sàng cho Docker**: Triển khai trong vài giây bằng Docker Compose.

## 🚀 Bắt đầu nhanh (Docker)

Chỉ cần chạy lệnh sau:
```bash
./quick-start.sh
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<p align="center">Made with ❤️ for Linux enthusiasts</p>
