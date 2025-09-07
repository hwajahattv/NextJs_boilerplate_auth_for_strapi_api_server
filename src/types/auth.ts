export interface StrapiAuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  message?: string;
  status?: string;
}
