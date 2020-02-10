/**
 * Interface de resposta genérica de serviços
 */

export interface RestResponse<T> {
    code: number;
    message: string;
    data: T;
}
