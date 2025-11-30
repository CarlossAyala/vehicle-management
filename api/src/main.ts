import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { AuthInitMiddleware } from "./common/middleware/auth-init.middleware";
import { AppModule } from "./app.module";

async function bootstrap() {
  // TODO: config cors to just our frontend domain
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // TODO: set to true in production
      disableErrorMessages: false,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(AuthInitMiddleware);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
