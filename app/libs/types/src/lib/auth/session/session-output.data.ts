export interface SessionOutput {
  id: string;
  userId: string;
  localName: string | null;
  device: string;
  browser: string;
  os: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AllSessionsOutput {
  sessions: SessionOutput[]
}
