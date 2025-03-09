import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Trip } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany();
  }

  async deleteTrips() {
    await this.prismaService.trip.deleteMany();
  }

  async createUser() {
    await this.prismaService.user.upsert({
      where: {
        username: 'test',
      },
      update: {
        token: 'test',
      },
      create: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async getTrip(): Promise<Trip> {
    const trip = await this.prismaService.trip.findFirst({
      where: {
        username: 'test',
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async createTrips() {
    await this.prismaService.trip.createMany({
      data: [
        {
          title: 'test',
          description: 'test',
          latitude: 69,
          longitude: 69,
          username: 'test',
        },
        {
          title: 'test',
          description: 'test',
          latitude: 69,
          longitude: 69,
          username: 'test',
        },
        {
          title: 'test',
          description: 'test',
          latitude: 69,
          longitude: 69,
          username: 'test',
        },
      ],
    });
  }
}
