import { ApiProperty } from '@nestjs/swagger';

export class CreateBookshelfDto {
  @ApiProperty({ description: 'The status of the book on the bookshelf (e.g., "LIDO", "LENDO", "A LER")' })
  status: string;

  @ApiProperty({ description: 'The ID of the book being added to the bookshelf' })
  bookId: string;

  @ApiProperty({ description: 'The ID of the user who owns the bookshelf' })
  userId: string;
}
