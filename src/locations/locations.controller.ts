import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationService: LocationsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(+id);
  }

  @Put()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  update(@Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(updateLocationDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.locationService.remove(id);
  }
}
