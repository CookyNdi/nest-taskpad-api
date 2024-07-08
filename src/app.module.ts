import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [CommonModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
