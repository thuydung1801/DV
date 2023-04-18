import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TtsService } from './tts.service';
import { CreateTtDto } from './dto/create-tt.dto';
import { UpdateTtDto } from './dto/update-tt.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('TTS')
@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  async create(@Body() createTtDto: CreateTtDto) {
    return await this.ttsService.create(createTtDto);
  }

  @Get()
  async get(@Body() getTtDto: CreateTtDto) {
    return await this.ttsService.create(getTtDto);
  }
}


