import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { BookingsModule } from './bookings/bookings.module';
import commonConfig from './config/common.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [commonConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    LocationsModule,
    BookingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
