import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ClosingDetail } from 'src/app/model';
import { GetClosingDetailRequest, PrintCloseTerminalReceiptRequest } from 'src/app/payload';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TerminalService } from 'src/app/services/terminal.service';

declare const $: any;

/**
 * Diálogo para apresentação dos detalhes do fechamento do terminal.
 */

@Component({
  selector: 'rs-closing-detail',
  templateUrl: './closing-detail.component.html',
  styleUrls: ['./closing-detail.component.scss']
})
export class ClosingDetailComponent implements OnInit {

  /**
   * Declaração das constantes da classe
   */

  private readonly _ALLOWED_KEYS: string[] = ["Escape"];

  /**
   * Declaração das variáveis membro
   */

  public dateTime: Date;
  public nsuTerminal: string;
  public unitName: string;
  public terminalId: string;
  public userName: string;

  public closingDetail: ClosingDetail = {
    nsuTerminal: "",
	  closingDateTime: null,
	  bankNotesInSafe: 0,
	  amountInSafe: 0.00,
	  lastOpeningDateTime: null,
	  lastOpeningBanknotes: 0,
	  lastOpeningAmount: 0.00
  };

  @Input()
  public visible: boolean = false;

  @Input()
  public printReceipt: string = 'N';

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Construtor default do diálogo.
   * 
   * @param terminalService - Instância do serviço de terminais.
   * @param commAreaService - Instância do serviço de dados comuns.
   */

  constructor(
    private terminalService: TerminalService,
    private commAreaService: CommAreaService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit(): void {

    const request: GetClosingDetailRequest = this.commAreaService.data["getClosingDetailRequest"];

    this.dateTime = request.dateTime;
    this.nsuTerminal = request.nsuTerminal;
    this.unitName = request.unitName;
    this.terminalId = request.terminalId;
    this.userName = request.userName;

    delete this.commAreaService.data["getClosingDetailRequest"];

    this.terminalService.getClosingDetail(request).subscribe(
      (response) => {
        this.closingDetail = response.data.closingDetail;
        this.show();
      },
    (error) => {
        console.log(error);
    });

  }

  /**
   * Apresenta o diálogo de detalhes do fechamento.
   */

  public show(): void {

    $("#closingDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnExit").trigger('focus')
      }, 100);
    })

    $("#closingDetailDialog").modal({ backdrop: 'static', keyboard: true });

  }

  /**
   * Efetua a impressão do comprovante de fechamento do terminal.
   */

  public doPrintReceipt(): void {

    const request: PrintCloseTerminalReceiptRequest = {
      nsu: this.nsuTerminal,
      unitName: this.unitName,
      terminalId: this.commAreaService.terminal.terminalId,
      companyName: this.commAreaService.userCompany.companyName,
      userName: this.userName,
      dateTime: this.closingDetail.closingDateTime,
      amount: this.closingDetail.amountInSafe
    };

    this.terminalService.printCloseTerminalReceipt(request).subscribe(
      (response) => {
        this.hide();
      },
      (error) => {
        this.hide();
      }
    );
  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        return;
    }

    if (event.key === 'Escape') {
        this.hide();
    }
  
  }

  /**
   * Esconde o diálogo de detalhes.
   */

  public hide(): void {

    $("#closingDetailDialog").modal('hide');

    this.visible = false;
    this.visibleChange.emit(this.visible);

  }  
  
}
