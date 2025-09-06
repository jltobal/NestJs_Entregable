import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { response } from 'express';

describe('Controller E2E Test', () => {
  let app: INestApplication;
  let createdId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //POST E2E - Crea un id para el resto de los test
  it('E2E / POST', async () => {
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
  it('E2E / GET', async () => {
    const response = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(200);

    //Verifica que no este vacio
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  //GET by ID - Busca el id creado en el test de POST
  it('E2E / GET by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notebooks/${createdId}`)
      .expect(200);

    //Verifica que el objeto sea el mismo creado anteriormente
    expect(response.body.id).toBe(createdId);
    expect(response.body.title).toBe('Lenovo');
  });

  //Edita el primer elemento creado con el POST
  it('E2E / PUT', async () => {
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
  it('E2E / DELETE', async () => {
    return request(app.getHttpServer())
      .delete(`/notebooks/${createdId}`)
      .expect(200);
  });
});
