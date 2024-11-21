import { UpsertBookDTO } from "../../../microservices/book/dto/upsert-book.dto";
import { AxiosClient } from "../axios_client";

export class BookClient {
  private static _instance: BookClient | null = null;

  private api: AxiosClient;

  private constructor() {
    this.api = new AxiosClient('http://book-service:3002/book');
  }

  public static getInstance(): BookClient {
    if (!this._instance) {
      this._instance = new BookClient();
    }
    return this._instance;
  }

  public async upsertBook(authToken: string, dto: UpsertBookDTO): Promise<any> {
    return this.api.post('/upsert', dto, {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async getBookById(authToken: string, bookId: string): Promise<any> {
    return this.api.get(`/${bookId}`, {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async getAllBooks(authToken: string): Promise<any> {
    return this.api.get('/', {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async deleteBookById(authToken: string, bookId: string): Promise<any> {
    return this.api.delete(`/${bookId}`, {
      headers: {
        authorization: authToken,
      },
    });
  }
}
