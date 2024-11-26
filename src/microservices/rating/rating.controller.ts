import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { RatingService } from './rating.service';
import { UpsertRatingDTO } from './dto/upsert-rating.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly service: RatingService) {}

  @MessagePattern('book.delete')
  async handleBookDeletion(bookId: any) {
    if (!bookId) {
      console.log('[E] Book ID not provided.');
      return;
    }
    await this.service.deleteByFilter({ book: new Types.ObjectId(bookId) });
  }

  @MessagePattern('user.delete')
  async handleUserDeletion(userId: any) {
    if (!userId) {
      console.log('[E] User ID not provided.');
      return;
    }
    await this.service.deleteByFilter({ user: new Types.ObjectId(userId) });
  }

  @Post('/upsert')
  @ApiOperation({ summary: 'Update/Insert a new rating' })
  @ApiResponse({ status: 201, description: 'Successfully created a new rating.' })
  async upsert(@Headers('authorization') auth: string, @Body() dto: UpsertRatingDTO) {
    return await this.service.upsert(dto, auth);
  }

  @Get('user/:user') 
  @ApiOperation({ summary: 'Find ratings by user' })
  @ApiParam({ name: 'user', description: 'The user ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by user.' })
  async findByUser(@Headers('authorization') auth: string, @Param('user') id: string) {
    return await this.service.find({ user: new Types.ObjectId(id) }, auth)
  }

  @Get('book/:book')
  @ApiOperation({ summary: 'Find ratings by book' })
  @ApiParam({ name: 'book', description: 'The book ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by book.' })
  async findByBook(@Headers('authorization') auth: string, @Param('book') id: string) {
    return await this.service.find({ book: new Types.ObjectId(id) }, auth)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiParam({ name: 'id', description: 'Rating ID to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted rating.' })
  async delete(@Headers('authorization') auth: string, @Param('id') id: string) {
    return await this.service.delete(id, auth);
  }
}
