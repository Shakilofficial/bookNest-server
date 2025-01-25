// Interface for login user
export interface ILoginUser {
  email: string;
  password: string;
}

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TResetPassword = {
  newPassword: string;
};
