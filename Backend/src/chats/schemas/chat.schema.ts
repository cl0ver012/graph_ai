import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  type: string; // Identifies who sent the message

  @Prop({ required: true })
  message: string; // Message content

  @Prop({ required: true })
  userId: string; // Message content

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema()
export class Chat {
  @Prop({ required: true, unique: true })
  chatId: string; // Unique chat session ID

  @Prop({ type: [Message], default: [] }) // Array of messages
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
