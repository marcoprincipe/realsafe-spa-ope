import { Component } from '@angular/core';
import { ListTransportCompanyDetailsRequest } from '../../../../payload/transport-company-details/list-transport-company-details-request';
import { TransportCompanyDetail }  from 'src/app/model/transport-company-detail';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TransportCompanyService } from 'src/app/services/transport-company.service';

declare const $: any;

@Component({
  selector: 'rs-transport-company-detail',
  templateUrl: './transport-company-detail.component.html',
  styleUrls: ['./transport-company-detail.component.scss']
})
export class TransportCompanyDetailComponent  {
  
/**
* Declaração das variáveis membro
*/

public transportCompanyId: number;
public transportCompanyDetails: TransportCompanyDetail[];


/**
* Construtor default do diálogo.
* 
* @param companyService - Instância do serviço de empresas.
* @param commAreaService - Instância do serviço de dados comuns.
*/

constructor(
private commAreaService: CommAreaService,
private transportCompanyService: TransportCompanyService) {
}

/**
* Inicializa o componente para utilização.
*/

public show(): void {

 const request: ListTransportCompanyDetailsRequest = this.commAreaService.data["listTransportCompanyDetailsRequest"];

 this.transportCompanyId = request.transportCompanyId;

 delete this.commAreaService.data["listTransportCompanyDetailsRequest"];

 this.transportCompanyService.listETVDetails(request).subscribe(
   (response) => {
     this.transportCompanyService = response.data;
     console.log(this.transportCompanyService);
     
     this.openModal();
   },
 (error) => {
     console.log(error);
 });

} 
/**
* Apresenta o diálogo para visualização dos dados da empresa.
*/

public openModal(): void {

 $("#transportCompanyDetailDialog").modal({ backdrop: 'static', keyboard: true });

 $("#transportCompanyDetailDialog").on('shown.bs.modal', function () {
   setTimeout(() => {
     $("#btnExit").trigger('focus')
   }, 100);
 })

}

/**
* Esconde o diálogo de confirmação.
*/

public hide(): void {

 $("#transportCompanyDetailDialog").modal('hide');

}

}
