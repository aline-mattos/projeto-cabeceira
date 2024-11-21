import { AuthenticationDTO } from "../../../microservices/user/dto/authentication.dto";
import { RegistrationDTO } from "../../../microservices/user/dto/registration.dto";
import { User } from "../../schemas/user.schema";
import { AxiosClient } from "../axios_client";

export class UserClient {
  private static _instance: UserClient | null = null;

  private api: AxiosClient;

  private constructor() {
    this.api = new AxiosClient('http://user-service:3001/user');
  }

  public static getInstance(): UserClient {
    if (!this._instance) {
      this._instance = new UserClient();
    }
    return this._instance;
  }

  public async authorize(authToken: string): Promise<User | undefined> {
    return this.api.get('/authorize', {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async authenticate(dto: AuthenticationDTO): Promise<any> {
    return this.api.post('/authenticate', dto);
  }

  public async register(dto: RegistrationDTO): Promise<any> {
    return this.api.post('/register', dto);
  }

  public async findAll(authToken: string): Promise<any> {
    return this.api.get('/', {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async deleteUserById(authToken: string, userId: string): Promise<any> {
    return this.api.delete(`/${userId}`, {
      headers: {
        authorization: authToken,
      },
    });
  }
}