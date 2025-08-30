import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from '../notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from '../entities/notebook.entity';
import { CreateNotebookDto } from '../dto/create-notebook.dto';

describe('NotebooksService', () => {
  let service: NotebooksService;

  const mockRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deberia obtener y retornar la lista de elementos (Notebooks)', async () => {
      const mockList = [{ id: 1, title: 'Notebook 1', content: 'i9' }];
      mockRepo.find.mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(result).toEqual(mockList);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('deberia crear y guardar un elemento (Notebook)', async () => {
      const dto: CreateNotebookDto = { title: 'Notebook 1', content: 'i9' };
      const created = { id: 1, ...dto };

      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(dto);
    });
  });
});
