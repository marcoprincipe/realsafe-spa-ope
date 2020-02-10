/**
 * Interface para armazenamento dos dados de
 * um grupo de um usuário.
 */

export interface UserGroup {
    groupId: number;
    groupName: string;
    userId: number,
    userName: string,
    roleId: number,
    roleInitial: string,
    roleName: string
}