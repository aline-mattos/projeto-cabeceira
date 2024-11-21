import { UpsertBookshelfDTO } from "../../../microservices/bookshelf/dto/upsert-bookshelf.dto";
import { AxiosClient } from "../axios_client";

export class BookshelfClient {
  private static _instance: BookshelfClient | null = null;

  private api: AxiosClient;

  private constructor() {
    this.api = new AxiosClient('http://bookshelf-service:3003/bookshelf');
  }

  public static getInstance(): BookshelfClient {
    if (!this._instance) {
      this._instance = new BookshelfClient();
    }
    return this._instance;
  }

  public async addBook(authToken: string, dto: UpsertBookshelfDTO): Promise<any> {
    return this.api.post('/add', dto, {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async retrieveBookshelf(authToken: string): Promise<any> {
    return this.api.get('/retrive', {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async removeBook(authToken: string, bookId: string): Promise<any> {
    return this.api.delete('/remove', {
      headers: {
        authorization: authToken,
      },
      data: { bookId },
    });
  }
}
