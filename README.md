# 🌤️ Web Thông Tin Dự Báo Thời Tiết

## 📋 Giới thiệu

Website dự báo thời tiết theo thời gian thực, hỗ trợ tìm kiếm thành phố, hiển thị nền theo điều kiện thời tiết và nhiều tiện ích khác.

## ✨ Tính năng chính

### 🔍 Tìm kiếm thành phố
- Tìm kiếm thời tiết theo tên thành phố

### 🌡️ Thông tin thời tiết chi tiết
- Nhiệt độ hiện tại
- Cảm giác thực tế 
- Độ ẩm không khí
- Tốc độ gió
- Điều kiện thời tiết (nắng, mưa, mây...)
- Icon trực quan cho từng điều kiện

### 🎨 Giao diện động
- Nền thay đổi theo điều kiện thời tiết:
  - Nắng: Hình có nắng
  - Mưa: Hình có những giọt mưa
  - Mây: Hình có những đám mây quang đãng
- Animation mượt mà
- Responsive trên mọi thiết bị

### 📊 Biểu đồ thống kê
- Biểu đồ nhiệt độ theo ngày
- Biểu đồ dự báo 5 ngày
- Trực quan hóa dữ liệu bằng Chart.js

## 🛠️ Công nghệ sử dụng

- **HTML**: Cấu trúc trang web
- **CSS**: Styling và animation
- **JavaScript**: Logic xử lý
- **Chart.js**: Vẽ biểu đồ thống kê
- **Weather API**: Lấy dữ liệu thời tiết real-time
  - OpenWeatherMap API
  - hoặc WeatherAPI.com

## 📂 Cấu trúc thư mục

```
web_du_bao_thoi_tiet/
│
├── index.html          # Trang chính
├── intro.html          # Trang giới thiệu
├── Script.js           # Logic JavaScript chính
├── Chart.js            # Xử lý biểu đồ
├── Style.css           # Styling chính
├── README.md           # Tài liệu dự án
│
└── images/             # Thư mục chứa hình ảnh
    └── ...             # Ảnh nền
```

## 🚀 Cài đặt và sử dụng

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet
- API key từ OpenWeatherMap hoặc WeatherAPI

### Các bước cài đặt

1. **Clone repository**
```bash
git clone https://github.com/ttn238/web_du_bao_thoi_tiet.git
cd web_du_bao_thoi_tiet
```

2. **Cấu hình API Key**
- Đăng ký tài khoản tại [OpenWeatherMap](https://openweathermap.org/api)
- Lấy API key miễn phí
- Thêm API key vào file `Script.js`:
```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

3. **Chạy ứng dụng**
- Mở file `index.html` bằng trình duyệt
- Hoặc sử dụng Live Server trong VS Code

## 📱 Hướng dẫn sử dụng

1. **Mở Link**: Mở web dự báo thời tiết lên bằng Link: [Dự báo thời tiết](https://thoitietvn.infinityfreeapp.com/)
1. **Tìm kiếm thành phố**: Nhập tên thành phố vào ô tìm kiếm và nhấn Enter hoặc là ấn vào ô có tên thành phố ở thanh bên trái
2. **Xem chi tiết**: Thông tin thời tiết hiển thị ngay lập tức
3. **Xem biểu đồ**: Kéo xuống để xem dự báo chi tiết theo giờ và theo ngày

## 👥 Contributors

- **BaoGiaHuynh** - Huỳnh Gia Bảo - 6551071007
- **quangchi997** - Lê Quang Chí - 6551071010
- **NguyenNgocNga56** - Nguyễn Ngọc Ngà - 6551071056
- **ttn238** - Trần Thảo Nương - 6551071060
