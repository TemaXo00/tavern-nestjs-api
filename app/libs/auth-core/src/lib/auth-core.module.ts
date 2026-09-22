import { Global, Module } from '@nestjs/common';
import { AuthUtilsModule } from '@org/auth-utils';
import { SharedUtilsModule } from '@org/shared-utils';

import { AuthValidateService } from './auth-validate.service';

@Global()
@Module({
  imports: [AuthUtilsModule, SharedUtilsModule],
  providers: [AuthValidateService],
  exports: [AuthValidateService],
})
export class AuthCoreModule {}
