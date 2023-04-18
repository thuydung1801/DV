const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/weather';

axios.get('https://api.openweathermap.org/data/2.5/weather?q=Hanoi&appid=0f6cf13778c3421d801a90ef93fae283')
  .then(response => {
    const weatherData = response.data;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log('Database connected!');
      const collection = db.collection('weather-app');
      collection.insertOne(weatherData, function(err, res) {
        if (err) throw err;
        console.log('Weather data inserted!');
        db.close();
      });
    });
  })
  .catch(error => {
    console.log(error);
  });