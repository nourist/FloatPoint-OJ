import { Controller } from '@nestjs/common';

import { AccessControlService } from './access-control.service';

@Controller('access-control')
export class AccessControlController {
	constructor(private readonly accessControlService: AccessControlService) {}
}
