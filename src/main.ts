import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CheckModule } from './modules/check/check.module';
import { AuthModule } from './modules/auth/auth.module';
import { WinnerModule } from './modules/winner/winner.module';
import { StatusModule } from './modules/status/status.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  //swagger
  const config = new DocumentBuilder().setVersion('1.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config, { include: [AuthModule, CheckModule, WinnerModule, StatusModule] });

  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));
}
bootstrap();
