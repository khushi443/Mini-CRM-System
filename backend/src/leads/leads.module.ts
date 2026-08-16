import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],   // 👈 ye add karna zaroori hai
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}