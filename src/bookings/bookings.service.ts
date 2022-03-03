import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { datetimeStart, datetimeEnd, userId, locationId } = createBookingDto;
    const isAvailable = await this.isAvailable(
      locationId,
      datetimeStart,
      datetimeEnd,
    );
    if (!isAvailable) {
      throw new BadRequestException();
    }

    const booking = new Booking(datetimeStart, datetimeEnd, userId, locationId);

    await this.bookingsRepository.save(booking);
  }

  async update(updateBookingDto: UpdateBookingDto) {
    const { datetimeStart, datetimeEnd, userId, locationId, id } =
      updateBookingDto;
    const isAvailable = await this.isAvailable(
      locationId,
      datetimeStart,
      datetimeEnd,
    );

    if (!isAvailable) {
      throw new BadRequestException();
    }

    const booking = new Booking(
      datetimeStart,
      datetimeEnd,
      userId,
      locationId,
      id,
    );

    await this.bookingsRepository.save(booking);
  }

  findByUserId(userId: number) {
    return this.bookingsRepository.find({
      where: {
        userId,
      },
      relations: ['location'],
    });
  }

  findByDateRangeAndLocation(
    locationId: number,
    datetimeStart: Date,
    datetimeEnd: Date,
  ) {
    return this.bookingsRepository.find({
      where: {
        locationId,
        datetimeStart: Between(datetimeStart, datetimeEnd),
        datetimeEnd: Between(datetimeStart, datetimeEnd),
      },
      relations: ['location'],
    });
  }

  findOne(id: number) {
    return this.bookingsRepository.findOne({ id });
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    await this.bookingsRepository.remove(booking);
  }

  async isAvailable(
    locationId: number,
    datetimeStart: Date,
    datetimeEnd: Date,
  ) {
    return (
      // check for overlapping bookings
      (
        await this.bookingsRepository.find({
          where: {
            locationId,
            datetimeStart: LessThan(datetimeEnd),
            datetimeEnd: MoreThan(datetimeStart),
          },
        })
      ).length === 0
    );
  }
}
