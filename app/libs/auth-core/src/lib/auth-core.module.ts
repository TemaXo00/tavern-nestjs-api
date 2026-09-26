import { Module } from '@nestjs/common';
import { AuthCoreUtilsModule } from '@org/auth-core-utils';
import { SharedUtilsModule } from '@org/shared-utils';

import { AuthValidateService } from './auth-validate.service';

@Module({
  imports: [SharedUtilsModule, AuthCoreUtilsModule],
  providers: [AuthValidateService],
  exports: [AuthValidateService],
})
export class AuthCoreModule {}
