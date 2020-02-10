import { Injectable } from '@angular/core';
import { ResourceAccessService } from '../shared/services/resource-access.service';
import { GetTerminalResponse, RestResponse, GetTerminalStatusRequest, GetTerminalStatusResponse, OpenTerminalRequest, OpenTerminalResponse, GetOpeningDetailRequest, GetOpeningDetailResponse, CloseTerminalRequest, CloseTerminalResponse, GetClosingDetailRequest, GetClosingDetailResponse, ListTerminalParametersResponse, PrintOpenTerminalReceiptRequest, PrintCloseTerminalReceiptRequest, ListTerminalRequest } from '../payload';
import { Observable } from 'rxjs';

/**
 * Serviço para acesso das funcionalidades de terminais.
 */

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  /**
   * Declaração das variáveis membro.
   */

  public parameters: any = {};

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Retorna os dados do terminal.
   */

  public getLocalTerminal(): Observable<RestResponse<GetTerminalResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("localTerminal", "getLocalTerminal").subscribe(
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
   * Retorna os dados dos parâmetros do terminal.
   */

  public listTerminalParameters(): Observable<RestResponse<ListTerminalParametersResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("localTerminal", "listTerminalParameters").subscribe(
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
   * Retorna os dados do terminal.
   */

  public getTerminalStatus(request: GetTerminalStatusRequest): Observable<RestResponse<GetTerminalStatusResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "getTerminalStatus", request).subscribe(
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
   * Efetua a abertura do terminal.
   */

  public openTerminal(request: OpenTerminalRequest): Observable<RestResponse<OpenTerminalResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "openTerminal", request).subscribe(
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
   * Efetua a impressão do comprovante de abertura do terminal.
   */

  public printOpenTerminalReceipt(request: PrintOpenTerminalReceiptRequest): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "printOpenTerminalReceipt", request).subscribe(
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
   * Retorna os dados dos detalhes da abertura do terminal.
   */

  public getOpeningDetail(request: GetOpeningDetailRequest): Observable<RestResponse<GetOpeningDetailResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "getOpeningDetail", request).subscribe(
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
   * Efetua o fechamento do terminal.
   */

  public closeTerminal(request: CloseTerminalRequest): Observable<RestResponse<CloseTerminalResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "closeTerminal", request).subscribe(
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
   * Efetua a impressão do comprovante de fechamento do terminal.
   */

  public printCloseTerminalReceipt(request: PrintCloseTerminalReceiptRequest): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "printCloseTerminalReceipt", request).subscribe(
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
   * Retorna os dados dos detalhes do fechamento do terminal.
   */

  public getClosingDetail(request: GetClosingDetailRequest): Observable<RestResponse<GetClosingDetailResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "getClosingDetail", request).subscribe(
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
   * Retorna a lista de detalhes de um Terminal.
   */

  public listTerminalDetails(request: ListTerminalRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("terminal", "findTerminalById", request).subscribe(
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
