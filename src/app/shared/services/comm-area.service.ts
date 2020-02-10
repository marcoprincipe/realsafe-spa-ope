import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import { UserGroup, UserCompany, UserUnit, GroupOwner, Terminal, TerminalStatus } from '../../payload';

/**
 * Serviço para compartilhamento de dados entre componentes.
 */

@Injectable({
  providedIn: 'root'
})
export class CommAreaService {

  /**
   * Declaração das variáveis membro
   */

  public groupOwnerId: number;
  public groupId: number;
  public companyId: number;
  public unitId: number;

  public groupOwner: GroupOwner;
  public terminal: Terminal;
  public terminalStatus: TerminalStatus;
  public userGroup: UserGroup;
  public userCompany: UserCompany;
  public userUnit: UserUnit;

  public isUnique: boolean = false;

  public user: User;

  public data: any = {};

  /**
   * Construtor default do serviço.
   */

  constructor() { 
  }

}
