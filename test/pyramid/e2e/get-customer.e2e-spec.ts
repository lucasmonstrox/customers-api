import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UnavailableCacheException } from '@/core/exceptions';
import { CustomerNotFoundException } from '@/customers/exceptions';
import { GetCustomerRepository } from '@/customers/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';
import { AppModule } from '@/app.module';
import { Test } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { configure } from '@/configure';

describe('GetCustomer', () => {
  let app: INestApplication;
  let getCustomerRepository: GetCustomerRepository;
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
    getCustomerRepository = moduleRef.get<GetCustomerRepository>(
      GetCustomerRepository,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return UNAUTHORIZED(401) when Authorization Bearer is missing', async () => {
    const mockedCustomer = makeCustomer();
    const { statusCode } = await request(app.getHttpServer()).get(
      `/customers/${mockedCustomer.id}`,
    );
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should return UNAUTHORIZED(401) when User is not authenticated', async () => {
    const mockedCustomer = makeCustomer();
    toPromise.mockImplementationOnce(() => ({ data: { active: false } }));
    const { statusCode } = await request(app.getHttpServer())
      .get(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken');
    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should return NOT_FOUND(404) when Customer not found', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(getCustomerRepository, 'execute').mockResolvedValueOnce(null);
    const { body, statusCode } = await request(app.getHttpServer())
      .get(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken');
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(
      CustomerNotFoundException.makeMessage(mockedCustomer.id),
    );
  });

  it('should return BAD_GATEWAY(502) when cache is unavailable', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(getCustomerRepository, 'execute').mockImplementationOnce(() => {
      throw new UnavailableCacheException();
    });
    const { body, statusCode } = await request(app.getHttpServer())
      .get(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken');
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return BAD_GATEWAY(502) when sso is unavailable', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(getCustomerRepository, 'execute').mockImplementationOnce(() => {
      throw new UnavailableCacheException();
    });
    const { body, statusCode } = await request(app.getHttpServer())
      .get(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken');
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return OK(200) when fetching correct Customer', async () => {
    const mockedCustomer = makeCustomer();
    jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const { body, statusCode } = await request(app.getHttpServer())
      .get(`/customers/${mockedCustomer.id}`)
      .set('Authorization', 'Bearer mockedToken');
    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toEqual(mockedCustomer);
  });
});
