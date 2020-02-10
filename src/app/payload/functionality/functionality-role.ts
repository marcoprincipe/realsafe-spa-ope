/**
 * Interface para armazenamento dos dados de uma funcionalidade de um perfil.
 */

export interface FunctionalityRole {
	roleId: number;
	roleInitial: string;
	roleName: string;
	functionalityId: number;
	functionalityName: string;
	functionalityDescription: string;
	functionalityRoute: string;
	functionalityParentId: number;
	functionalityShowOrder: number;
	functionalityAccessKey: string;
}