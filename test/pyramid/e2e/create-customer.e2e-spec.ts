import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { configure } from '@/configure';
import { UnavailableCacheException } from '@/core/exceptions';
import { CacheRepository } from '@/core/repositories';
import { BadRequestErrors } from '@/core/types';
import { makeCustomerDto } from '@/test/mocks/customers/dto';

describe('CreateCustomer', () => {
  let app: INestApplication;
  let cacheRepository: CacheRepository;
  let toPromise;

  beforeAll(async () => {
    toPromise = jest
      .fn()
      .mockImplementation(() => ({ data: { active: true } }));
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue({ post: jest.fn().mockImplementation(() => ({ toPromise })) })
      .compile();
    app = moduleRef.createNestApplication(new FastifyAdapter());
    configure(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return UNAUTHORIZED(401) when Authorization Bearer is missing', async () => {
    const payload = makeCustomerDto();
    const { statusCode } = await request(app.getHttpServer())
      .post('/customers')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should return UNAUTHORIZED(401) when User is not authenticated', async () => {
    toPromise.mockImplementationOnce(() => ({ data: { active: false } }));
    const payload = makeCustomerDto();
    const { statusCode } = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should return BAD_GATEWAY(502) when cache is unavailable', async () => {
    jest.spyOn(cacheRepository, 'set').mockImplementationOnce(() => {
      throw new UnavailableCacheException();
    });
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return BAD_REQUEST(400) when name/document are empty', async () => {
    const payload = makeCustomerDto({ name: '', document: '' });
    const { body } = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    const badRequestErrors: BadRequestErrors = {
      errors: {
        document: {
          isNotEmpty: 'document should not be empty',
        },
        name: {
          isNotEmpty: 'name should not be empty',
        },
      },
    };
    expect(body).toStrictEqual(badRequestErrors);
  });

  it('should return CREATED(201) when name/document are filled correctly', async () => {
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.CREATED);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('document');
  });
});
