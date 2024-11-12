import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { RatingService } from './rating.service';
import { UpsertRatingDTO } from './dto/upsert-rating.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('rating')
@Controller('rating')
export class RatingController {
  constructor(
    private readonly service: RatingService,
    private readonly userService: UserService) {}

  @Post('/upsert')
  @ApiOperation({ summary: 'Update/Insert a new rating' })
  @ApiResponse({ status: 201, description: 'Successfully created a new rating.' })
  async upsert(@Headers('authorization') auth: string, @Body() dto: UpsertRatingDTO) {
    const user = await this.userService.authorize(auth);
    if (user) return await  this.service.upsert(dto, user);
    else undefined
  }

  @Get('user/:user') 
  @ApiOperation({ summary: 'Find ratings by user' })
  @ApiParam({ name: 'user', description: 'The user ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by user.' })
  async findByUser(@Headers('authorization') auth: string, @Param('user') id: string) {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.find({ user: id })
    else undefined
  }

  @Get('book/:book')
  @ApiOperation({ summary: 'Find ratings by book' })
  @ApiParam({ name: 'book', description: 'The book ID to search ratings by' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ratings by book.' })
  async findByBook(@Headers('authorization') auth: string, @Param('book') id: string) {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.find({ book: id })
    else undefined
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all ratings.' })
  async findAll(@Headers('authorization') auth: string) {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.findAll();
    else undefined
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiParam({ name: 'id', description: 'Rating ID to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted rating.' })
  async delete(@Headers('authorization') auth: string, @Param('id') id: string) {
    const user = await this.userService.authorize(auth);
    if (user) return await this.service.delete(id);
    else undefined
  }
}
