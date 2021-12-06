import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const location = new Location(createLocationDto.name);
    await this.locationsRepository.save(location);
  }

  findAll() {
    return this.locationsRepository.find();
  }

  findOne(id: number) {
    return this.locationsRepository.findOne(id);
  }

  async update(updateLocationDto: UpdateLocationDto) {
    const { id, name } = updateLocationDto;
    const location = new Location(name, id);

    await this.locationsRepository.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    await this.locationsRepository.remove(location);
  }
}
