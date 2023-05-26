import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UnavailableCacheException } from '../../../src/cache/exceptions';
import { CacheRepository } from '../../../src/cache/repositories';
import { AppModule } from '../../../src/app.module';
import { configure } from '../../../src/configure';
import { makeCustomerDto } from '../../mocks/customers/dto/customer.dto';
import { makeCustomer } from '../../mocks/customers/models/customer.model';

// TODO: test unauthenticated requests
// TODO: test unavailable sso
describe('UpdateCustomer', () => {
  let app: INestApplication;
  let cacheRepository: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configure(app);
    await app.init();
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
  });

  it('should return BAD_REQUEST(400) when name/document are empty', async () => {
    const customer = makeCustomer();
    const payload = makeCustomerDto({ name: '', document: '' });
    const { body } = await request(app.getHttpServer())
      .put(`/customers/${customer.id}`)
      .send(payload);
    // TODO: add types
    const result = {
      name: {
        errors: {
          isNotEmpty: 'name should not be empty',
        },
      },
      document: {
        errors: {
          isNotEmpty: 'document should not be empty',
        },
      },
    };
    expect(body).toStrictEqual(result);
  });

  it('should return NOT_FOUND(404) when customer not found', async () => {
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce(null);
    const customer = makeCustomer();
    const payload = makeCustomerDto();
    const { statusCode } = await request(app.getHttpServer())
      .put(`/customers/${customer.id}`)
      .send(payload);
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('should return BAD_GATEWAY(502) when cache is unavailable fetching customer', async () => {
    const customer = makeCustomer();
    jest.spyOn(cacheRepository, 'get').mockImplementation(() => {
      throw new UnavailableCacheException();
    });
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .put(`/customers/${customer.id}`)
      .send(payload);
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(
      'Looks like cache is anavailable, please try again later',
    );
  });

  it('should return OK(200) when customer was successfully updated', async () => {
    const customer = makeCustomer();
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce(customer);
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .put(`/customers/${customer.id}`)
      .send(payload);
    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toHaveProperty('id', customer.id);
    expect(body).toHaveProperty('name', payload.name);
    expect(body).toHaveProperty('document', payload.document);
  });
});
