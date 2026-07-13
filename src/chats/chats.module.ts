/* src/chats/chats.module.ts: */
import { Module } from '@nestjs/common';
import { PrismaInteraccionesModule } from '../prisma-interacciones/prisma-interacciones.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [PrismaInteraccionesModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule { }