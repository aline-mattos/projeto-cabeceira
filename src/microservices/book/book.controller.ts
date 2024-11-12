import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { UpsertBookDTO } from './dto/upsert-book.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Book } from '../../shared/schemas/book.schema';
import { Types } from 'mongoose';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly service: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upsert')
  @ApiOperation({ summary: 'Update/Insert a new book' })
  @ApiBody({ type: UpsertBookDTO, description: 'Details of the book to be created' })
  @ApiResponse({ status: 201, description: 'Successfully created the book' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async upsert(@Body() dto: UpsertBookDTO) {
    return this.service.upsert({
      ...dto,
      _id: dto._id ? new Types.ObjectId(dto._id) : undefined
    } as Book);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async find(@Param('id') id: string) {
    return this.service.find({ _id: id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve all books' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all books' })
  async findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
