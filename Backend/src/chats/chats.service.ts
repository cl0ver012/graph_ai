import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name, 'graphDB') // Explicitly use 'graphDB'
    private chatModel: Model<ChatDocument>,
  ) {}

  async addMessage(
    chatId: string,
    type: string,
    message: string,
    userId: string,
  ): Promise<Chat> {
    return this.chatModel.findOneAndUpdate(
      { chatId },
      { $push: { messages: { type, message, timestamp: new Date(), userId } } },
      { new: true, upsert: true },
    );
  }

  async getConversation(chatId: string): Promise<Chat | null> {
    return this.chatModel.findOne({ chatId }).exec();
  }

  async getAllChats(userId: string) {
    return this.chatModel
      .find({
        'messages.userId': userId,
      })
      .exec();
  }

  async deleteChat(chatId: string): Promise<{ message: string }> {
    const result = await this.chatModel.deleteOne({ chatId }).exec();
    if (result.deletedCount === 0) {
      return { message: `Chat with ID ${chatId} not found.` };
    }
    return { message: `Chat with ID ${chatId} deleted successfully.` };
  }
}
