const apiKey = '53ebd5f6d537c205d2d7396b740bcd37'; // << วาง API Key ที่คัดลอกมาที่นี่

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีโหลดเมื่อกด submit

    const cityName = cityInput.value.trim(); // .trim() เพื่อตัดช่องว่างหน้า-หลัง

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});

async function getWeather(city) {
    // แสดงสถานะ Loading
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon, main: weatherMain } = weather[0];

    // HTML ของข้อมูลอากาศ
    const weatherHtml = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;

    weatherInfoContainer.innerHTML = weatherHtml;

    // เปลี่ยนสีพื้นหลังตามสภาพอากาศ
    changeBackground(weatherMain);
}

function changeBackground(weatherMain) {
    let bgColor;

    switch (weatherMain.toLowerCase()) {
        case "clear":
            bgColor = "linear-gradient(to bottom, #4facfe, #00f2fe)"; // ฟ้าใส
            break;
        case "clouds":
            bgColor = "linear-gradient(to bottom, #757f9a, #d7dde8)"; // เมฆ
            break;
        case "rain":
        case "drizzle":
            bgColor = "linear-gradient(to bottom, #373b44, #4286f4)"; // ฝน
            break;
        case "thunderstorm":
            bgColor = "linear-gradient(to bottom, #141e30, #243b55)"; // พายุ
            break;
        case "snow":
            bgColor = "linear-gradient(to bottom, #83a4d4, #b6fbff)"; // หิมะ
            break;
        case "mist":
        case "fog":
        case "haze":
            bgColor = "linear-gradient(to bottom, #606c88, #3f4c6b)"; // หมอก
            break;
        default:
            bgColor = "#051923"; // ค่าเริ่มต้น
    }

    document.body.style.background = bgColor;
}
