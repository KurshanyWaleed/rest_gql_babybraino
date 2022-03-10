import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  await app.listen(app.get(ConfigService).get("PORT"), "0.0.0.0");

  console.log(`Application's baseUrl:
   ==> http://localhost:${app.get(ConfigService).get("PORT")}/`);
  console.log();
}
bootstrap();
