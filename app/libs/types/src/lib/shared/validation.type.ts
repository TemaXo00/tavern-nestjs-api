export interface ValidateInput {
  accessToken: string;
  session: SessionInput
}

export interface SessionInput {
  os: string;
  device: string;
  browser: string;
  ip: string;
}
