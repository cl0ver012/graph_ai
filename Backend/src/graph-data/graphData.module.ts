import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphDataService } from './graphData.service';
import { GraphDataController } from './graphData.controller';
import { GraphDataSchema } from './graphData.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'GraphData', schema: GraphDataSchema }],
      'graphDB',
    ),
  ],
  controllers: [GraphDataController],
  providers: [GraphDataService],
  exports: [GraphDataService], // ✅ Export service if needed in another module
})
export class GraphDataModule {}
