import axios from 'axios';
import { DateTime } from 'luxon';

const API_KEY = '1fa9ff4126d95b8db54f3897a208e91c';
const BASE_URL = 'http://localhost:5001/weather';

const getWeatherData = async (searchParams) => {
  const { data } = await axios.get(`${BASE_URL}`, {
    params: {
      ...searchParams,
      appid: API_KEY,
    },
  });
  return data;
};

const getForecastData = async (searchParams) => {
  const { data } = await axios.get(`${BASE_URL}/des`, {
    params: {
      ...searchParams,
      appid: API_KEY,
    },
  });
  return data;
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  let { city, list } = data;
  // Lọc ra thông tin thời tiết của 5 ngày tiếp theo
  list = list.filter((item) => {
    const date = DateTime.fromSeconds(item.dt);
    return date.hour === 12; // Chỉ lấy thông tin thời tiết vào lúc 12 giờ trưa mỗi ngày
  });

  const daily = list.map((item) => {
    const date = DateTime.fromSeconds(item.dt);
    return {
      title: date.toFormat('ccc'), // Định dạng ngày theo dạng thứ viết tắt (Mon, Tue, ...)
      temp: item.main.temp,
      icon: item.weather[0].icon,
    };
  });

  return { timezone: city.timezone, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(searchParams).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getForecastData({
    lat,
    lon,
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
    ) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime,iconUrlFromCode };
