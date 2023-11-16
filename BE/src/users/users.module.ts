import { forwardRef, Global, Module } from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { UsersService } from './application/users.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([UserRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
