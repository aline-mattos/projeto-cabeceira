import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all books' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all books' })
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto, description: 'Details of the book to be created' })
  @ApiResponse({ status: 201, description: 'Successfully created the book' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }
}
