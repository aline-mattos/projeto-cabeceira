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

  @Get(':isbn')  // Using ISBN instead of ID
  async findOne(@Param('isbn') isbn: string) {
    return this.bookService.findOne(isbn);
  }

  @Delete(':isbn')  // Using ISBN instead of ID
  async delete(@Param('isbn') isbn: string) {
    return this.bookService.delete(isbn);
  }

  @Post('/create')
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }
}
