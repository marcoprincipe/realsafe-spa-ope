import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { ListDepositDetailsRequest, PrintDepositReceiptRequest } from '../../../payload'
import { DepositDetail, BankNoteDeposit } from 'src/app/model';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TransactionLogService } from 'src/app/services/transaction-log.service';
import { DepositService } from 'src/app/services/deposit.service';

declare const $: any;

/**
 * Diálogo para apresentação de detalhes de depósitos.
 */

@Component({
  selector: 'rs-deposit-detail',
  templateUrl: './deposit-detail.component.html',
  styleUrls: ['./deposit-detail.component.scss']
})
export class DepositDetailComponent implements OnInit {

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
  public depositDetails: DepositDetail[];
  public amount: number = 0;
  public bankNotes: number = 0;

  @Input()
  public visible: boolean = false;

  @Input()
  public printReceipt: string = 'N';

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public onModalHide: EventEmitter<void> = new EventEmitter<void>();
  
  /**
   * Construtor default do diálogo.
   * 
   * @param transactionLogService - Instância do serviço de logs de transações.
   * @param depositService - Instância do serviço de depósitos.
   * @param commAreaService - Instância do serviço de dados comuns.
   */

  constructor(
    private transactionLogService: TransactionLogService,
    private depositService: DepositService,
    private commAreaService: CommAreaService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit(): void {

    const request: ListDepositDetailsRequest = this.commAreaService.data["listDepositDetailRequest"];

    this.dateTime = request.dateTime;
    this.nsuTerminal = request.nsuTerminal;
    this.unitName = request.unitName;
    this.terminalId = request.terminalId;
    this.userName = request.userName;
    this.amount = request.amount;

    delete this.commAreaService.data["listDepositDetailRequest"];

    this.transactionLogService.listDepositDetails(request).subscribe(
      (response) => {
        this.depositDetails = response.data.depositDetails;
        this.show();
      },
    (error) => {
        console.log(error);
    });

  }

  /**
   * Apresenta o diálogo de confirmação do depósito.
   */

  public show(): void {

    this.bankNotes = 0;

    this.depositDetails.forEach((item) => {
      this.bankNotes += item.quantity;
    });

    $("#depositDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
          $("#btnExit").trigger('focus')
        }, 100);
    })

    $("#depositDetailDialog").modal({ backdrop: 'static', keyboard: true });

  }

  /**
   * Imprime o comprovante do depósito.
   */

  public doPrintReceipt(): void {

    const notes: Array<BankNoteDeposit> = new Array<BankNoteDeposit>();

    this.depositDetails.forEach((item) => {
      const note: BankNoteDeposit = {
        quantity: item.quantity,
        value: item.amount,
        total: (item.quantity * item.amount)
      };
      notes.push(note);
    });

    const request: PrintDepositReceiptRequest = {
      nsuTerminal: this.nsuTerminal,
      companyName: this.commAreaService.userUnit.companyName,
      unitName: this.commAreaService.userUnit.unitName,
      userName: this.userName,
      terminalId: this.terminalId,
      dateTime: this.dateTime,
      bankNotes: notes,
      amount: this.amount
    };

    this.depositService.printReceipt(request).subscribe(
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
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#depositDetailDialog").modal('hide');

    this.visible = false;
    this.visibleChange.emit(this.visible);

    this.onModalHide.emit();

  }

}
