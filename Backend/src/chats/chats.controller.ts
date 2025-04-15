import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // Store a new message inside the same conversation record
  @Post(':userId')
  async addMessage(
    @Body() body: { chatId: string; type: string; message: string },
    @Param('userId') userId: string,
  ) {
    return this.chatsService.addMessage(
      body.chatId,
      body.type,
      body.message,
      userId,
    );
  }

  // Retrieve full conversation history for a specific chatId
  @Get(':chatId')
  async getConversation(@Param('chatId') chatId: string) {
    return this.chatsService.getConversation(chatId);
  }

  // Retrieve all chat conversations
  @Get('user/:userId')
  async getAllChats(@Param('userId') userId: string) {
    return this.chatsService.getAllChats(userId);
  }

  // **Delete chat by chatId**
  @Delete(':chatId')
  async deleteChat(@Param('chatId') chatId: string) {
    return this.chatsService.deleteChat(chatId);
  }
}
