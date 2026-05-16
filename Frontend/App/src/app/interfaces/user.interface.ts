export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isConfirm?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthResponse {
  success: boolean;
  token?: string;
  data?: IUser;
  message?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  password: string;
}

export interface IUsersResponse {
  success: boolean;
  results: number;
  count: number;
  data: IUser[];
}

export interface IUserResponse {
  success: boolean;
  data: IUser;
}
