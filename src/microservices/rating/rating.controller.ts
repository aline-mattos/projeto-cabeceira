import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly service: RatingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all ratings.' })
  async findAll() {
    return this.service.findAll();
  }

  @Get('user/:user') 
  @ApiOperation({ summary: 'Find ratings by user' })
  @ApiParam({ name: 'user', description: 'The user ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by user.' })
  async findByUser(@Param('user') user: string) {
    return this.service.findByUser(user);
  }

  @Get('book/:book')
  @ApiOperation({ summary: 'Find ratings by book' })
  @ApiParam({ name: 'book', description: 'The book ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by book.' })
  async findByBook(@Param('book') book: string) {
    return this.service.findByBook(book);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiParam({ name: 'id', description: 'Rating ID to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted rating.' })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({ status: 201, description: 'Successfully created a new rating.' })
  async create(@Body() dto: CreateRatingDto) {
    return this.service.create(dto);
  }
}
