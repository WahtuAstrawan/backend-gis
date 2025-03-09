import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Trip, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateTripRequest,
  TripResponse,
  UpdateTripRequest,
} from '../model/trip.model';
import { TripValidation } from './trip.validation';
import { Logger } from 'winston';

@Injectable()
export class TripService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  private toTripResponse(trip: Trip): TripResponse {
    return {
      id: trip.id,
      title: trip.title,
      description: trip.description,
      latitude: trip.latitude,
      longitude: trip.longitude,
    };
  }

  async create(user: User, request: CreateTripRequest): Promise<TripResponse> {
    this.logger.debug(`Create new trip ${JSON.stringify(request)}`);

    const createRequest: CreateTripRequest = this.validationService.validate(
      TripValidation.CREATE,
      request,
    );

    const trip = await this.prismaService.trip.create({
      data: {
        ...createRequest,
        ...{
          username: user.username,
        },
      },
    });

    return this.toTripResponse(trip);
  }

  async getAll(user: User): Promise<TripResponse[]> {
    this.logger.debug(`Get all user trips`);

    const trips = await this.prismaService.trip.findMany({
      where: {
        username: user.username,
      },
    });

    if (!trips) {
      throw new NotFoundException('Trips not found');
    }

    return trips.map((trip) => this.toTripResponse(trip));
  }

  async getOne(user: User, id: number): Promise<TripResponse> {
    this.logger.debug(`Get a user trip`);

    const trip = await this.prismaService.trip.findFirst({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return this.toTripResponse(trip);
  }

  async update(user: User, request: UpdateTripRequest): Promise<TripResponse> {
    this.logger.debug(`Update trip ${JSON.stringify(request)}`);

    const updateRequest: UpdateTripRequest = this.validationService.validate(
      TripValidation.UPDATE,
      request,
    );

    const isTripExists = await this.prismaService.trip.findFirst({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
    });

    if (!isTripExists) {
      throw new NotFoundException('Trip not found');
    }

    const trip = await this.prismaService.trip.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: updateRequest,
    });

    return this.toTripResponse(trip);
  }

  async delete(user: User, id: number): Promise<TripResponse> {
    const isTripExists = await this.prismaService.trip.findFirst({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (!isTripExists) {
      throw new NotFoundException('Trip not found');
    }

    const trip = await this.prismaService.trip.delete({
      where: {
        id: id,
        username: user.username,
      },
    });

    return this.toTripResponse(trip);
  }
}
