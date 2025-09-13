import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';

@Module({
	controllers: [NotificationController],
	providers: [NotificationService],
	imports: [TypeOrmModule.forFeature([Notification]), forwardRef(() => UserModule)],
	exports: [NotificationService],
})
export class NotificationModule {}
