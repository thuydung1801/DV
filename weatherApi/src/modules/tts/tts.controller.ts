import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TtsService } from './tts.service';
import { CreateTtDto } from './dto/create-tt.dto';
import { UpdateTtDto } from './dto/update-tt.dto';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { Exclude } from 'class-transformer';

@ApiTags('Weather')
@Controller('weather')

export class TtsController {
  constructor(private readonly ttsService: TtsService) {}
  
  @Get()
  async getWeathere(@Query('city') city: string): Promise<any> {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/weatherApi', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      
      
      // Lấy dữ liệu từ API OpenWeather
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0f6cf13778c3421d801a90ef93fae283`)
        .then(response => {

          // Lưu dữ liệu vào MongoDB
          const Weather = mongoose.model('weather-app', {
            details:String, 
            icon: String,
            lat:String,
            lon:String,
            temp: String,
            feels_like:String,
            temp_min:String, 
            temp_max:String, 
            humidity:String,
            city: String,
            dt:String,
            country:String, 
            sunrise:String, 
            sunset:String,
            weather:String,
            speed:String,
            
          });
  
          const weatherData = new Weather({
            details:response.data.weather[0].description, 
            icon:response.data.weather[0].icon,
            lat:response.data.coord.lat,
            lon:response.data.coord.lon,
            temp: response.data.main.temp,
            feels_like:response.data.main.feels_like,
            temp_min:response.data.main.temp_min, 
            temp_max:response.data.main.temp_max, 
            humidity:response.data.main.humidity,
            city: response.data.name,
            dt:response.data.dt,
            country:response.data.sys.country, 
            sunrise:response.data.sys.sunrise, 
            sunset:response.data.sys.sunset,
            weather:response.data.weather,
            speed:response.data.wind.speed,
            
          });
         
          weatherData.save()
            .then(() => console.log('Data saved to MongoDB'))
            .catch(err => console.log(err))
            .finally(() => mongoose.disconnect());
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

  }


// @Get('/weather')
// async getWeather(@Query('city') city: string): Promise<any> {
//   try {
//     // Gửi yêu cầu lấy dữ liệu từ OpenWeather API
//     const response = await axios.get(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0f6cf13778c3421d801a90ef93fae283`,
//     );
//     const weatherData = response.data;
//     const {MongoClient} = require('mongodb');
//     // Kết nối đến MongoDB và lưu dữ liệu vào collection 'weather'
//     const client = await MongoClient.connect('mongodb://localhost:27017', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     const db = client.db('weatherApi');
//     const collection = db.collection('weather');
//     await collection.insertOne(weatherData);

//     // Đóng kết nối đến MongoDB
//     await client.close();

//     return weatherData;
//   } catch (error) {
//     console.log(error);
//     // throw new InternalServerErrorException();
//   }
// }

  // @Get('/des')
  // async getWeatherDetail(@Query('lat') lat: string, @Query('lon') lon: string, @Query('exclude') exclude: string,@Query('units') units: string): Promise<any> {
  //   console.log(lat);
  //   console.log(lon);
  //   try {
  //   let dt = await axios .get(
  //     `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=1fa9ff4126d95b8db54f3897a208e91c`
  //      ) .then((res) => res.data);
  //   const weatherData = dt.data;
  //   const {MongoClient} = require('mongodb');
  //      // Kết nối đến MongoDB và lưu dữ liệu vào collection 'weather'
  //   const client = await MongoClient.connect('mongodb://localhost:27017', {
  //        useNewUrlParser: true,
  //        useUnifiedTopology: true,
  //      });
  //   const db = client.db('weatherApi');
  //   const collection = db.collection('weather');
  //   await collection.insertOne(weatherData);
   
  //      // Đóng kết nối đến MongoDB
  //   await client.close();
   
  //   return weatherData;
  // } catch (error) {
  //   console.log(error);
  //   // throw new InternalServerErrorException();
  // }
  // }

  @Get('/des')
  async getDetail(@Query('lat') lat: string, @Query('lon') lon: string, @Query('exclude') exclude: string,@Query('units') units: string): Promise<any> {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/weatherApi', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      
      // Lấy dữ liệu từ API OpenWeather
      axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=1fa9ff4126d95b8db54f3897a208e91c`
      )
        .then(response => {

          // Lưu dữ liệu vào MongoDB
          const Weather = mongoose.model('weatherDetail', {
            timezone:String, 
            daily: Array,
            hourly:Array,
            
          });
  
          const weatherData = new Weather({
            timezone:response.data.timezone, 
            daily: response.data.daily,
            hourly:response.data.daily,
            
          });
         
          weatherData.save()
            .then(() => console.log('Data saved to MongoDB'))
            .catch(err => console.log(err))
            .finally(() => mongoose.disconnect());
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

  }
}


