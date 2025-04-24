import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GraphData, GraphDataDocument } from './graphData.schema';
import OpenAI from 'openai';
import * as crypto from 'crypto';

@Injectable()
export class GraphDataService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  private algorithm = 'aes-256-cbc';
  private key: Buffer;
  constructor(
    @InjectModel('GraphData', 'graphDB')
    private graphDataModel: Model<GraphDataDocument>,
  ) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 32) {
      throw new Error(
        'ENCRYPTION_KEY must be set to a 32-character string in your environment.',
      );
    }
    this.key = Buffer.from(encryptionKey);
  }

  async saveGraphData(graphDataDto: {
    chatId: string;
    userId: string;
    selectedProvider: string;
    endpoint: string;
    indexName: string;
    description: string;
  }) {
    try {
      return await this.graphDataModel.findOneAndUpdate(
        { chatId: graphDataDto.chatId },
        { $set: graphDataDto },
        { upsert: true, new: true },
      );
    } catch (error) {
      console.error('Error saving Graph Data:', error);
      throw new InternalServerErrorException('Failed to save Graph Data');
    }
  }

  async getAllGraphData(data?: { userId: string }): Promise<GraphData[]> {
    try {
      if (data?.userId) {
        return await this.graphDataModel.find({ userId: data.userId }).exec();
      }
      return await this.graphDataModel.find().exec();
    } catch (error) {
      console.error('Service Error fetching Graph Data:', error);
      throw new InternalServerErrorException('Failed to fetch Graph Data');
    }
  }

  async getGraphData(id: string): Promise<GraphData | null> {
    try {
      return await this.graphDataModel.findById(id).exec();
    } catch (error) {
      console.error('Service Error fetching Graph Data:', error);
      throw new InternalServerErrorException('Failed to fetch Graph Data');
    }
  }

  async generateDetails(dto: { chatHistory: string }) {
    const { chatHistory } = dto;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
  You are an AI assistant tasked with generating a concise and relevant title and description from the purpose of subindex based on chat history. meaning base on the discussion in the chat history, you will generate a title and description for the subindex base on it purpose. The title should be a short phrase that captures the essence/purpose of the subindex, while the description should provide a brief overview of its content and purpose. The title and description should be clear, informative, and engaging to users.
  The title should be no more than 10 words, and the description should be 1-3 sentences long. The title and description should not deduce that its from a chat histories. The title and description should be relevant to the content of the subindex and should not contain any personal information or sensitive data.
  
  Your output MUST be a valid JSON object in the following format:
  
  {
    "title": "Generated title here",
    "description": "Generated description here"
  }
            `.trim(),
        },
        {
          role: 'user',
          content: `
  Here is the chat history used to create the index:
  
  ${chatHistory}
  
  Generate a suitable title and a 1–3 sentence description, following the format specified above.
            `.trim(),
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || '';

    try {
      const parsed = JSON.parse(content);
      if (parsed?.title && parsed?.description) {
        return parsed;
      }
    } catch (err) {
      console.warn('Invalid JSON from AI:', content);
    }

    throw new Error('AI response format invalid or empty');
  }

  encrypt(data: any): string {
    const json = JSON.stringify(data);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(json, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Prepend the IV (in hex) so it can be used for decryption.
    const token = iv.toString('hex') + ':' + encrypted;
    // Convert token to URL-safe Base64
    return Buffer.from(token).toString('base64url');
  }

  decrypt(token: string): any {
    // Decode from URL-safe Base64
    const tokenDecoded = Buffer.from(token, 'base64url').toString();
    const [ivHex, encryptedData] = tokenDecoded.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
