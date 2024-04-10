import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptingModule } from './prompting/prompting.module';

@Module({
  imports: [PromptingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
