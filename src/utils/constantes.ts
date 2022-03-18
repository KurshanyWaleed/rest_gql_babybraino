import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { Transport } from "@nestjs/microservices";

export const USER_HAS_BEEN_DELETED = "USER_HAS_BEEN_DELETED";
export const NEW_INSCRIPTION = "NEW_INSCRIPTION";
export const MAIN_QUEUE = "MAIN_QUEUE";
export const USER_SERVICES = "USER_SERVICES";
export const option = [
  {
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      name: USER_SERVICES,
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>("RQ_SERVER")],
        queue: MAIN_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    }),
  },
];
