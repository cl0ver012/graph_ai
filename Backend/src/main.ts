import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (for mobile access)
  app.enableCors({
    origin: '*', // Allows requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, ngrok-skip-browser-warning',
  });
  

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my Nest.js backend')
    .setVersion('1.0')
    .addBearerAuth() // Enable Authorization Header in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000, '0.0.0.0'); // Listen on all network interfaces

}
bootstrap();
