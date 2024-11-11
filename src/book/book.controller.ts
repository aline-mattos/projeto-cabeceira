import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books') 
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }

  @Post('/create')
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }
  
}
