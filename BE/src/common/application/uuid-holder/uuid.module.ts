import { Global, Module } from '@nestjs/common';
import { UuidHolder } from './uuid-holder';
import { DefaultUuidHolder } from './default-uuid-holder';

@Global()
@Module({
  providers: [
    {
      provide: UuidHolder,
      useClass: DefaultUuidHolder,
    },
  ],
  exports: [UuidHolder],
})
export class UuidHolderModule {}
