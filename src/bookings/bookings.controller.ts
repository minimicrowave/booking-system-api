import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBookingDto: CreateBookingDto, @Res() res) {
    try {
      await this.bookingsService.create(createBookingDto);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).send();
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body() updateBookingDto, @Res() res) {
    try {
      await this.bookingsService.update(updateBookingDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).send();
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
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
