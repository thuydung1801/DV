import { Injectable } from '@nestjs/common';
import { CreateTtDto } from './dto/create-tt.dto';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import axios from 'axios';

@Injectable()
export class TtsService {
  async create(createTtDto: CreateTtDto) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.SPEECH_KEY,
      process.env.SPEECH_REGION
    );

    // get s3 presigned url
    const data = await axios
      .get(
        process.env.S3_SERVICE ||
          'http://localhost:4005/api/storage/upload-url',
        {
          params: {
            extension: `${createTtDto.id}.wav`,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      )
      .then((res) => res.data)
      .catch((err) => console.error(err));

    console.log(data);

    speechConfig.speechSynthesisVoiceName =
      createTtDto.void || 'vi-VN-HoaiMyNeural';
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    // return {
    //   file: data.path,
    // };

    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        createTtDto.text,
        async (result) => {
          console.log("result", result)
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const stream = result.audioData;

            await axios.put(data.signedUrl, stream, {
              headers: {
                'Content-Type': 'audio/wav',
              },
            });
            console.log('synthesis finished.', createTtDto);
            //  return {
            //    file: data.path,
            //  };
            resolve({
              file: data.path,
            });
          } else {
            console.log('synthesis failed.', createTtDto);
            reject({
              error: result.errorDetails,
            });
          }
          synthesizer.close();
        },
        (error) => {
          console.error(error);
          reject({
            error: error,
          });
          synthesizer.close();
        }
      );
    }).then((res) => res).catch((err) => err);
  }
}
