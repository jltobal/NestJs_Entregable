import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotebooksService } from '../notebooks.service';
import { Notebook } from '../entities/notebook.entity';
import { CreateNotebookDto } from '../dto/create-notebook.dto';
import { NotFoundException } from '@nestjs/common';

describe('NotebooksService', () => {
  let service: NotebooksService;

  const mockRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    preload: jest.fn(),
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

  //Test de trraer todos
  describe('findAll', () => {
    it('deberia obtener y retornar la lista de elementos (Notebooks)', async () => {
      const mockList = [{ id: 1, title: 'Notebook 1', content: 'i9' }];
      mockRepo.find.mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(result).toEqual(mockList);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  //test para crear notebook
  describe('create', () => {
    it('deberia crear y guardar un elemento (Notebook)', async () => {
      const dto: CreateNotebookDto = { title: 'Lenovo', content: 'X270' };
      const created = { id: 1, ...dto };

      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(dto);
    });
  });

  //Test para encontrar uno por id, con excepcion si id no existe
  describe('findOne', () => {
    it('debería retornar una notebook si la encuentra por su ID', async () => {
      const mockNotebook = { id: 1, marca: 'HP', modelo: 'Pavilion' };
      mockRepo.findOneBy = jest.fn().mockReturnValue(mockNotebook);
      const result = await service.findOne(1);

      expect(result).toEqual(mockNotebook);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('debería lanzar NotFoundException si la notebook no existe', async () => {
      mockRepo.findOneBy = jest.fn().mockReturnValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    describe('update', () => {
      it('deberia actualizar una notebook existente', async () => {
        const dto = { title: 'LEnoVO', content: 'i7' };
        const existingNotebook = { id: 1, title: 'Lenovo', content: 'X270' };
        const updatedNotebook = { id: 1, ...dto };

        mockRepo.preload = jest.fn().mockReturnValue(updatedNotebook);
        mockRepo.save = jest.fn().mockReturnValue(updatedNotebook);
        const result = await service.update(1, dto);
        expect(result).toEqual(updatedNotebook);
        expect(mockRepo.preload).toHaveBeenCalledWith({ id: 1, ...dto });
        expect(mockRepo.save).toHaveBeenCalledWith(updatedNotebook);
      });
    });

    //Test para eliminar uno por di
    describe('removeOne', () => {
      it('deberia eliminar una notebook por ID', async () => {
        const mockNotebook = { id: 1, title: 'Acer', content: 'i9' };
        mockRepo.findOneBy = jest.fn().mockReturnValue(mockNotebook);
        mockRepo.remove = jest.fn().mockReturnValue(undefined);
        const result = await service.remove(1);
        expect(result).toBeUndefined();
        expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockRepo.remove).toHaveBeenCalledWith(mockNotebook);
      });

      it('deberia lanzar una excepcion si la notebook no existe', async () => {
        mockRepo.findOneBy = jest.fn().mockReturnValue(null);
        await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
