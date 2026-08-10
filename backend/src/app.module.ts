import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LeadsModule } from './leads/leads.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { FollowupsModule } from './followups/followups.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    LeadsModule,
    TasksModule,
    NotesModule,        // ✅ ADD
    FollowupsModule     // ✅ ADD
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}