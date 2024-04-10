import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Preset } from './presets';
import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
@Injectable()
export class PromptingService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create();
  }

  async generateImage(
    userPrompt: string,
    preset: string,
    weight: number,
    image: Express.Multer.File,
  ) {
    const chosenPreset = this.handlePreset(preset);

    const promptToSend = `${userPrompt} ${chosenPreset}`;
    console.log(promptToSend);
    if (!image) {
      throw new HttpException('Image is not embedded', HttpStatus.BAD_REQUEST);
    }

    const formData = new FormData();
    formData.append('text_prompts[0][text]', promptToSend);
    formData.append('text_prompts[0][weight]', weight);
    formData.append('init_image', image.buffer, {
      filename: image.originalname,
    });
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', 0.1); // 0.1 is good
    formData.append('cfg_scale', 14); // 14 is good
    formData.append('clip_guidance_preset', 'SIMPLE'); // SIMPLE is good
    formData.append('samples', 1);
    formData.append('seed', 0);
    formData.append('steps', 33); // 33 is good
    console.log('Sending request...');

    try {
      const response = await this.axiosInstance.postForm(
        'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/image-to-image',
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + process.env.API_KEY,
            Accept: 'image/png',
            ...formData.getHeaders(),
          },
          responseType: 'arraybuffer',
        },
      );

      console.log('Response received');

      const filename = 'response' + '-' + uuid() + '.png';
      await this.saveImage(response.data, filename);

      // transform arraybuffer to image

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data.toString());
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request error:', error.message);
      }

      throw new HttpException(
        'Failed to generate image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  handlePreset(preset: string): string {
    switch (preset) {
      case 'cartoon':
        return (preset = Preset.CARTOON);
      default: {
        throw new HttpException('Preset not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  private async saveImage(imageData: ArrayBuffer, filename: string) {
    try {
      const filePath = `./generated/${filename}`;
      const imageBuffer = Buffer.from(imageData);
      await fs.promises.writeFile(filePath, imageBuffer);
    } catch (error) {
      throw new Error('Failed to save image: ' + error);
    }
  }
}
