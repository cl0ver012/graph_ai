import {
  Controller,
  Post,
  Get,
  Body,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { GraphDataService } from './graphData.service';
import axios from 'axios';

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
      const endpoint = this.graphDataService.encrypt(
        JSON.stringify({ userId, chatId: body.chatId }),
      );
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

  @Get('all/:userId')
  async getAllGraphData(
    @Param('userId') userId: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query() query?: Record<string, any>,
  ) {
    try {
      const { search: _, sortBy: __, sortOrder: ___, ...filters } = query || {};

      const data = {
        userId,
        search,
        filters,
        sortBy,
        sortOrder,
      };

      return await this.graphDataService.getAllGraphData(data);
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

  @Get('/rag/:secret')
  async handleGraphQuery(@Param('secret') secret: string) {
    try {
      const decrypted = this.graphDataService.decrypt(
        decodeURIComponent(secret),
      );
      const config = JSON.parse(decrypted);

      const response = await axios.post(
        'http://localhost:3000/api/rag',
        config,
      );

      return {
        status: 'success',
        result: response.data,
      };
    } catch (err: any) {
      console.error('Decryption or internal query failed:', err);
      throw new InternalServerErrorException(
        err.response?.data?.message || err.message || 'Invalid or expired link',
      );
    }
  }
}
