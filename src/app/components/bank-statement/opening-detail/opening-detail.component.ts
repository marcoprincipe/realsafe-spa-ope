import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { OpeningDetail } from 'src/app/model';
import { GetOpeningDetailRequest, PrintOpenTerminalReceiptRequest } from 'src/app/payload';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TerminalService } from 'src/app/services/terminal.service';

declare const $: any;

/**
 * Diálogo para apresentação dos detalhes da abertura do terminal.
 */

 @Component({
  selector: 'rs-opening-detail',
  templateUrl: './opening-detail.component.html',
  styleUrls: ['./opening-detail.component.scss']
})
export class OpeningDetailComponent implements OnInit {

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
  
  public openingDetail: OpeningDetail = {
    nsuTerminal: "",
    accountingDate: null,
	  openingDateTime: null,
	  bankNotesInSafe: 0,
	  amountInSafe: 0.00,
	  lastClosingDateTime: null,
	  lastClosingBanknotes: 0,
    lastClosingAmount: 0.00,
    etvClosing: "N"
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

    const request: GetOpeningDetailRequest = this.commAreaService.data["getOpeningDetailRequest"];

    this.dateTime = request.dateTime;
    this.nsuTerminal = request.nsuTerminal;
    this.unitName = request.unitName;
    this.terminalId = request.terminalId;
    this.userName = request.userName;

    delete this.commAreaService.data["getOpeningDetailRequest"];

    this.terminalService.getOpeningDetail(request).subscribe(
      (response) => {
        this.openingDetail = response.data.openingDetail;
        this.show();
      },
    (error) => {
        console.log(error);
    });

  }

  /**
   * Apresenta o diálogo de detalhes da abertura.
   */

  public show(): void {

    $("#etvClosing").prop("checked", this.openingDetail.etvClosing === "Y");

    $("#openingDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnExit").trigger('focus')
      }, 100);
    })

    $("#openingDetailDialog").modal({ backdrop: 'static', keyboard: true });

  }

  /**
   * Efetua a impressão do comprovante de abertura do terminal.
   */

  public doPrintReceipt(): void {

    const request: PrintOpenTerminalReceiptRequest = {
      nsu: this.nsuTerminal,
      unitName: this.unitName,
      companyName: this.commAreaService.userCompany.companyName,
      userName: this.userName,
      terminalId: this.terminalId,
      dateTime: this.openingDetail.openingDateTime,
      amount: this.openingDetail.amountInSafe
    };

    this.terminalService.printOpenTerminalReceipt(request).subscribe(
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

    $("#openingDetailDialog").modal('hide');

    this.visible = false;
    this.visibleChange.emit(this.visible);

  }

}
