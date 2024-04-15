import {
  Body,
  Controller,
  Get,
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

  @Post('preset-16')
  @UseInterceptors(FileInterceptor('image'))
  async getPrompting16(
    @Body('userPrompt') userPrompt: string,
    @Body('preset') preset: string,
    @Body('weight') weight: number,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const imageBuffer = await this.promptingService.imageToImageV16(
      userPrompt,
      preset,
      weight,
      image,
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', imageBuffer.length.toString());

    res.end(imageBuffer);
  }

  @Post('preset-XL')
  @UseInterceptors(FileInterceptor('image'))
  async getPromptingXL(
    @Body('userPrompt') userPrompt: string,
    @Body('preset') preset: string,
    @Body('weight') weight: number,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const imageBuffer = await this.promptingService.imageToImageXL(
      userPrompt,
      preset,
      weight,
      image,
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', imageBuffer.length.toString());

    res.end(imageBuffer);
  }

  @Post('inpaint')
  @UseInterceptors(FileInterceptor('image'))
  async getInpaintV2(
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body('userPrompt') userPrompt: string,
    @Body('preset') preset: string,
    @Body('outputFormat') outputFormat: string,
    @Body('negativePrompt') negativePrompt: string,
  ) {
    const imageBuffer = await this.promptingService.inpaintV2(
      image,
      userPrompt,
      preset,
      outputFormat,
      negativePrompt,
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', imageBuffer.length.toString());

    res.end(imageBuffer);
  }

  @Post('outpaint')
  @UseInterceptors(FileInterceptor('image'))
  async getOutpaintV2(
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body('userPrompt') userPrompt: string,
    @Body('preset') preset: string,
    @Body('outputFormat') outputFormat: string,
  ) {
    const imageBuffer = await this.promptingService.outpaint(
      image,
      userPrompt,
      preset,
      outputFormat,
    );

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', imageBuffer.length.toString());

    res.end(imageBuffer);
  }

  @Get('engines')
  async getEngines() {
    return await this.promptingService.getListOfEngines();
  }
}
