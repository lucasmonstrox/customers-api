import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { configure } from '@/configure';
import { UnavailableCacheException } from '@/cache/exceptions';
import { CustomerNotFoundException } from '@/customers/exceptions';
import { GetCustomerRepository } from '@/customers/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';

// TODO: test unauthenticated requests
// TODO: test unavailable sso
describe('GetCustomer', () => {
  let app: INestApplication;
  let getCustomerRepository: GetCustomerRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configure(app);
    await app.init();
    getCustomerRepository = moduleRef.get<GetCustomerRepository>(
      GetCustomerRepository,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return NOT_FOUND(404) when customer not found', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(getCustomerRepository, 'execute').mockResolvedValueOnce(null);
    const { body, statusCode } = await request(app.getHttpServer()).get(
      `/customers/${mockedCustomer.id}`,
    );
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
    const { body, statusCode } = await request(app.getHttpServer()).get(
      `/customers/${mockedCustomer.id}`,
    );
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return OK(200) when fetching correct customer', async () => {
    const mockedCustomer = makeCustomer();
    jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const { body, statusCode } = await request(app.getHttpServer()).get(
      `/customers/${mockedCustomer.id}`,
    );
    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toEqual(mockedCustomer);
  });
});
