import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

describe('BookingsService', () => {
  const userId = 1;
  const locationId = 1;
  const id = 1;
  const booking = new Booking(new Date(), new Date(), userId, locationId, id);

  let service: BookingsService;
  let repository: Repository<Booking>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useClass: Repository },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    const createBookingDto = new CreateBookingDto({
      datetimeStart: new Date(),
      datetimeEnd: new Date(),
      userId,
      locationId,
    });

    it('should successfully create booking', async () => {
      jest.spyOn(repository, 'save').mockResolvedValueOnce(null);
      jest.spyOn(service, 'isAvailable').mockResolvedValueOnce(true);
      await service.create(createBookingDto);

      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestionException when current booking is not available', async () => {
      jest.spyOn(service, 'isAvailable').mockResolvedValueOnce(false);
      await expect(service.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByUserId()', () => {
    it('should return list of bookings belonging to the matching user id', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([booking]);
      expect(await service.findByUserId(userId)).toStrictEqual([booking]);
    });
  });

  describe('findByDateRangeAndLocation()', () => {
    it('should return list of bookings that has same locationId and is between stipulated time period', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([booking]);
      expect(
        await service.findByDateRangeAndLocation(
          locationId,
          new Date(),
          new Date(),
        ),
      ).toStrictEqual([booking]);
    });
  });

  describe('findOne()', () => {
    it('should return booking if matching booking id exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(booking);
      expect(await service.findOne(id)).toEqual(booking);
    });

    it('should return null if no matching booking id found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      expect(await service.findOne(id)).toEqual(null);
    });
  });

  describe('remove()', () => {
    it('should successfully delete booking by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(booking);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(null);

      await service.remove(id);

      expect(repository.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('isAvailable()', () => {
    it('should return true if there are no bookings at location during stipulated time period', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      expect(
        await service.isAvailable(locationId, new Date(), new Date()),
      ).toBe(true);
    });

    it('should return false if there are bookings at location during stipulated time period', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([booking]);
      expect(
        await service.isAvailable(locationId, new Date(), new Date()),
      ).toBe(false);
    });
  });
});
