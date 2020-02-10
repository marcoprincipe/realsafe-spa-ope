/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para para efetuar uma impressão.
 */

export interface PrintRequest {
    companyId: number,
    unitId: number,
    email: string,
    data: string
}