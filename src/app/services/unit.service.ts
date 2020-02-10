import { Injectable } from '@angular/core';
import { ResourceAccessService } from '../shared/services/resource-access.service';
import { Observable } from 'rxjs';
import { RestResponse } from '../payload';
import { ListUnitsByCompanyIdRequest } from '../payload/list-units-by-company-id-request';
import { ListUnitsRequest } from '../payload/unit/list-unit-request';

/**
 * Serviço para acesso das funcionalidades de unidades.
 */

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  /**
   * Construtor default da classe.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Retorna a lista de unidades da empresa informada.
   * 
   * @param companyId - Identificador da empresa para pesquisa.
   */

  public listUnitsByCompanyId(companyId: number): Observable<RestResponse<any>> {

    return new Observable<RestResponse<any>>((observer) => {

      const request: ListUnitsByCompanyIdRequest = { 
        companyId: companyId 
      };

      this.resourceAccessService.post("unit", "listUnitsByCompanyId", request).subscribe(
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
  /**
   * Retorna a lista das filiais cadastradas.
   */

  public listUnits(): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("unit", "listUnits").subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  };

 /**
   * Retorna a lista de detalhes de uma filial.
   */

  public listUnitDetails(request: ListUnitsRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("group", "findUnitById", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  };


}
