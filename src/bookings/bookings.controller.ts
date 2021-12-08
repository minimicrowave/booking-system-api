import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto) {
    this.bookingsService.create(createBookingDto);
  }

  @Get('/users/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId') userId: number) {
    return this.bookingsService.findByUserId(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByDateRangeAndLocation(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('locationId') locationId: number,
  ) {
    if (!startDate || !endDate || !locationId) {
      throw new BadRequestException();
    }

    return this.bookingsService.findByDateRangeAndLocation(
      locationId,
      startDate,
      endDate,
    );
  }

  @Get('/is-available')
  @UseGuards(JwtAuthGuard)
  isAvailable(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('locationId') locationId: number,
  ) {
    if (!startDate || !endDate || !locationId) {
      throw new BadRequestException();
    }

    return this.bookingsService.isAvailable(locationId, startDate, endDate);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(id);
  }
}
