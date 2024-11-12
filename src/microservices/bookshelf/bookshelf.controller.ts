import { Controller, Post, Body, Get, Param, Delete, Headers } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { UpsertBookshelfDTO } from './dto/upsert-bookshelf.dto';
import { Bookshelf } from '../../shared/schemas/bookshelf.schema';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('bookshelf')
@Controller('bookshelf')
export class BookshelfController {
  constructor(
    private readonly service: BookshelfService,
    private readonly userService: UserService
  ) {}

  @Post('add')
  @ApiOperation({ summary: 'Add a book to the user\'s bookshelf' })
  @ApiBody({ type: UpsertBookshelfDTO, description: 'Details of the book to add to the bookshelf' })
  @ApiResponse({ status: 201, description: 'Successfully added book to the bookshelf' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async addBook(@Headers('authorization') auth: string, @Body() dto: UpsertBookshelfDTO): Promise<Bookshelf | undefined> {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.upsert(dto, user);
    else undefined
  }

  @Get('retrive')
  @ApiOperation({ summary: 'Find all books on a user\'s bookshelf' })
  @ApiParam({ name: 'userId', description: 'The user ID to fetch the bookshelf for' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user\'s bookshelf' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async retrieveBookshelf(@Headers('authorization') auth: string): Promise<Bookshelf | undefined> {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.find({ user: user._id })
    else undefined
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove a book from the user\'s bookshelf' })
  @ApiBody({ type: Object, description: 'Details of the book to remove from the bookshelf' })
  @ApiResponse({ status: 200, description: 'Successfully removed book from the bookshelf' })
  @ApiResponse({ status: 404, description: 'Book or user not found' })
  async removeBook(@Headers('authorization') auth: string, @Param('bookId') bookId: string): Promise<Bookshelf | undefined> {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.removeBook(bookId, user);
    else undefined
  }
}
