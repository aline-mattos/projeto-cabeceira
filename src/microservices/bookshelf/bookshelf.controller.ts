import { Controller, Post, Body, Get, Param, Delete, Headers, Query } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { UpsertBookshelfDTO } from './dto/upsert-bookshelf.dto';
import { Bookshelf } from '../../shared/schemas/bookshelf.schema';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { APIGateway } from '../../shared/gateway/api_gateway';
import { Types } from 'mongoose';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('bookshelf')
@Controller('bookshelf')
export class BookshelfController {
  constructor(private readonly service: BookshelfService) {}

  @MessagePattern("book.delete")
  async handleBookDeletion(bookId: any) {
    if (!bookId) {
      console.log("[E] BookshelfController.handleBookDeletion: bookId is missing.");
      return;
    }

    try {
      const result = await this.service.removeBookFromAllUsers(bookId);
      if (result.modifiedCount > 0) {
        console.log(`[I] BookshelfController.handleBookDeletion: Successfully deleted book ${bookId} from all bookshelves.`);
      } else {
        console.log(`[W] BookshelfController.handleBookDeletion: No bookshelves found containing book ${bookId}.`);
      }
    } catch (error) {
      console.log(`[E] BookshelfController.handleBookDeletion: ${error}`);
    }
  }

  @MessagePattern("user.delete")
  async handleUserDeletion(userId: any) {
    if (!userId) {
      console.log("[E] BookshelfController.handleUserDeletion: userId is missing.");
      return;
    }

    try {
      const result = await this.service.removeBookshelf(userId);
      if (result.deletedCount > 0) {
        console.log(`[I] BookshelfController.handleUserDeletion: Successfully deleted bookshelf for user ${userId}.`);
      } else {
        console.log(`[W] BookshelfController.handleUserDeletion: Bookshelf not found for user ${userId}.`);
      }
    } catch (error) {
      console.log(`[E] BookshelfController.handleUserDeletion: ${error}`);
    }
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a book to the user\'s bookshelf' })
  @ApiBody({ type: UpsertBookshelfDTO, description: 'Details of the book to add to the bookshelf' })
  @ApiResponse({ status: 201, description: 'Successfully added book to the bookshelf' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async addBook(@Headers('authorization') auth: string, @Body() dto: UpsertBookshelfDTO): Promise<Bookshelf | undefined> {
    return await this.service.upsert(dto, auth);
  }

  @Get('retrive')
  @ApiOperation({ summary: 'Find all books on a user\'s bookshelf' })
  @ApiParam({ name: 'userId', description: 'The user ID to fetch the bookshelf for' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the user\'s bookshelf' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async retrieveBookshelf(@Headers('authorization') auth: string): Promise<Bookshelf | undefined> {
    const user = await APIGateway.user.authorize(auth);
    if (user) return await this.service.find({ user: new Types.ObjectId(user._id) })
    else return undefined
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove a book from the user\'s bookshelf' })
  @ApiBody({ type: Object, description: 'Details of the book to remove from the bookshelf' })
  @ApiResponse({ status: 200, description: 'Successfully removed book from the bookshelf' })
  @ApiResponse({ status: 404, description: 'Book or user not found' })
  async removeBook(@Headers('authorization') auth: string, @Query('bookId') bookId: string): Promise<Bookshelf | undefined> {
    return await this.service.removeBook(bookId, auth);
  }
}
