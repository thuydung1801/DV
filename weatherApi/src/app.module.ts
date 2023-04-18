import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'src/common/configs/config';
import { TtsModule } from './modules/tts/tts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TtsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
