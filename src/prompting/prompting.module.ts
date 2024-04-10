import { Module } from '@nestjs/common';
import { PromptingController } from './prompting.controller';
import { PromptingService } from './prompting.service';

@Module({
  controllers: [PromptingController],
  providers: [PromptingService],
})
export class PromptingModule {}
