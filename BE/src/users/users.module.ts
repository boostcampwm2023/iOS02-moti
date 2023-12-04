import { forwardRef, Global, Module } from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { UsersService } from './application/users.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controller/users.controller';
import { UserBlockedUserRepository } from './entities/user-blocked-user.repository';

@Global()
@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      UserRepository,
      UserBlockedUserRepository,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
