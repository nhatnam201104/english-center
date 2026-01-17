export interface PagingData <T> {
    data: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}