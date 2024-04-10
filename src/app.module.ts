import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptingModule } from './prompting/prompting.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PromptingModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
