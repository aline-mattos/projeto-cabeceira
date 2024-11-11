import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'The title of the book' })
  title: string;

  @ApiProperty({ description: 'A brief description of the book' })
  description: string;

  @ApiProperty({ description: 'The author of the book' })
  author: string;

  @ApiProperty({ description: 'The publisher of the book' })
  publisher: string;

  @ApiProperty({ description: 'The launch year of the book' })
  launchYear: number;

  @ApiProperty({ description: 'The number of pages in the book' })
  pages: number;

  @ApiProperty({ description: 'The ISBN of the book' })
  ISBN: string;
}
