import { Module } from '@nestjs/common';
import { FollowupsService } from './followups.service';
import { FollowupsController } from './followups.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],   // ✅ bas ye hi chahiye
  controllers: [FollowupsController],
  providers: [FollowupsService],
})
export class FollowupsModule {}