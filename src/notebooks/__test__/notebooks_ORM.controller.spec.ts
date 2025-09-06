/*

-----------------------------CODIGO DEPRECADO---------------------------

import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from '../notebooks.controller';
import { NotebooksService } from '../notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from '../entities/notebook.entity';
import { Repository } from 'typeorm';
import { CreateNotebookDto } from '../dto/create-notebook.dto';
import { UpdateNotebookDto } from '../dto/update-notebook.dto';
import { HttpException } from '@nestjs/common';

describe('Integration test', () => {
  let controller: NotebooksController;
  let service: NotebooksService;
  let repository: Repository<Notebook>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook),
          useValue: (() => {
            const deletedTitles = new Set<string>();
            return {
              create: jest.fn((notebook: Partial<Notebook>) => ({
                ...notebook,
              })),
              save: jest.fn(async (notebook: Partial<Notebook>) => ({
                id: Math.floor(Math.random() * 1000) + 1,
                ...notebook,
              })),
              find: jest.fn(async () => [
                { id: 1, title: 'Dell', content: 'Latitude' },
                { id: 2, title: 'Lenovo', content: 'T-480s' },
              ]),
              findOne: jest.fn(async ({ where }) => {
                if (
                  where?.id === 999 ||
                  (where?.title && deletedTitles.has(where.title))
                ) {
                  return null;
                }
                return {
                  id: where?.id || 1,
                  ...where,
                  content:
                    where?.content ??
                    (where?.title === 'Lenovo' ? 'T-480s' : 'Test_Content'),
                };
              }),
              clear: jest.fn(async () => {
                deletedTitles.clear();
              }),
              preload: jest.fn(async (notebook: Partial<Notebook>) => {
                if (notebook.id === 999) return null;
                return {
                  id: Number(notebook.id) || 1,
                  ...notebook,
                };
              }),
              findOneBy: jest.fn(async (where) => {
                if (where?.title && deletedTitles.has(where.title)) return null;
                if (where?.id === 999) return null;
                return {
                  id: where?.id || 1,
                  ...where,
                  content:
                    where?.content ??
                    (where?.title === 'Lenovo' ? 'T-480s' : 'Ryzen 5'),
                };
              }),
              remove: jest.fn(async (notebook: Partial<Notebook>) => {
                if (notebook.title) deletedTitles.add(notebook.title);
                if (notebook.id) deletedTitles.add(String(notebook.id));
                return notebook;
              }),
            };
          })(),
        },
      ],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
    repository = module.get<Repository<Notebook>>(getRepositoryToken(Notebook));
  });

  afterEach(async () => {
    await repository.clear();
  });

  it('Deberia traer todas las notebooks', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('Deberia lanzar error 500 de base de datos', async () => {
    jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error('DB error'));

    await expect(controller.findAll()).rejects.toThrow(HttpException);
  });

  it('Debe traer una notebook por id', async () => {
    const result = await controller.findOne('1');
    expect(result).toBeDefined();
    expect(result.id).toEqual(1);
  });

  it('Debe lanzar NotFoundException si la notebook no existe (id inexistente)', async () => {
    await expect(controller.findOne('999')).rejects.toThrow(
      'La notebook con ID 999 no fue encontrada.',
    );
  });

  it('Debe crear una notebook y guardarla en la base de datos', async () => {
    const createDto: CreateNotebookDto = {
      title: 'Lenovo',
      content: 'T-480s',
    };

    const result = await controller.create(createDto);
    expect(result).toBeDefined();
    expect(result.title).toEqual(createDto.title);
    expect(result.content).toEqual(createDto.content);

    const savedNotebook = await repository.findOne({
      where: { title: createDto.title },
    });

    expect(savedNotebook).toBeDefined();
    expect(savedNotebook!.title).toEqual(createDto.title);
  });

  it('Debe lanzar 400 si ocurre un error en create', async () => {
    jest.spyOn(service, 'create').mockRejectedValueOnce(new Error('DB error'));

    await expect(
      controller.create({ title: 'Error', content: 'Fail' }),
    ).rejects.toThrow(HttpException);
  });

  it('Debe editar una notebook', async () => {
    const updateDto: UpdateNotebookDto = {
      title: 'Nuevo_titulo',
      content: 'Nuevo_contenido',
    };

    const result = await controller.update('1', updateDto);
    expect(result).toBeDefined();
    expect(result.title).toEqual(updateDto.title);
    expect(result.content).toEqual(updateDto.content);
  });

  it('Debe lanzar excepcion si intenta actualizar una notebook inexistente', async () => {
    const updateDto: UpdateNotebookDto = {
      title: 'Nuevo_titulo',
      content: 'Nuevo_contenido',
    };

    await expect(controller.update('999', updateDto)).rejects.toThrow(
      'no fue encontrada',
    );
  });

  it('Debe eliminar una notebook', async () => {
    const createDto: CreateNotebookDto = {
      title: 'Dell',
      content: 'Latitude 3545',
    };
    const result = await controller.create(createDto);

    expect(result).toBeDefined();
    expect(result.title).toEqual(createDto.title);

    await controller.remove(result.id.toString());

    const deletedNotebook = await repository.findOneBy({
      title: createDto.title,
    });

    expect(deletedNotebook).toBeDefined();
  });

  it('Debe lanzar excepcion si intenta eliminar una notebook inexistente', async () => {
    await expect(controller.remove('999')).rejects.toThrow('no fue encontrada');
  });
});

*/
