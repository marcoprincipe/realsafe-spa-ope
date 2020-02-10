import { Component } from '@angular/core';
import { ListUnitDetailsRequest } from '../../../../payload';
import { UnitDetail }  from 'src/app/model/unit-detail';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { UnitService } from 'src/app/services/unit.service';

declare const $: any;

@Component({
  selector: 'rs-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent  {

  /**
   * Declaração das variáveis membro
   */

  public unitId: number;
  public unitDetails: UnitDetail[];
   

  /**
   * Construtor default do diálogo.
   * 
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param unitService - Instância do serviço de filiais.
   */

  constructor(
   private commAreaService: CommAreaService,
   private unitService: UnitService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  public show(): void {

    const request: ListUnitDetailsRequest = this.commAreaService.data["listUnitDetailsRequest"];

    this.unitId = request.unitId;

    delete this.commAreaService.data["listUnitDetailsRequest"];

    this.unitService.listUnitDetails(request).subscribe(
      (response) => {
        this.unitDetails = response.data;
        console.log(this.unitDetails);
        
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

    $("#unitDetailDialog").modal({ backdrop: 'static', keyboard: true });

    $("#unitDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnExit").trigger('focus')
      }, 100);
    })

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#unitDetailDialog").modal('hide');

  }

}