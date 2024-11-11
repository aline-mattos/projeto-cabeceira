import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { Bookshelf } from './schemas/bookshelf.schema';

@Controller('bookshelf')
export class BookshelfController {
    constructor(private readonly bookshelfService: BookshelfService) {}

    @Post('add')
    async addBook(@Body() createBookshelfDto: CreateBookshelfDto): Promise<Bookshelf> {
        return this.bookshelfService.addBook(createBookshelfDto);
    }

    @Get(':userId')
    async findBooks(@Param('userId') userId: string): Promise<Bookshelf | null> {
        return this.bookshelfService.findBooks(userId);
    }

    @Delete('remove')
    async removeBook(@Body() removeBookDto: { userId: string; bookId: string }): Promise<Bookshelf | null> {
        return this.bookshelfService.removeBook(removeBookDto.userId, removeBookDto.bookId);
    }
}
