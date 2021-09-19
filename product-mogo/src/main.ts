import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Product Service System')
    .setDescription('Product Service System')
    .setVersion('1.0.0')
    .addTag('integration')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
