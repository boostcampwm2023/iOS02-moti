import { forwardRef, Global, Module } from '@nestjs/common';
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
import { UsersModule } from '../users/users.module';
import { AccessTokenGuard } from './guard/access-token.guard';

@Global()
@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OauthHandler,
    OauthRequester,
    JwtUtils,
    UserCodeGenerator,
    AccessTokenGuard,
  ],
  exports: [JwtUtils, AccessTokenGuard],
})
export class AuthModule {}
