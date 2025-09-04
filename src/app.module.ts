import { configModule } from './config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/user-accounts/users.module';
import { NotificationModule } from './modules/notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/error-exception-filter';
import { ThrottlerModule } from '@nestjs/throttler';
import * as process from 'node:process';
import { CoreConfig } from './core/config/core.config';
import { ConfigModule } from './core/config/config.module';

console.log(process.env.MONGO_URI);
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          uri: coreConfig.getUri(),
        };
      },
      inject: [CoreConfig],
    }),
    configModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 5,
        },
      ],
    }),
    BloggersPlatformModule,
    TestingModule,
    UsersModule,
    NotificationModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [
    CoreConfig,
    AppService,
    { provide: APP_FILTER, useClass: DomainHttpExceptionsFilter },
  ],
})
export class AppModule {}
