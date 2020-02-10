import { Component } from '@angular/core';
import { ListGroupOwnerRequest } from '../../../../payload/group-owner/list-group-owner-request';
import { OwnerDetail }  from 'src/app/model/owner-detail';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { OwnerService } from 'src/app/services/owner.service';

declare const $: any;

/**
 * Diálogo para apresentação de detalhes de empresa.
 */

@Component({
  selector: 'rs-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.scss']
})
export class OwnerDetailComponent {

  /**
   * Declaração das variáveis membro
   */

  public groupOwnerId: number;
  public ownerDetails: OwnerDetail[];
   
  /**
   * Construtor default do diálogo.
   * 
   * @param companyService - Instância do serviço de empresas.
   * @param commAreaService - Instância do serviço de dados comuns.
   */

  constructor(
    private commAreaService: CommAreaService,
    private ownerService: OwnerService) {
   }
 

  /**
   * Inicializa o componente para utilização.
   */

  public show(): void {

    const request: ListGroupOwnerRequest = this.commAreaService.data["listGroupOwnerDetailsRequest"];

    this.groupOwnerId = request.groupOwnerId;
    
    delete this.commAreaService.data["listGroupOwnerDetailsRequest"];

    this.ownerService.listOwnerDetails(request).subscribe(
      (response) => {
        this.ownerDetails = response.data;
        console.log(this.ownerDetails);
        
        this.openModal();
      },
    (error) => {
        console.log(error);
    });

  } 
  /**
   * Apresenta o diálogo para visualização do proprietário.
   */

  public openModal(): void {

    $("#ownerDetailDialog").modal({ backdrop: 'static', keyboard: true });

    $("#ownerDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnExit").trigger('focus')
      }, 100);
    })

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#ownerDetailDialog").modal('hide');

  }

}

