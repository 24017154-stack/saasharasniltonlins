import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.frontendUrl || true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Haras Nilton Lins API')
    .setDescription('API for Haras Nilton Lins SaaS Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.port;
  await app.listen(port);
  
  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
