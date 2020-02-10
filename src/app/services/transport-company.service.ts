import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestResponse } from '../payload/rest-response';
import { ResourceAccessService } from '../shared/services/resource-access.service';
import { ListTransportCompanyDetailsRequest } from '../payload/transport-company-details/list-transport-company-details-request';
import { TransportCompanyDetail } from '../model';
import { TransportCompanyRequest } from '../payload';

/**
 * Serviço para acesso das funcionalidades de empresas de transporte de valores.
 */

@Injectable({
  providedIn: 'root'
})
export class TransportCompanyService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Incluir uma empresa.
   */

  public addETV(request: TransportCompanyRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("transportCompany", "update", request).subscribe(
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
   * Retorna a lista de detalhes de uma ETV
   */

  public listETVDetails(request: ListTransportCompanyDetailsRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("transportCompany", "findTransportCompanyById", request).subscribe(
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
   * Criar uma ETV.
   */

  public createETV(request: TransportCompanyDetail): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("transportCompany", "create", request).subscribe(
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
   * Remove uma ETV.
   */

  public removeETV(company: TransportCompanyDetail): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("transportCompany", "remove", company).subscribe(
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
