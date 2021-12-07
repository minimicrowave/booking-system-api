import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { LocationsService } from './locations.service';

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: Repository<Location>;

  const name = 'name';
  const id = 1;
  const location = new Location(name, id);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: getRepositoryToken(Location), useClass: Repository },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully save new location', async () => {
      const createLocationDto = new CreateLocationDto({ name });
      jest.spyOn(repository, 'save').mockResolvedValueOnce(null);

      await service.create(createLocationDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll()', () => {
    it('should return a list of locations', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([location]);
      expect(await service.findAll()).toStrictEqual([location]);
    });
  });

  describe('findOne()', () => {
    it('should return location if matching location id exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(location);
      expect(await service.findOne(id)).toEqual(location);
    });

    it('should return null if no matching location id found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      expect(await service.findOne(id)).toEqual(null);
    });
  });

  describe('update()', () => {
    it('should successfully update location details', async () => {
      const updateLocationDto = new UpdateLocationDto({ id, name });
      jest.spyOn(repository, 'save').mockReturnValueOnce(null);
      await service.update(updateLocationDto);

      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove()', () => {
    it('should successfully delete location by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(location);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(null);

      await service.remove(id);

      expect(repository.remove).toHaveBeenCalledTimes(1);
    });
  });
});
