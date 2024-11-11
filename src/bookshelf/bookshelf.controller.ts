import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { Bookshelf } from './schemas/bookshelf.schema';

@Controller('bookshelf')
export class BookshelfController {
    constructor(private readonly bookshelfService: BookshelfService) {}

    // Add a book to the user's bookshelf
    @Post('add')
    async addBook(@Body() createBookshelfDto: CreateBookshelfDto): Promise<Bookshelf> {
        return this.bookshelfService.addBook(createBookshelfDto);
    }

    // Get all books on the user's bookshelf
    @Get(':userId')
    async findBooks(@Param('userId') userId: string): Promise<Bookshelf | null> {
        return this.bookshelfService.findBooks(userId);
    }

    // Remove a book from the user's bookshelf
    @Delete('remove')
    async removeBook(@Body() removeBookDto: { userId: string; bookId: string }): Promise<Bookshelf | null> {
        return this.bookshelfService.removeBook(removeBookDto.userId, removeBookDto.bookId);
    }
}
