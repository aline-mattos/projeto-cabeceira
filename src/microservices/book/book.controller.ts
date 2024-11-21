import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { BookService } from './book.service';
import { UpsertBookDTO } from './dto/upsert-book.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Book } from '../../shared/schemas/book.schema';
import { Types } from 'mongoose';
import { APIGateway } from '../../shared/gateway/api_gateway';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(
    private readonly service: BookService) {}

  @Post('/upsert')
  @ApiOperation({ summary: 'Update/Insert a new book' })
  @ApiBody({ type: UpsertBookDTO, description: 'Details of the book to be created' })
  @ApiResponse({ status: 201, description: 'Successfully created the book' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async upsert(@Headers('authorization') auth: string, @Body() dto: UpsertBookDTO) {
    return await this.service.upsert({
      ...dto,
      _id: dto._id ? new Types.ObjectId(dto._id) : undefined
    } as Book, auth);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async find(@Headers('authorization') auth: string, @Param('id') id: string) {
    return await this.service.findById(id, auth);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all books' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all books' })
  async findAll(@Headers('authorization') auth: string) {
    return await this.service.findAll(auth);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the book to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the book' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async delete(@Headers('authorization') auth: string, @Param('id') id: string) {
    return await this.service.delete(id, auth);
  }
}
