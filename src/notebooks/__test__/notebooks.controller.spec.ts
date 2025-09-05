import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from '../notebooks.controller';
import { NotebooksService } from '../notebooks.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateNotebookDto } from '../dto/create-notebook.dto';
import { Notebook } from '../entities/notebook.entity';
import { UpdateNotebookDto } from '../dto/update-notebook.dto';

describe('NotebooksController', () => {
  let controller: NotebooksController;

  // Mock del service con todas las funciones
  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    })
      .overrideProvider(NotebooksService)
      .useValue(mockService)
      .compile();

    controller = module.get<NotebooksController>(NotebooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deberia devolver la lista de elementos desde el service', async () => {
      const mockList: Notebook[] = [
        { id: 1, title: 'Notebook 1', content: 'i9' },
      ];

      mockService.findAll.mockResolvedValue(mockList);

      const result = await controller.findAll();

      expect(result).toEqual(mockList);
      expect(mockService.findAll).toHaveBeenCalled();
    });

    it('deberia devolver HttpException (500 Internal Server Error)', async () => {
      mockService.findAll.mockRejectedValue(
        new HttpException(
          'Error retrieving notebooks',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('deberia llamar al service con el DTO correcto', async () => {
      const dto: CreateNotebookDto = { title: 'Notebook 1', content: 'i9' };
      const created = { id: 1, ...dto };

      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(result).toEqual(created);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });

    it('deberia devolver HttpException (400 Bad Request)', async () => {
      mockService.create.mockRejectedValue(
        new HttpException('Error creating notebook', HttpStatus.BAD_REQUEST),
      );

      const invalidDto: CreateNotebookDto = {
        title: 'test',
        content: '',
      };

      await expect(controller.create(invalidDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  //Test para Find One
  describe('Encontrar una notebook por ID', () => {
    it('deberia devolver una notebook por ID', async () => {
      const notebook: Notebook = { id: 1, title: 'notebook 1', content: 'i9' };
      mockService.findOne.mockResolvedValue(notebook);
      const result = await controller.findOne('1');
      expect(result).toEqual(notebook);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  //Test para Update
  describe('update', () => {
    it('deberia llamar al service para actualizar una notebook', async () => {
      const updateDto: UpdateNotebookDto = { title: 'Updated Notebook' };
      const updatedNotebook: Notebook = {
        id: 1,
        title: 'Updated Notebook',
        content: 'i9',
      };

      mockService.update.mockResolvedValue(updatedNotebook);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedNotebook);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('deberia lanzar una excepcion si la notebook a actualizar no existe', async () => {
      mockService.update.mockRejectedValue(
        new HttpException('Notebook not found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.update('99', {})).rejects.toThrow(HttpException);
    });
  });
});
