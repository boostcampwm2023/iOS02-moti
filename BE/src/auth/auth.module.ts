import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './application/auth.service';
import { OauthHandler } from './application/oauth-handler';
import { OauthRequester } from './application/oauth-requester';
import { JwtUtils } from './application/jwt-utils';
import { UserRepository } from '../users/entities/user.repository';
import { UserCodeGenerator } from './application/user-code-generator';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OauthHandler,
    OauthRequester,
    JwtUtils,
    UserCodeGenerator,
  ],
})
export class AuthModule {}
