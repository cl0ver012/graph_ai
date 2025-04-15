import {
  Controller,
  Post,
  Get,
  Body,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GraphDataService } from './graphData.service';

@Controller('graphData')
export class GraphDataController {
  constructor(private readonly graphDataService: GraphDataService) {}

  @Post(':userId')
  async storeGraphData(
    @Body()
    body: {
      chatId: string;
      selectedProvider: string;
      chats: string;
    },
    @Param('userId') userId: string,
  ) {
    try {
      const endpoint = 'secret endpoint';
      const details = await this.graphDataService.generateDetails({
        chatHistory: body.chats,
      });

      const graphDataDto = {
        chatId: body.chatId,
        selectedProvider: body.selectedProvider,
        endpoint,
        userId,
        indexName: details.title,
        description: details.description,
        createdAt: new Date(),
      };

      return await this.graphDataService.saveGraphData(graphDataDto);
    } catch (error) {
      console.error('Controller Error storing Graph Data:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to store Graph Data',
      );
    }
  }

  @Get()
  async getAllGraphData() {
    try {
      return await this.graphDataService.getAllGraphData();
    } catch (error) {
      console.error('Controller Error fetching Graph Data:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch Graph Data',
      );
    }
  }

  @Get(':id')
  async getGraphData(@Param('id') id: string) {
    try {
      return await this.graphDataService.getGraphData(id);
    } catch (error) {
      console.error('Controller Error fetching Graph Data:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch Graph Data',
      );
    }
  }
}
