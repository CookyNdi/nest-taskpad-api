import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('Account Controller', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /api/account', () => {
    beforeEach(async () => {
      await testService.deleteAccount();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/account')
        .send({
          name: '',
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/account')
        .send({
          name: 'test',
          email: 'test@example.com',
          password: 'test123',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('test');
      expect(response.body.message).toBe('Confirmation email sent!');
    });

    it('should be rejected if email already registered!', async () => {
      await testService.createAccount();
      const response = await request(app.getHttpServer())
        .post('/api/account')
        .send({
          name: 'test',
          email: 'test@example.com',
          password: 'test123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/account/login', () => {
    beforeEach(async () => {
      await testService.deleteAccount();
      await testService.createAccount();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/account/login')
        .send({
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if email not registed or invalid password ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/account/login')
        .send({
          email: 'random@example.com',
          password: '12345678',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if email not verified', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/account/login')
        .send({
          email: 'test@example.com',
          password: 'test123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      await testService.updateEmailVerified();
      const response = await request(app.getHttpServer())
        .post('/api/account/login')
        .send({
          email: 'test@example.com',
          password: 'test123',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('test');
      expect(response.body.message).toBe('Login Successfully');
    });
  });

  describe('GET /api/account/current', () => {
    beforeEach(async () => {
      await testService.deleteAccount();
      await testService.createAccount();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/account/current')
        .set('Authorization', 'wrong');

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/account/current')
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('test');
    });
  });

  describe('PATCH /api/account/avatar', () => {
    beforeEach(async () => {
      await testService.deleteAccount();
      await testService.createAccount();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/account/avatar')
        .send({
          image_url: 'https://google.com',
        })
        .set('Authorization', 'test');

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/account/avatar')
        .send({
          image_url: 'https://google.com',
        })
        .set('Authorization', 'wrong');

      console.log(response);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update avatar', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/account/avatar')
        .send({
          image_url:
            'https://utfs.io/f/c374388f-5e3e-4d27-a598-30a3ceca9cba-rn2muq.jpg',
        })
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.image_url).toBe(
        'https://utfs.io/f/c374388f-5e3e-4d27-a598-30a3ceca9cba-rn2muq.jpg',
      );
    });
  });
});
