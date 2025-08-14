import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/users/users.module';
import { NotificationModule } from './modules/notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/error-exception-filter';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/blogPlatform'),
    BloggersPlatformModule,
    TestingModule,
    UsersModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainHttpExceptionsFilter },
  ],
})
export class AppModule {}
