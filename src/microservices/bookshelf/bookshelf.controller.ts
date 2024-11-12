import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { UpsertBookshelfDTO } from './dto/upsert-bookshelf.dto';
import { Bookshelf } from '../../shared/schemas/bookshelf.schema';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard, User } from '../auth/jwt-auth.guard';

@ApiTags('bookshelf')
@Controller('bookshelf')
export class BookshelfController {
  constructor(private readonly service: BookshelfService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @ApiOperation({ summary: 'Add a book to the user\'s bookshelf' })
  @ApiBody({ type: UpsertBookshelfDTO, description: 'Details of the book to add to the bookshelf' })
  @ApiResponse({ status: 201, description: 'Successfully added book to the bookshelf' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async addBook(@Body() dto: UpsertBookshelfDTO, @User() user: any): Promise<Bookshelf | undefined> {
    return await this.service.upsert(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('retrive')
  @ApiOperation({ summary: 'Find all books on a user\'s bookshelf' })
  @ApiParam({ name: 'userId', description: 'The user ID to fetch the bookshelf for' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user\'s bookshelf' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async retrieveBookshelf(@User() user: any): Promise<Bookshelf | undefined> {
    return await this.service.find({ user: user._id })
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  @ApiOperation({ summary: 'Remove a book from the user\'s bookshelf' })
  @ApiBody({ type: Object, description: 'Details of the book to remove from the bookshelf' })
  @ApiResponse({ status: 200, description: 'Successfully removed book from the bookshelf' })
  @ApiResponse({ status: 404, description: 'Book or user not found' })
  async removeBook(@Param('bookId') bookId: string, @User() user: any): Promise<Bookshelf | undefined> {
    return await this.service.removeBook(bookId, user._id);
  }
}
