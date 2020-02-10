import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestResponse, FunctionalityRole, ListFunctionalitiesByRoleIdRequest } from '../payload';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de funcionalidades.
 */

@Injectable({
  providedIn: 'root'
})
export class FunctionalityService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Retorna a lista de funcionalidades de um perfil.
   * 
   * @param roleId - Identificador do perfil para pesquisa.
   */

  public listFunctionalitiesByRoleId(roleId: number, parentId: number): Observable<RestResponse<any>> {

    return new Observable<RestResponse<any>>((observer) => {

      const request: ListFunctionalitiesByRoleIdRequest = { 
        roleId: roleId,
        parentId: parentId
      };

      this.resourceAccessService.post("functionality", "listFunctionalitiesByRoleId", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
  
    });
  }


}
