import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { GraphDataModule } from './graph-data/graphData.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CHATS_URI || 'mongodb://localhost:27017/chats', {
      connectionName: 'chatsDB',
    }),
    MongooseModule.forRoot(process.env.MONGODB_GRAPH_URI || 'mongodb://localhost:27017/Graph-Index', {
      connectionName: 'graphDB',
    }),
    ChatsModule,
    GraphDataModule
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('MONGODB URIs:', {
      chats: process.env.MONGODB_CHATS_URI,
      graph: process.env.MONGODB_GRAPH_URI
    });
  }
}
