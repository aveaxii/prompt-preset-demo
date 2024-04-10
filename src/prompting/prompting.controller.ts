import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PromptingService } from './prompting.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('prompting')
export class PromptingController {
  constructor(private readonly promptingService: PromptingService) {}

  @Post('preset')
  @UseInterceptors(FileInterceptor('image'))
  async getPrompting(
    @Body('userPrompt') userPrompt: string,
    @Body('preset') preset: string,
    @Body('weight') weight: number,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const imageBuffer = await this.promptingService.generateImage(
      userPrompt,
      preset,
      weight,
      image,
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', imageBuffer.length.toString());

    res.end(imageBuffer);
  }
}
