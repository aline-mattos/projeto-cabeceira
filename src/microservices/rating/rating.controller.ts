import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { UpsertRatingDTO } from './dto/upsert-rating.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard, User } from '../auth/jwt-auth.guard';
import { Rating } from '../../shared/schemas/rating.schema';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly service: RatingService) {}

  @Post('/upsert')
  @ApiOperation({ summary: 'Update/Insert a new rating' })
  @ApiResponse({ status: 201, description: 'Successfully created a new rating.' })
  async upsert(@Body() dto: UpsertRatingDTO, @User() user: any) {
    return this.service.upsert(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:user') 
  @ApiOperation({ summary: 'Find ratings by user' })
  @ApiParam({ name: 'user', description: 'The user ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by user.' })
  async findByUser(@Param('user') user: string) {
    return this.service.find({ user });
  }

  @UseGuards(JwtAuthGuard)
  @Get('book/:book')
  @ApiOperation({ summary: 'Find ratings by book' })
  @ApiParam({ name: 'book', description: 'The book ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by book.' })
  async findByBook(@Param('book') book: string) {
    return this.service.find({ book });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all ratings.' })
  async findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiParam({ name: 'id', description: 'Rating ID to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted rating.' })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
