import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Chat', schema: ChatSchema }],
      'graphDB',
    ),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [MongooseModule],
})
export class ChatsModule {}
