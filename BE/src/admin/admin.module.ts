import { Module } from '@nestjs/common';
import { AdminRestController } from './controller/admin-rest.controller';
import { AdminService } from './application/admin.service';
import { AuthModule } from '../auth/auth.module';
import { CustomTypeOrmModule } from '../config/typeorm/custom-typeorm.module';
import { AdminRepository } from './entities/admin.repository';
import { passwordEncoderProviderOptions } from './application/password-encoder';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([AdminRepository]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminRestController],
  providers: [AdminService, passwordEncoderProviderOptions],
})
export class AdminModule {}
