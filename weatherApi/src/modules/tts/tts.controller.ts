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
import { url } from 'inspector';

@ApiTags('Weather')
@Controller('weather')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Get('/city')
  async getWeathere(@Query() q ): Promise<any> {
    console.log(q);
    // console.log(city);
    // console.log("lat === ", lat);
    // console.log("lon === ",lon);
    // console.log(units);
    return new Promise((resolve) => {
      const mongoose = require('mongoose');

      const Schema = mongoose.Schema;
      const weatherSchema = new Schema({
        coord:Object,
        weather: Array,
        base: String,
        main:Object,
        visibility: String,
        wind: Object,
        rain: Object,
        clouds: Object,
        dt: String,
        sys:Object,
        timezone:String,
        id:String,
        name:String,
        cod: String,
      });

      mongoose
        .connect('mongodb://localhost:27017/weatherApi', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(async () => {
          console.log('Connected to MongoDB');

          if (!mongoose.models['weathers']) {
            mongoose.model('weathers', weatherSchema);
          }
          // Find record
          // const regexCity = new RegExp(city, 'i');
          // if(q.city){
          //   const record = await mongoose.model('weathers').find({
          //       name: { $regex: q.city, $options: 'i' },
          //     // city : new RegExp("city"),
          //     // city : regexCity
          //   });
          //   console.log('record', record);
  
          //   if (record && Array.isArray(record) && record.length > 0) {
          //     resolve(record);
          //     // console.log("Find new data====")
          //     return;
          //   }
          // }
          
          let url;
          console.log('Find new data');
          if(q.city){
            url =  `https://api.openweathermap.org/data/2.5/weather?units=${q.units}&q=${q.city}&lat=${q.lat}&lon=${q.lon}&appid=1fa9ff4126d95b8db54f3897a208e91c`
          }
          else{
             url =  `https://api.openweathermap.org/data/2.5/weather?units=${q.units}&lat=${q.lat}&lon=${q.lon}&appid=1fa9ff4126d95b8db54f3897a208e91c`
          }

          // Lấy dữ liệu từ API OpenWeather
          
          axios
            .get( url
              // `https://api.openweathermap.org/data/2.5/weather?units=${q.units}&q=${q.city}&lat=${q.lat}&lon=${q.lon}&appid=1fa9ff4126d95b8db54f3897a208e91c`
              )
            .then((response) => {
              // Lưu dữ liệu vào MongoDB
              // if(!mongoose.models['weathers']){
              //    mongoose.model('weathers', weatherSchema );
              // }
              const Weather = mongoose.model('weathers');
              const weatherData = new Weather({

                coord:response.data.coord,
                weather: response.data.weather,
                base: response.data.base,
                main:response.data.main,
                visibility: response.data.visibility,
                wind: response.data.wind,
                rain: response.data.rain,
                clouds: response.data.clouds,
                dt: response.data.dt,
                sys:response.data.sys,
                timezone:response.data.timezone,
                id:response.data.id,
                name:response.data.name,
                cod: response.data.cod,
              });
              console.log(Weather);
              console.log('=======');
              console.log(weatherData);

                weatherData
                .save()
                .then(() => console.log('Data saved to MongoDB'))
                .catch((err) => console.log(err))
                .finally(() => mongoose.disconnect());

              resolve(response.data);
              

              
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    });

    // return ;
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

  // @Get('/location')
  // async getWeathereLocaltion(@Query() q): Promise<any> {
  //   // console.log(lat);
  //   // console.log(lon);
  //   // console.log(units);
  //   return new Promise((resolve) => {
  //     const mongoose = require('mongoose');

  //     const Schema = mongoose.Schema;
  //     const weatherSchema = new Schema({
  //       coord:Object,
  //       weather: Array,
  //       base: String,
  //       main:Object,
  //       visibility: String,
  //       wind: Object,
  //       rain: Object,
  //       clouds: Object,
  //       dt: String,
  //       sys:Object,
  //       timezone:String,
  //       id:String,
  //       name:String,
  //       cod: String,
  //     });

  //     mongoose
  //       .connect('mongodb://localhost:27017/weatherApi', {
  //         useNewUrlParser: true,
  //         useUnifiedTopology: true,
  //       })
  //       .then(async () => {
  //         console.log('Connected to MongoDB');

  //         if (!mongoose.models['weatherLocation']) {
  //           mongoose.model('weatherLocation', weatherSchema);
  //         }
  //         // Find record
  //         // const regexCity = new RegExp(city, 'i');
  //         // const record = await mongoose.model('weathers').find({
  //         //   city: { $regex: city, $options: 'i' },
  //         //   // city : new RegExp("city"),
  //         //   // city : regexCity
  //         // });
  //         // console.log('record', record);

  //         // if (record && Array.isArray(record) && record.length > 0) {
  //         //   resolve(record);
  //         //   // console.log("Find new data====")
  //         //   return;
  //         // }

  //         // console.log('Find new data');

  //         // Lấy dữ liệu từ API OpenWeather
  //         axios
  //           .get(
  //             `https://api.openweathermap.org/data/2.5/weather?lat=${q.lat}&lon=${q.lon}&units=${q.units}&appid=1fa9ff4126d95b8db54f3897a208e91c`
  //           )
  //           .then((response) => {
  //             // Lưu dữ liệu vào MongoDB
  //             // if(!mongoose.models['weathers']){
  //             //    mongoose.model('weathers', weatherSchema );
  //             // }
  //             const Weather = mongoose.model('weatherLocation');
  //             const weatherData = new Weather({

  //               coord:response.data.coord,
  //               weather: response.data.weather,
  //               base: response.data.base,
  //               main:response.data.main,
  //               visibility: response.data.visibility,
  //               wind: response.data.wind,
  //               rain: response.data.rain,
  //               clouds: response.data.clouds,
  //               dt: response.data.dt,
  //               sys:response.data.sys,
  //               timezone:response.data.timezone,
  //               id:response.data.id,
  //               name:response.data.name,
  //               cod: response.data.cod,
  //             });
  //             console.log(Weather);
  //             console.log('=======');
  //             console.log(weatherData);

  //             weatherData
  //               .save()
  //               .then(() => console.log('Data saved to MongoDB'))
  //               .catch((err) => console.log(err))
  //               .finally(() => mongoose.disconnect());

  //             resolve(response.data);
  //           })
  //           .catch((err) => console.log(err));
  //       })
  //       .catch((err) => console.log(err));
  //   });

  //   // return ;
  // }

  @Get('/des')
  async getDetail(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('exclude') exclude: string,
    @Query('units') units: string
  ): Promise<any> {
    return new Promise((resolve) => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const weatherDetailSchema = new Schema({
        lat:String,
        lon:String,
        timezone: String,
        timezone_offset:String,
        daily: Array,
        
      });
    mongoose
      .connect('mongodb://localhost:27017/weatherApi', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async() => {
        console.log('Connected to MongoDB');
        // Lưu dữ liệu vào MongoDB
        if (!mongoose.models['weatherdetails']) {
      
          mongoose.model('weatherdetails', weatherDetailSchema);
        }

        // Find record
        // const record = await mongoose.model('weatherdetails').find({
        //   lat: { $regex: lat, $options: 'i' },
        //   lon: { $regex: lon, $options: 'i' },
        // });
        // console.log('record', record);

        // if (record && Array.isArray(record) && record.length > 1) {
        //   resolve(record);
        //   // console.log("Find new data====")
        //   return;
        // }
        // console.log('Find new data');

        // Lấy dữ liệu từ API OpenWeather
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=1fa9ff4126d95b8db54f3897a208e91c`
          )
          .then((response) => {
            // if (!mongoose.models['weatherdetails']) {
            //   // Lưu dữ liệu vào MongoDB
            //   const Weather = mongoose.model('weatherdetails', weatherDetailSchema);
            // }
            const Weather = mongoose.model('weatherdetails');
            const weatherData = new Weather({
              lat:response.data.lat,
              lon:response.data.lon,
              timezone: response.data.timezone,
              timezone_offset:response.data.timezone_offset,
              daily: response.data.daily,
              
            });
            console.log(Weather);
            console.log('=======');
            console.log(weatherData);

            weatherData
              .save()
              .then(() => console.log('Data saved to MongoDB'))
              .catch((err) => console.log(err))
              .finally(() => mongoose.disconnect());
            resolve(response.data);  
          })
          
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    });
  }

}
