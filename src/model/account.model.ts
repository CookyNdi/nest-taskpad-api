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
  image_url?: string;
  provider: string;
}

export class AccountLoginRequest {
  email: string;
  password: string;
}

export class AccountUpdateAvatarRequest {
  image_url: string;
}

export class AccountUpdatePassword {
  password: string;
  old_password: string;
}

export class AccountUpdateEmail {
  email: string;
  old_email: string;
  password: string;
}

export class AccountUpdateName {
  name: string;
}

export class AccountEmailVerificationRequest {
  token: string;
}
