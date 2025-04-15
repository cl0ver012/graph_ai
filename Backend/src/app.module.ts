import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import { GraphDataModule } from './graph-data/graphData.module';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://emmanuelakwuba57:cfaxhgu5GSVBkAtu@emirace.zci1zhz.mongodb.net/graphDB?retryWrites=true&w=majority&appName=Emirace',
      {
        connectionName: 'graphDB', // Named connection for graph data
      },
    ),
    GraphDataModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
