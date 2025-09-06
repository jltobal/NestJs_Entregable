import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { getConnection, Connection } from 'typeorm';

describe('Integration con conexion ORM E2E', () => {
  let app: INestApplication;
  let connection: Connection;
  let createdId : number;

  beforeAll(async()=>{
    const moduleFixture: TestingModule = await
  })






});
