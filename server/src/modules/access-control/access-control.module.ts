import { Global, Module } from '@nestjs/common';

import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './access-control.service';
import { RoleGuard } from 'src/guards/role.guard';

@Global()
@Module({
	controllers: [AccessControlController],
	providers: [AccessControlService, RoleGuard],
	exports: [AccessControlService],
})
export class AccessControlModule {}
