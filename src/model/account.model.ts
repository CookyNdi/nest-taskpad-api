export class AccountResponse {
  name: string;
  email: string;
  image_url?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AccountRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export class AccountLoginRequest {
  email: string;
  password: string;
}

export class AccountUpdateAvatarRequest {
  image_url: string;
}
