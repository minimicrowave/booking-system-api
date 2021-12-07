import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    this.bookingsService.create(createBookingDto);
  }

  @Get('/users/:userId')
  findByUserId(@Param('userId') userId: number) {
    return this.bookingsService.findByUserId(userId);
  }

  @Get()
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
  findOne(@Param('id') id: number) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingsService.remove(id);
  }
}
