import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
