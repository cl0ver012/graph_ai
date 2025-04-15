import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GraphDataDocument = GraphData & Document;

@Schema()
export class GraphData {
  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  selectedProvider: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  indexName: string;
}

export const GraphDataSchema = SchemaFactory.createForClass(GraphData);
