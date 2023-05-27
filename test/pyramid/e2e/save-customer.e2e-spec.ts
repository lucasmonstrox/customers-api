import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UnavailableCacheException } from '../../../src/cache/exceptions';
import { CacheRepository } from '../../../src/cache/repositories';
import { AppModule } from '../../../src/app.module';
import { configure } from '../../../src/configure';
import { makeCustomerDto } from '../../mocks/customers/dto';

// TODO: test unauthenticated requests
// TODO: test unavailable sso
describe('SaveCustomer', () => {
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

  afterAll(async () => {
    await app.close();
  });

  it('should return BAD_GATEWAY(502) when cache is unavailable', async () => {
    jest.spyOn(cacheRepository, 'set').mockImplementationOnce(() => {
      throw new UnavailableCacheException();
    });
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/customers')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.BAD_GATEWAY);
    expect(body.message).toBe(UnavailableCacheException.message);
  });

  it('should return BAD_REQUEST(400) when name/document are empty', async () => {
    const payload = makeCustomerDto({ name: '', document: '' });
    const { body } = await request(app.getHttpServer())
      .post('/customers')
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

  it('should return CREATED(201) when name/document are filled correctly', async () => {
    const payload = makeCustomerDto();
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/customers')
      .send(payload);
    expect(statusCode).toBe(HttpStatus.CREATED);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('document');
  });
});
