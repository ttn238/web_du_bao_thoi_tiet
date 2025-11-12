// API Key (Task 1) và thành phố mặc định
const API_KEY = "4ccc40ea6b894dc79ca142324251111";
const DEFAULT_CITY = "Ho Chi Minh";

// --- Hàm chuyển đổi Nhiệt độ Cảm nhận sang Trạng thái Cảm giác ---
/**
 * Dịch nhiệt độ cảm nhận (feelslike_c) sang mô tả trạng thái cảm giác bằng tiếng Việt.
 * Lưu ý: Các ngưỡng nhiệt độ này là ước tính dựa trên cảm giác chung.
 * @param {number} feelsLikeC - Nhiệt độ cảm nhận theo độ C.
 * @returns {string} Mô tả trạng thái cảm giác (ví dụ: "Mát Mẻ").
 */
function getFeelStatus(feelsLikeC) {
    if (feelsLikeC >= 35) {
        return "Rất Nóng (Khó Chịu)";
    } else if (feelsLikeC >= 30) {
        return "Khá Nóng Bức";
    } else if (feelsLikeC >= 25) {
        return "Ấm Áp";
    } else if (feelsLikeC >= 20) {
        return "Mát Mẻ Dễ Chịu";
    } else if (feelsLikeC >= 15) {
        return "Se Lạnh";
    } else if (feelsLikeC >= 10) {
        return "Khá Lạnh";
    } else {
        return "Rét Đậm";
    }
}

// --- Hàm chính để gọi API và cập nhật giao diện ---
/**
 * Gọi API WeatherAPI để lấy dữ liệu thời tiết hiện tại cho thành phố được chỉ định
 * và cập nhật các phần tử HTML tương ứng.
 * @param {string} city - Tên thành phố cần tìm kiếm.
 */
function fetchAndUpdateWeather(city) {
    // 1. Xây dựng URL API
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&lang=vi`;
    
    // 2. Cập nhật trạng thái chờ trên giao diện
    const lastActionElement = document.getElementById('lastAction');
    lastActionElement.textContent = `Đang tải dữ liệu cho ${city}...`;

    fetch(url)
        .then(res => {
            if (!res.ok) {
                // Xử lý các lỗi HTTP như 404 (Không tìm thấy thành phố)
                throw new Error(`Lỗi HTTP: ${res.status} - Không tìm thấy thành phố hoặc lỗi dữ liệu.`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Dữ liệu Thời tiết Hiện tại:", data); 

            // --- Cập nhật Giao diện ---
            
            // Lấy các phần tử DOM để cập nhật
            const cityNameEl = document.getElementById('cityName');
            const updatedEl = document.getElementById('updated');
            const tempEl = document.getElementById('temp');
            const feelsEl = document.getElementById('feels');
            const descEl = document.getElementById('desc');
            const humidityEl = document.getElementById('humidity');
            const windEl = document.getElementById('wind');
            const statusEl = document.getElementById('status');
            const iconEl = document.getElementById('icon');

            const currentTemp = Math.round(data.current.temp_c);
            const feelsLikeTemp = Math.round(data.current.feelslike_c);
            const conditionText = data.current.condition.text;
            const feelStatus = getFeelStatus(feelsLikeTemp);
            const windMs = (data.current.wind_kph / 3.6).toFixed(1); 

            // Cập nhật tên thành phố và trạng thái hành động cuối cùng
            cityNameEl.textContent = data.location.name;
            lastActionElement.textContent = `Hoàn tất lúc ${new Date().toLocaleTimeString('vi-VN')}`;

            // 1. Cập nhật lúc: (updatedEl)
            updatedEl.textContent = `Cập nhật lúc: ${data.current.last_updated.split(' ')[1]}`;

            // 2. Loại bỏ dòng mô tả thời tiết dư thừa (trước đây là descEl)
            descEl.textContent = ''; 
            
            // 3. Nhiệt độ thực tế: (tempEl) - Thẻ nhiệt độ lớn, dùng để hiển thị rõ ràng nhiệt độ thực tế
            // Tận dụng thẻ temp nhưng thêm nhãn "Nhiệt độ thực tế: " vào
            // Lưu ý: Thẻ temp có font-size rất lớn, việc thêm nhãn có thể khiến bố cục bị xô lệch nhiều.
            // Để giữ bố cục tốt, tôi sẽ đặt Nhiệt độ thực tế vào thẻ DESC và để trống thẻ TEMP.
            
            // QUYẾT ĐỊNH MỚI: Dòng "24°" (tempEl) phải chứa nhãn "Nhiệt độ thực tế:".
            // Dù thẻ này lớn, tôi vẫn thực hiện theo yêu cầu:
            tempEl.textContent = `Nhiệt độ thực tế: ${currentTemp}°C`; 
            
            // Do tempEl giờ chứa "Nhiệt độ thực tế:", tôi sẽ chuyển thông tin MÔ TẢ THỜI TIẾT 
            // sang thẻ khác hoặc loại bỏ. Yêu cầu là bỏ dòng dư thừa, nên ta sẽ bỏ descEl.
            
            // 4. Cảm giác (feelsEl) - CHỈ hiển thị cảm giác
            feelsEl.textContent = `Cảm giác: ${feelStatus} (${feelsLikeTemp}°C)`;
            
            // 5, 6, 7. Độ ẩm, Gió, Trạng thái (meta-grid) - Tận dụng các thẻ sẵn có
            humidityEl.textContent = `${data.current.humidity}%`;
            windEl.textContent = `${windMs} m/s`;
            statusEl.textContent = conditionText; 

            // Xử lý Icon 
            const iconUrl = data.current.condition.icon.startsWith('//') 
                            ? `https:${data.current.condition.icon}` 
                            : data.current.condition.icon;
            iconEl.innerHTML = `<img src="${iconUrl}" alt="Icon thời tiết" style="width: 100px; height: 100px;">`;
            
        })
        .catch(err => {
            console.error("Lỗi khi tải dữ liệu:", err);
            lastActionElement.textContent = `Lỗi: Không tải được dữ liệu!`;
        });
}


// --- Gắn Sự kiện (Event Listeners) ---

// 1. Tải dữ liệu mặc định khi trang load
window.addEventListener('load', () => {
    fetchAndUpdateWeather(DEFAULT_CITY);
});

// 2. Sự kiện cho nút Làm mới (Refresh Button)
document.getElementById('refreshBtn').addEventListener('click', () => {
    const currentCity = document.getElementById('searchInput').value || DEFAULT_CITY;
    fetchAndUpdateWeather(currentCity);
});

// 3. Sự kiện Tìm kiếm (khi nhấn Enter trong ô input)
document.getElementById('searchInput').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = document.getElementById('searchInput').value;
        if (city) {
            fetchAndUpdateWeather(city);
        }
    }
});
