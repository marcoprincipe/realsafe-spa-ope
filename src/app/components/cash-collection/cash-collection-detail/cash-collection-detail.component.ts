import { Component, OnInit, HostListener, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TransactionLog, ListDepositDetailsRequest, ListCashCollectionDetailsRequest, PrintCollectCashReceiptRequest } from 'src/app/payload';
import { Router } from '@angular/router';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CashCollectionService } from 'src/app/services/cash-collection.service';

declare const $: any;

/**
 * Componente para apresentação dos detalhes do recolhimento de numerário.
 */

@Component({
  selector: 'rs-cash-collection-detail',
  templateUrl: './cash-collection-detail.component.html',
  styleUrls: ['./cash-collection-detail.component.scss']
})
export class CashCollectionDetailComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _TAB_MAX_ROWS: number = 5;
  private readonly _ALLOWED_KEYS: string[] = 
        ["0", "1", "2", "3",  "4", "5", "6", "7", "8", "9", 
         "n", "N", "p", "P", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Escape"];

  /**
   * Declaração das variáveis membro.
   */

  public page: number = 1;
  public pages: number = 0;
  public bankNotes: number = 0;
  public amount: number = 0;

  public dateTime: Date;
  public nsuTerminal: string;
  public unitName: string;
  public terminalId: string;
  public userName: string;

  public isDepositDetail: boolean = false;

  public _cache: Array<TransactionLog>;
  public transactionLogs: Array<TransactionLog>;

  @Input()
  public visible: boolean = false;

  @Input()
  public printReceipt: string = 'N';

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param cashCollectionService - Instância do serviço de recolhimento de numerário.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
    private cashCollectionService: CashCollectionService,
    private timeoutService: TimeoutService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    const request: ListCashCollectionDetailsRequest = this.commAreaService.data["listCashCollectionDetails"];

    this.unitName = request.unitName;
    this.dateTime = request.dateTime;
    this.nsuTerminal = request.cashCollectionNsu;
    this.terminalId = request.terminalId;
    this.userName = request.userName;
    this.bankNotes = request.bankNotes;
    this.amount = request.amount;

    delete this.commAreaService.data["listCashCollectionDetails"];

    this.cashCollectionService.listCashCollectionDetails(request).subscribe(
      (response) => {
        this.showCashCollectionDetails(response.data.transactionLogs);
      },
    (error) => {
        console.log(error);
    });

  }

  /**
   * Apresenta os depósitos pendentes de recolhimento.
   * 
   * @param transactionLogs - Lista de depósitos pendentes de recolhimento.
   */

  private showCashCollectionDetails(transactionLogs: Array<TransactionLog>) {

    this._cache = transactionLogs;

    this.pages = Math.ceil(this._cache.length / this._TAB_MAX_ROWS);

    this.paginate();

    $("#cashCollectionDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $('#btnExitCashCollectionDetail').focus();
      }, 250);
    })

    $("#cashCollectionDetailDialog").modal({ backdrop: 'static', keyboard: true });

  }

  /**
   * Avança para a próxima página.
   */

  public previousPage(): void {

    this.page -= 1;

    if (this.page < 1) {
        this.page = 1;
    }

    this.paginate();

  }

  /**
   * Avança para a próxima página.
   */

  public nextPage(): void {

    this.page += 1;

    if (this.page > this.pages) {
        this.page = this.pages;
    }

    this.paginate();

  }

  /**
   * Posiciona na página informada.
   * 
   * @param page - Página a ser apresentada.
   */

  public gotoPage(page: number) {

    if (page <= 0 || page > this.pages) {
        return;
    }

    this.page = page;

    this.paginate();

  }

  /**
   * Efetua a paginação para a página informada.
   * 
   * @param page - Número da página.
   */

  public paginate(): void {

    const start: number = (this.page * this._TAB_MAX_ROWS) - this._TAB_MAX_ROWS;
    const end: number = (start + this._TAB_MAX_ROWS);

    this.transactionLogs = this._cache.slice(start, end);

  }

  /**
   * Apresenta a lista de detalhes de depósito.
   * 
   * @param index - Índice do item no array.
   */

  public listDepositDetails(index: number) {

    const request: ListDepositDetailsRequest = {
        dateTime: this.transactionLogs[index].dateTime,
        nsuTerminal: this.transactionLogs[index].nsuTerminal,
        unitName: this.transactionLogs[index].unitName,
        terminalId: this.transactionLogs[index].terminalId,
        userName: this.transactionLogs[index].userName,
        amount: this.transactionLogs[index].amount
    }

    this.commAreaService.data["listDepositDetailRequest"] = request;

    this.isDepositDetail = true;

  }

  /**
   * Efetua a impressão do comprovante do recolhimento de numerário.
   */

  public doPrintReceipt(): void {

    const request: PrintCollectCashReceiptRequest = {
      nsuTerminal: this.nsuTerminal,
      terminalId: this.commAreaService.terminal.terminalId,
      companyName: this.commAreaService.userCompany.companyName,
      unitName: this.commAreaService.userUnit.unitName,
      userName: this.userName,
      dateTime: this.dateTime,
      amount: this.amount,
      transactionLogs: this._cache
    };

    this.cashCollectionService.printCollectCashReceipt(request).subscribe(
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

    this.timeoutService.reset();

    if (this.isDepositDetail) {
        return;
    }

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        return;
    }

    if (event.key === 'Escape') {
        this.hide();
        return;
    }

    if (event.key === "n" || 
        event.key === "N" || 
        event.key === "ArrowRight") {
        this.nextPage(); return;
    }
    
    if (event.key === "p" || 
        event.key === "P" || 
        event.key === "ArrowLeft") {
        this.previousPage(); return;
    }

    if (event.key === "ArrowUp") {
        this.gotoPage(1); return;
    }

    if (event.key === "ArrowDown") {
      this.gotoPage(this.pages); return;
    }

    this.gotoPage(Number(event.key));

  }

  /**
   * Recebe o evento mousedown do documento.
   */

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: any) {
    this.timeoutService.reset();
  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#cashCollectionDetailDialog").modal('hide');

    this.visible = false;
    this.visibleChange.emit(this.visible);

  }

  /**
   * Recebe o evento de fechamento do modal de detalhes do depósito.
   */

  public onCloseDepositDetail(): void {

    setTimeout(() => {
      $('#btnExitCashCollectionDetail').focus();
    }, 250);

  }

  /**
   * Retorna para a tela de menu
   */

  public goBack() {
      this.router.navigate(['menu']);
  }

  /**
   * Retorna para a tela de login
   */

  public goLoginPage() {
      this.router.navigate(['login']);
  }

  /**
   * Efetua o cleanup do componente.
   */

  ngOnDestroy(): void {

    this.isDepositDetail = false;

  }

}
