import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { Param } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { Notebook } from './entities/notebook.entity';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Get()
  async findAll(): Promise<Notebook[]> {
    try {
      return await this.notebooksService.findAll();
    } catch {
      throw new HttpException(
        'Error retrieving notebooks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notebook> {
    return this.notebooksService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotebookDto: UpdateNotebookDto,
  ): Promise<Notebook> {
    return this.notebooksService.update(Number(id), updateNotebookDto);
  }

  @Post()
  async create(
    @Body() createNotebookDto: CreateNotebookDto,
  ): Promise<Notebook> {
    try {
      return await this.notebooksService.create(createNotebookDto);
    } catch {
      throw new HttpException(
        'Error creating notebook',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notebooksService.remove(Number(id));
  }
}
