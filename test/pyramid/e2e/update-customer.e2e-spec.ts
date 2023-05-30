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
import { CustomerNotFoundException } from '@/customers/exceptions';
import { makeCustomerDto } from '@/test/mocks/customers/dto';
import { makeCustomer } from '@/test/mocks/customers/models';

// TODO: add id conflict test
// TODO: test unavailable sso
describe('UpdateCustomer', () => {
  let app: INestApplication;
  let cacheRepository: CacheRepository;
  // TODO: add types
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
    const mockedCustomer = makeCustomer();
    const payload = makeCustomerDto();
    const { statusCode } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .send(payload);
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should return UNAUTHORIZED(401) when User is not authenticated', async () => {
    toPromise.mockImplementationOnce(() => ({ data: { active: false } }));
    const mockedCustomer = makeCustomer();
    const payload = makeCustomerDto();
    const { statusCode } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should return BAD_GATEWAY(502) when cache is unavailable fetching customer', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(cacheRepository, 'get').mockImplementationOnce(() => {
      throw new UnavailableCacheException();
    });
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return BAD_GATEWAY(502) when cache is unavailable setting new customer data', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce(mockedCustomer);
    jest.spyOn(cacheRepository, 'set').mockImplementationOnce(() => {
      throw new UnavailableCacheException();
    });
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return NOT_FOUND(404) when customer not found', async () => {
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce(null);
    const mockedCustomer = makeCustomer();
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(
      CustomerNotFoundException.makeMessage(mockedCustomer.id),
    );
  });

  it('should return BAD_REQUEST(400) when name/document are empty', async () => {
    const mockedCustomer = makeCustomer();
    const payload = makeCustomerDto({ id: '', name: '', document: '' });
    const { body } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    const badRequestErrors: BadRequestErrors = {
      errors: {
        id: {
          isUuid: 'id must be a UUID',
        },
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

  it('should return OK(200) when customer was successfully updated', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce(mockedCustomer);
    jest.spyOn(cacheRepository, 'set');
    const payload = makeCustomerDto({ id: mockedCustomer.id });
    const { body, statusCode } = await request(app.getHttpServer())
      .put(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toHaveProperty('id', mockedCustomer.id);
    expect(body).toHaveProperty('name', payload.name);
    expect(body).toHaveProperty('document', payload.document);
  });
});
