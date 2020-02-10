/**
 * Interface para armazenamento da requisição do recurso
 * para buscar proprietarios de grupo
 */

export interface SearchGroupOwnerRequest {
    groupOwnerId: number;
    groupId: number;
	companyId: number;
	unitId: number;
}