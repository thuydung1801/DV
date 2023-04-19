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

@ApiTags('Weather')
@Controller('weather')
export class TtsController {

  constructor(private readonly ttsService: TtsService) {}

  @Get()
  async getWeather(@Query() q) {
    const {MongoClient} = require('mongodb');
   console.log(q);
   let dt = await axios
   .get(
    `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=0f6cf13778c3421d801a90ef93fae283`
   )
   .then((res) => res.data);

   const uri = 'mongodb://localhost:27017/';
   const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true})
   await client.connect();
   const database =  client.db('weather')
   const collection = database.collection('weather-app')
   await collection.insertOne(dt)
   const result = await collection.find().toArray();

   await client.close()
   return result

   


  }
//   @Get()
// async getWeather(@Query() q) {
//   console.log(q);
//   const apiKey = '0f6cf13778c3421d801a90ef93fae283';
//   const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}`;

//   try {
//     const response = await axios.get(apiUrl);
//     const weatherData = response.data;

//     // Save weatherData to MongoDB
//     await WeatherModel.create(weatherData);

//     // Return the weather data
//     return weatherData;
//   } catch (error) {
//     console.error(error);
//     throw new InternalServerErrorException('Error fetching weather data');
//   }
// }

  @Get('/des')
  async getWeatherDetail(@Query() q) {
    console.log(q);
   let dt = await axios
   .get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${q.lat}&lon=${q.lon}&exclude=${q.exclude}&appid=0f6cf13778c3421d801a90ef93fae283&units=${q.units}`
   )
   .then((res) => res.data);

   return;
  }
}

