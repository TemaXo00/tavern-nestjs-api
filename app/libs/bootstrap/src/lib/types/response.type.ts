export interface ResponseType<T> {
    status: 'success' | 'error';
    date: string;
    time: string;
    data: T;
    path?: string;
}