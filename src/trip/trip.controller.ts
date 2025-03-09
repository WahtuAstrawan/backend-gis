import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import {
  CreateTripRequest,
  TripResponse,
  UpdateTripRequest,
} from '../model/trip.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/trips')
export class TripController {
  constructor(private tripService: TripService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateTripRequest,
  ): Promise<WebResponse<TripResponse>> {
    const result = await this.tripService.create(user, request);

    return {
      data: result,
    };
  }

  @Get()
  async getAll(@Auth() user: User): Promise<WebResponse<TripResponse[]>> {
    const result = await this.tripService.getAll(user);

    return {
      data: result,
    };
  }

  @Get('/:id')
  async getOne(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<TripResponse>> {
    const result = await this.tripService.getOne(user, id);

    return {
      data: result,
    };
  }

  @Put('/:id')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateTripRequest,
  ): Promise<WebResponse<TripResponse>> {
    request.id = id;
    const result = await this.tripService.update(user, request);

    return {
      data: result,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  async delete(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<TripResponse>> {
    const result = await this.tripService.delete(user, id);

    return {
      data: result,
    };
  }
}
