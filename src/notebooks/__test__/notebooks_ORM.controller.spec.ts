import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from '../notebooks.controller';
import { NotebooksService } from '../notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from '../entities/notebook.entity';
import { Repository } from 'typeorm';
import { CreateNotebookDto } from '../dto/create-notebook.dto';

describe('NotebooksController (Integration Test)', () => {
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
          useValue: {
            create: jest.fn((notebook: Partial<Notebook>) => ({
              ...notebook,
            })),
            save: jest.fn(async (notebook: Partial<Notebook>) => ({
              id: 1,
              ...notebook,
            })),
            findOne: jest.fn(async ({ where }) => ({
              id: 1,
              ...where,
              content:
                where?.content ??
                (where?.title === 'Lenovo' ? 'T-480s' : 'Test_Content'),
            })),
            clear: jest.fn(async () => {}),
            preload: jest.fn(async (notebook: Partial<Notebook>) => ({
              id: Number(notebook.id) || 1,
              ...notebook,
            })),
          },
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

  it('deberia editar una notebook', async () => {
    const updateDto = {
      title: 'Nuevo_titulo',
      content: 'Nuevo_contenido',
    };

    const result = await controller.update('1', updateDto);
    expect(result).toBeDefined();
    expect(result.title).toEqual(updateDto.title);
    expect(result.content).toEqual(updateDto.content);

    const updateNotebook = await repository.findOne({
      where: { title: updateDto.title },
    });
  });

  it('debería crear una notebook y guardarla en la base de datos', async () => {
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
    expect(savedNotebook!.content).toEqual(createDto.content);
  });
});
