import { ApiProperty } from '@nestjs/swagger';

export class UpsertBookshelfDTO {
  @ApiProperty({ description: 'The title of the book', required: false  })
  _id?: string;
  
  @ApiProperty({ description: 'The status of the book on the bookshelf (e.g., "LIDO", "LENDO", "A LER")' })
  status: string;

  @ApiProperty({ description: 'The ID of the book being added to the bookshelf' })
  bookId: string;
}
