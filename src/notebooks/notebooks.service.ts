import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notebook } from './entities/notebook.entity';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(
    @InjectRepository(Notebook)
    private readonly notebookRepo: Repository<Notebook>,
  ) {}

  //Traer todos
  findAll(): Promise<Notebook[]> {
    return this.notebookRepo.find();
  }

  //Buscar uno solo por id
  async findOne(id: number): Promise<Notebook> {
    const notebook = await this.notebookRepo.findOneBy({ id });
    if (!notebook) {
      throw new NotFoundException(
        `La notebook con ID ${id} no fue encontrada.`,
      );
    }
    return notebook;
  }

  create(dto: CreateNotebookDto): Promise<Notebook> {
    const notebook = this.notebookRepo.create(dto);
    return this.notebookRepo.save(notebook);
  }

  // Updayte
  async update(id: number, dto: UpdateNotebookDto): Promise<Notebook> {
    const notebook = await this.notebookRepo.preload({
      id,
      ...dto,
    });

    if (!notebook) {
      throw new NotFoundException(
        `La notebook con ID ${id} a actualizar no fue encontrada.`,
      );
    }
    return this.notebookRepo.save(notebook);
  }

  // Remove
  async remove(id: number): Promise<Notebook> {
    const notebook = await this.findOne(id);

    return this.notebookRepo.remove(notebook);
  }
}
