import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('TripController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/trips', () => {
    beforeEach(async () => {
      await testService.deleteTrips();
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'test')
        .send({
          title: '',
          description: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create trip', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/trips')
        .set('Authorization', 'test')
        .send({
          title: 'test',
          description: 'test',
          latitude: 69.123,
          longitude: 69.321,
          username: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('test');
      expect(response.body.data.description).toBe('test');
    });
  });

  describe('GET /api/trips', () => {
    beforeEach(async () => {
      await testService.deleteTrips();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createTrips();
    });

    it('should be not found if id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/trips/6969')
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get trip', async () => {
      const trip = await testService.getTrip();
      const response = await request(app.getHttpServer())
        .get(`/api/trips/${trip.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('test');
      expect(response.body.data.description).toBe('test');
    });

    it('should be able to get trips', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/trips')
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[1].title).toBe('test');
      expect(response.body.data[2].description).toBe('test');
    });
  });

  describe('PUT /api/trips/:id', () => {
    beforeEach(async () => {
      await testService.deleteTrips();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createTrips();
    });

    it('should be rejected if request is invalid', async () => {
      const trip = await testService.getTrip();
      const response = await request(app.getHttpServer())
        .put(`/api/trips/${trip.id}`)
        .set('Authorization', 'test')
        .send({
          title: '',
          description: '',
        });
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update trip', async () => {
      const trip = await testService.getTrip();
      const response = await request(app.getHttpServer())
        .put(`/api/trips/${trip.id}`)
        .set('Authorization', 'test')
        .send({
          title: 'updated',
          description: 'updated',
          latitude: 69.123,
          longitude: 69.321,
          username: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('updated');
      expect(response.body.data.description).toBe('updated');
    });

    it('should not be able to update trip if trip not exists', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/trips/9999999`)
        .set('Authorization', 'test')
        .send({
          title: 'updated',
          description: 'updated',
          latitude: 69.123,
          longitude: 69.321,
          username: 'test',
        });

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/trips/:id', () => {
    beforeEach(async () => {
      await testService.deleteTrips();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createTrips();
    });

    it('should be able to delete trip', async () => {
      const trip = await testService.getTrip();
      const response = await request(app.getHttpServer())
        .delete(`/api/trips/${trip.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeTruthy();
    });

    it('should not be able to delete trip if trip not exists', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/trips/9999999`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });
});
