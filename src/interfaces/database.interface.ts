export interface IPagination {
    count: number;
    pageSize: number;
    page: number;
    data: number;
}

export interface IQueryParams {
    page: number;
    limit: number;
    query: string;
    category?: number;
    level?: string;
    price?: number;
    rating?: number;
    type_code?: string;
    column?: string;
    sort?: 'ASC' | 'DESC';

}