import { RoleType } from 'enum';

export interface User {
  status: boolean;
  message?: string;
  token: string;
  role: {
    id: RoleType.ADMIN;
    name: string;
  };
  _id: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
}
