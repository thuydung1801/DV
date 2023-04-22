import axios from 'axios';
import { DateTime } from 'luxon';

const API_KEY = '1fa9ff4126d95b8db54f3897a208e91c';
const BASE_URL = 'http://localhost:5001/weather';

const getWeatherData = async (infoType , searchParams) => {
  
 
    const { data } = await axios.get(`${BASE_URL}/${infoType}`, {
      params: {
        ...searchParams,
       
      },
    });
    return data;
  
  
  // return data;
};
// const getWeatherLocationData = async (searchParams) => {
//   const { data } = await axios.get(`${BASE_URL}/location`, {
//     params: {
//       ...searchParams,
     
//     },
//   });
//   return data;
// };

// const getForecastData = async (searchParams) => {
//   const { data } = await axios.get(`${BASE_URL}/des`, {
//     params: {
//       ...searchParams,
      
//     },
//   });
//   return data;
// };

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
//   let { city, list } = data;
//   // Lọc ra thông tin thời tiết của 5 ngày tiếp theo
//   list = list.filter((item) => {
//     const date = DateTime.fromSeconds(item.dt);
//     return date.hour === 12; // Chỉ lấy thông tin thời tiết vào lúc 12 giờ trưa mỗi ngày
//   });

//   const daily = list.map((item) => {
//     const date = DateTime.fromSeconds(item.dt);
//     return {
//       title: date.toFormat('ccc'), // Định dạng ngày theo dạng thứ viết tắt (Mon, Tue, ...)
//       temp: item.main.temp,
//       icon: item.weather[0].icon,
//     };
//   });

//   return { timezone: city.timezone, daily };

let {timezone, daily, hourly} =data;
    // chi hien thi ra 5 ngay dau tien
    daily = daily.slice(1,6).map((d) =>{
        return {
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        };
    });

    hourly = hourly.slice(1,6).map((d) =>{
        return {
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon
        }
    });

    return {timezone, daily, hourly};
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData("city",searchParams).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;
  // const { lat, lon } = formattedCurrentLocationWeather;

  const formattedForecastWeather = await getWeatherData("des",{
    
    lat,
    lon,
    units: searchParams.units,
  }).then(formatForecastWeather);
  // const formattedCurrentLocationWeather = await getWeatherLocationData({
  //   lat : "20.9813504",
  //   lon : "105.775104",
  //   units: searchParams.units,
  // }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

// const getFormattedWeatherData2 = async (searchParams) => {
//   // const formattedCurrentWeather = await getWeatherData(searchParams).then(formatCurrentWeather);

//   const formattedCurrentLocationWeather = await getWeatherLocationData(searchParams).then(formatCurrentWeather);

//  const { lat, lon } = formattedCurrentLocationWeather;
//   // const { lat, lon } = formattedCurrentLocationWeather;

//   const formattedForecastWeather = await getForecastData({
//     lat,
//     lon,
//     units: searchParams.units,
//   }).then(formatForecastWeather);

//   return { ...formattedCurrentLocationWeather, ...formattedForecastWeather };
// };

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
    ) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime,iconUrlFromCode };
