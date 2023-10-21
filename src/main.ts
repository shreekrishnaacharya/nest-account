import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Account API")
    .setDescription("Account api using NestJS")
    .setVersion("2.0")
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    //   'access-token',
    //   )
    .addBearerAuth()
    .addSecurityRequirements("Bearer")
    // .addBearerAuth(undefined, 'defaultBearerAuth')
    // .addBearerAuth('Authorization', 'header')
    .build();
  const options = {
    swaggerOptions: {
      persistAuthorization: true,
      authAction: {
        defaultBearerAuth: {
          name: "defaultBearerAuth",
          schema: {
            description: "Default",
            type: "http",
            in: "header",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          value: "thisIsASampleBearerAuthToken123",
        },
      },
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, options);
  await app.listen(3000);
}
bootstrap();
