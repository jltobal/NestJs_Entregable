import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from '../entities/notebook.entity';

describe('Integration con conexion ORM E2E', () => {
  let app: INestApplication;
  let repository: Repository<Notebook>;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    repository = moduleFixture.get<Repository<Notebook>>(
      getRepositoryToken(Notebook),
    );
  });

  //POST - Crea un id para el resto de los test
  it('/ POST', async () => {
    const response = await request(app.getHttpServer())
      .post('/notebooks')
      .send({ title: 'Lenovo', content: 'ThinkPad X270' })
      .expect(201);

    //Verifica la notebook creada
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Lenovo');
    createdId = response.body.id;
  });

  //GET
  it('/ GET', async () => {
    const response = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(200);

    //Verifica que no este vacio
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  //GET by ID - Busca el id creado en el test de POST
  it('/ GET by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notebooks/${createdId}`)
      .expect(200);

    //Verifica que el objeto sea el mismo creado anteriormente
    expect(response.body.id).toBe(createdId);
    expect(response.body.title).toBe('Lenovo');
  });

  //Edita el primer elemento creado con el POST
  it('/ PUT', async () => {
    const response = await request(app.getHttpServer())
      .put(`/notebooks/${createdId}`)
      .send({ title: 'HP', content: '445 G9 Ryzen' })
      .expect(200);

    //Valida por id y strings
    expect(response.body.id).toBe(createdId);
    expect(response.body.title).toBe('HP');
    expect(response.body.content).toBe('445 G9 Ryzen');
  });

  //Elimina el elmento creado en el POST
  it('/ DELETE', async () => {
    return request(app.getHttpServer())
      .delete(`/notebooks/${createdId}`)
      .expect(200);
  });
});
