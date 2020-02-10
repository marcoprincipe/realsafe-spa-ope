import { Component } from '@angular/core';
import { ListGroupDetailsRequest } from '../../../../payload/group-details/list-group-details-request';
import { GroupDetail }  from 'src/app/model/group-detail';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { GroupService } from 'src/app/services/group.service';

declare const $: any;

@Component({
  selector: 'rs-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent {

  /**
   * Declaração das variáveis membro
   */

  public groupId: number;
  public groupDetails: GroupDetail[];
   

  /**
   * Construtor default do diálogo.
   * 
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param groupService - Instância do serviço de grupos.
   */

  constructor(
   private commAreaService: CommAreaService,
   private groupService: GroupService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  public show(): void {

    const request: ListGroupDetailsRequest = this.commAreaService.data["listGroupDetailsRequest"];

    this.groupId = request.groupId;

    delete this.commAreaService.data["listGroupDetailsRequest"];

    this.groupService.listGroupDetails(request).subscribe(
      (response) => {
        this.groupDetails = response.data;
        console.log(this.groupDetails);
        
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

    $("#groupDetailDialog").modal({ backdrop: 'static', keyboard: true });

    $("#groupDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnExit").trigger('focus')
      }, 100);
    })

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#groupDetailDialog").modal('hide');

  }

}