import { Component } from '@angular/core';
import { ListTerminalDetailsRequest } from '../../../../payload';
import { TerminalDetail }  from 'src/app/model';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TerminalService } from 'src/app/services/terminal.service';

declare const $: any;

@Component({
  selector: 'rs-terminal-detail',
  templateUrl: './terminal-detail.component.html',
  styleUrls: ['./terminal-detail.component.scss']
})
export class TerminalDetailComponent {
  
  /**
   * Declaração das variáveis membro
   */

  public terminalId: number;
  public terminalDetails: TerminalDetail[];
   

  /**
   * Construtor default do diálogo.
   * 
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param terminalService - Instância do serviço de terminais.
   */

  constructor(
   private commAreaService: CommAreaService,
   private terminalService: TerminalService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  public show(): void {

    const request: ListTerminalDetailsRequest = this.commAreaService.data["listTerminalDetailsRequest"];

    this.terminalId = request.terminalId;

    delete this.commAreaService.data["listTerminalDetailsRequest"];

    this.terminalService.listTerminalDetails(request).subscribe(
      (response) => {
        this.terminalDetails = response.data;
        console.log(this.terminalDetails);
        
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

    $("#terminalDetailDialog").modal({ backdrop: 'static', keyboard: true });

    $("#terminalDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnExit").trigger('focus')
      }, 100);
    })

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#terminalDetailDialog").modal('hide');

  }

}