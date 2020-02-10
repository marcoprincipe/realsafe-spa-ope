import { Injectable } from '@angular/core';
import { ListCashCollectionRequest, ListCashCollectionResponse, RestResponse, CollectCashRequest, CollectCashResponse, ListCashCollectionDetailsRequest, ListCashCollectionDetailsResponse, PrintCollectCashReceiptRequest } from '../payload';
import { Observable } from 'rxjs';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de recolhimento de numerário.
 */

@Injectable({
  providedIn: 'root'
})
export class CashCollectionService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Efetua a pesquisa dos dados do recolhimento de numerário.
   */

  public collectCash(request: CollectCashRequest): Observable<RestResponse<CollectCashResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("cashCollection", "collectCash", request).subscribe(
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
   * Efetua a impressão do comprovante do recolhimento de numerário.
   */

  public printCollectCashReceipt(request: PrintCollectCashReceiptRequest): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("cashCollection", "printCollectCashReceipt", request).subscribe(
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
   * Efetua a pesquisa dos dados do recolhimento de numerário.
   */

  public listCashCollection(request: ListCashCollectionRequest): Observable<RestResponse<ListCashCollectionResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("cashCollection", "listCashCollection", request).subscribe(
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
   * Efetua a pesquisa dos dados do recolhimento de numerário.
   */

  public listCashCollectionDetails(request: ListCashCollectionDetailsRequest): Observable<RestResponse<ListCashCollectionDetailsResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("cashCollection", "listCashCollectionDetails", request).subscribe(
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
