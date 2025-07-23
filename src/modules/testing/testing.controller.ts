import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectConnection() private readonly dataBaseConnection: Connection,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const collections = await this.dataBaseConnection.listCollections();

    const promises = collections.map((collection) =>
      this.dataBaseConnection.collection(collection.name).deleteMany(),
    );

    await Promise.all(promises);
    return {
      status: 'succeed',
    };
  }
}
