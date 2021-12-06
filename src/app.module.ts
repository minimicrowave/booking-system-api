import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import commonConfig from './config/common.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [commonConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}