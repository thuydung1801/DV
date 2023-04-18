const mongoose = require('mongoose');
const axios = require('axios');

// Khởi tạo kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/weather', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');


    // Lấy dữ liệu từ API OpenWeather
    axios.get('http://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=0f6cf13778c3421d801a90ef93fae283')
      .then(response => {
        // Lưu dữ liệu vào MongoDB
        const Weather = mongoose.model('weather-app', {
          city: String,
          temperature: Number,
          description: String
        });

        const weatherData = new Weather({
          city: response.data.name,
          temperature: response.data.main.temp,
          description: response.data.weather[0].description
        });

        weatherData.save()
          .then(() => console.log('Data saved to MongoDB'))
          .catch(err => console.log(err))
          .finally(() => mongoose.disconnect());
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
