export interface AuthOutput {
  accessToken: string;
  refreshToken: string;
}

export type AuthGatewayOutput = Omit<AuthOutput, 'refreshToken'>;
