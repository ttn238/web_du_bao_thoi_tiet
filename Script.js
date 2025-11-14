// 🔑 API Key và Thành phố mặc định
const API_KEY = "f68464e235e2135e3061ae64783e57bb";
const DEFAULT_CITY = "Ho Chi Minh";

// 🌍 Bảng ánh xạ tên tỉnh/thành Việt Nam
const VN_CITY_NAME_MAP = {
  "Ho Chi Minh": "Hồ Chí Minh",
  "Hanoi": "Hà Nội",
  "Da Nang": "Đà Nẵng",
  "Hai Phong": "Hải Phòng",
  "Can Tho": "Cần Thơ",
  "An Giang": "An Giang",
  "Ba Ria-Vung Tau": "Bà Rịa - Vũng Tàu",
  "Bac Giang": "Bắc Giang",
  "Bac Kan": "Bắc Kạn",
  "Bac Lieu": "Bạc Liêu",
  "Bac Ninh": "Bắc Ninh",
  "Ben Tre": "Bến Tre",
  "Binh Dinh": "Bình Định",
  "Binh Duong": "Bình Dương",
  "Binh Phuoc": "Bình Phước",
  "Binh Thuan": "Bình Thuận",
  "Ca Mau": "Cà Mau",
  "Cao Bang": "Cao Bằng",
  "Dak Lak": "Đắk Lắk",
  "Dak Nong": "Đắk Nông",
  "Dien Bien": "Điện Biên",
  "Dong Nai": "Đồng Nai",
  "Dong Thap": "Đồng Tháp",
  "Gia Lai": "Gia Lai",
  "Ha Giang": "Hà Giang",
  "Ha Nam": "Hà Nam",
  "Ha Tinh": "Hà Tĩnh",
  "Hai Duong": "Hải Dương",
  "Hau Giang": "Hậu Giang",
  "Hoa Binh": "Hòa Bình",
  "Hung Yen": "Hưng Yên",
  "Khanh Hoa": "Khánh Hòa",
  "Kien Giang": "Kiên Giang",
  "Kon Tum": "Kon Tum",
  "Lai Chau": "Lai Châu",
  "Lam Dong": "Lâm Đồng",
  "Lang Son": "Lạng Sơn",
  "Lao Cai": "Lào Cai",
  "Long An": "Long An",
  "Nam Dinh": "Nam Định",
  "Nghe An": "Nghệ An",
  "Ninh Binh": "Ninh Bình",
  "Ninh Thuan": "Ninh Thuận",
  "Phu Tho": "Phú Thọ",
  "Phu Yen": "Phú Yên",
  "Quang Binh": "Quảng Bình",
  "Quang Nam": "Quảng Nam",
  "Quang Ngai": "Quảng Ngãi",
  "Quang Ninh": "Quảng Ninh",
  "Quang Tri": "Quảng Trị",
  "Soc Trang": "Sóc Trăng",
  "Son La": "Sơn La",
  "Tay Ninh": "Tây Ninh",
  "Thai Binh": "Thái Bình",
  "Thai Nguyen": "Thái Nguyên",
  "Thanh Hoa": "Thanh Hóa",
  "Thua Thien Hue": "Thừa Thiên Huế",
  "Tien Giang": "Tiền Giang",
  "Tra Vinh": "Trà Vinh",
  "Tuyen Quang": "Tuyên Quang",
  "Vinh Long": "Vĩnh Long",
  "Vinh Phuc": "Vĩnh Phúc",
  "Yen Bai": "Yên Bái"
};


// 🌡️ Hàm mô tả cảm giác nhiệt độ
function getFeelStatus(feelsLikeC) {
  if (feelsLikeC >= 35) return "Rất Nóng (Khó Chịu)";
  if (feelsLikeC >= 30) return "Khá Nóng Bức";
  if (feelsLikeC >= 25) return "Ấm Áp";
  if (feelsLikeC >= 20) return "Mát Mẻ Dễ Chịu";
  if (feelsLikeC >= 15) return "Se Lạnh";
  if (feelsLikeC >= 10) return "Khá Lạnh";
  return "Rét Đậm";
}

// 🛠️ Chuẩn hóa tên người dùng nhập để API hiểu
function normalizeCityInput(userInput) {
  const text = userInput.trim().toLowerCase();

  // Các trường hợp hay gặp dành riêng cho TP.HCM
  const hcmList = ["tp hcm", "tphcm", "hcm", "sai gon", "saigon", "sg", "Ho Chi Minh", "TP Hồ Chí Minh", "TPHCM"];
  if (hcmList.includes(text)) return "Ho Chi Minh";

  return userInput; // nếu không thuộc dạng đặc biệt thì giữ nguyên
}


// 🌦️ Hàm gọi OpenWeatherMap API
function fetchAndUpdateWeather(city) {
  city = normalizeCityInput(city); // ✅ thêm dòng này
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )},VN&appid=${API_KEY}&units=metric&lang=vi`;

  const lastActionElement = document.getElementById("lastAction");
  lastActionElement.textContent = `Đang tải dữ liệu cho ${city}...`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("✅ Dữ liệu thời tiết:", data);

      // --- Lấy dữ liệu từ API ---
      const cityName = VN_CITY_NAME_MAP[data.name] || data.name;
      const currentTemp = Math.round(data.main.temp);
      const feelsLikeTemp = Math.round(data.main.feels_like);
      const humidity = data.main.humidity;
      const windSpeed = (data.wind.speed).toFixed(1);
      const conditionText = data.weather[0].description;
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const feelStatus = getFeelStatus(feelsLikeTemp);

      // --- Cập nhật giao diện ---
      document.getElementById("cityName").textContent = cityName;
      document.getElementById("updated").textContent = `Cập nhật lúc: ${new Date().toLocaleTimeString("vi-VN")}`;
      document.getElementById("temp").textContent = `Nhiệt độ thực tế: ${currentTemp}°C`;
      document.getElementById("feels").textContent = `Cảm giác: ${feelStatus} (${feelsLikeTemp}°C)`;
      document.getElementById("humidity").textContent = `${humidity}%`;
      document.getElementById("wind").textContent = `${windSpeed} m/s`;
      document.getElementById("status").textContent = conditionText;
      document.getElementById("icon").innerHTML = `<img src="${iconUrl}" alt="Icon thời tiết" style="width:100px;height:100px;">`;
      document.getElementById("desc").textContent = "";

      lastActionElement.textContent = `Hoàn tất lúc ${new Date().toLocaleTimeString("vi-VN")}`;
    })
    .catch((err) => {
      console.error("❌ Lỗi khi tải dữ liệu:", err);
      lastActionElement.textContent = `Lỗi: Không tải được dữ liệu!`;
    });
}

// --- Gắn sự kiện ---
window.addEventListener("load", () => fetchAndUpdateWeather(DEFAULT_CITY));

document.getElementById("locateBtn").addEventListener("click", () => {
  const currentCity = document.getElementById("searchInput").value || DEFAULT_CITY;
  fetchAndUpdateWeather(currentCity);
});

document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value.trim();
    if (city) fetchAndUpdateWeather(city);
  }
});

document.getElementById("refreshBtn").addEventListener("click", () => {
  const currentCity = document.getElementById("cityName").textContent || DEFAULT_CITY;
  const lastActionElement = document.getElementById("lastAction");
  lastActionElement.textContent = `Đang làm mới dữ liệu cho ${currentCity}...`;
  fetchAndUpdateWeather(currentCity);
});
