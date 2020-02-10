import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { messages } from '../../messages/AppMessages';
import { Router } from '@angular/router';
import { TransactionLog, GetOpeningDetailRequest, ListDepositDetailsRequest, GetClosingDetailRequest, ListCashCollectionDetailsRequest, SearchTransactionLogRequest } from 'src/app/payload';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Formatter } from 'src/app/shared/formatters';
import { DateConverter } from 'src/app/shared/converters';
import { DateValidator } from 'src/app/shared/validators';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TransactionLogService } from 'src/app/services/transaction-log.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  nsuTerminal: string,
  startDate: string,
  endDate: string
}

/**
 * Componente para reimpressão de comprovantes.
 */

@Component({
  selector: 'rs-voucher-reprint',
  templateUrl: './voucher-reprint.component.html',
  styleUrls: ['./voucher-reprint.component.scss'],
  providers: [ TimeoutService ]
})
export class VoucherReprintComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _TAB_MAX_ROWS: number = 5;
  private readonly _ALLOWED_KEYS: string[] = 
        ["0", "1", "2", "3",  "4", "5", "6", "7", "8", "9", 
         "n", "N", "p", "P", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Escape"];

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  /**
   * Instância do teclado virtual.
   */

  @ViewChild(KeyboardComponent)
  private _keyboardComponent: KeyboardComponent;

  /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    nsuTerminal: "",
    startDate: "",
    endDate: ""
  };

  public confirmationData: any = {
    title: "Reimprimir o comprovante ?",
    bankNotes: [],
    amount: 0
  };
  
  public useVK: boolean = true;
  
  public page: number = 1;
  public pages: number = 0;

  public isShowFilter: boolean = true;
  public isShowTransactions: boolean = false;
  public isDepositDetail: boolean = false;
  public isOpeningDetail: boolean = false;
  public isClosingDetail: boolean = false;
  public isCashCollectionDetail: boolean = false;

  public _cache: Array<TransactionLog>;
  public transactionLogs: Array<TransactionLog>;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param transactionLogService - Instância do serviço de log de transações.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private appConfigService: AppConfigService,
    private commAreaService: CommAreaService,
    private transactionLogService: TransactionLogService,
    private timeoutService: TimeoutService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.timeoutService.onTimeout(() => {
      this.goLoginPage();
    });

    this.useVK = this.appConfigService.useVK;

    this.setFocus("nsuTerminal");

  }

  /**
   * Apresenta o teclado virtual.
   * 
   * @param params - Parâmetros a serem passados para o teclado virtual.
   */

  public showKeyboard(params: any) {

    if (this.useVK) {
        const value: string = $(`#${params.fieldId}`).val();
        this._keyboardComponent.show({ 
        "fieldId": params.fieldId, 
        "value": Formatter.unFormat(value) || "", 
        "isPassword": params.isPassword || false, 
        "isNumeric": params.isNumeric || false, 
        "maxLength": params.maxLength || 0,
        "kbType": params.kbType || "alpha" });
    }
  
  }

  /**
   * Recebe o evento do pressionamento da tecla enter no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onEnterClicked(event: any) {
    if (event.fieldId === "startDate" || event.fieldId === "endDate") {
      this.form[`${event.fieldId}`] = Formatter.datePtBR(Formatter.padLeft(event.value, "0", 8));
    }
    else {
      this.form[`${event.fieldId}`] = event.value;
    }
    $(`#${event.fieldId}`).focus();
  }

  /**
   * Recebe o evento do pressionamento da tecla cancelar no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onCancelClicked(event: any) {
    this.form[`${event.fieldId}`] = event.value;
    $(`#${event.fieldId}`).focus();
  }

  /**
   * Recebe o evento click do botão confirmar da pesquisa.
   */

  public onConfirmSearch() {

    let startDate: string = null;
    let endDate: string = null;

    if (this.form.nsuTerminal) {
        if (!this.checkNSU()) {
          this._textDialog.error(messages["invalid.nsu.format"], this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("nsuTerminal");
          });
          return;
        }
    }

    if (this.form.startDate) {
        if (!DateValidator.validatePtBR(this.form.startDate)) {
          this._textDialog.error(messages["invalid.start.date"], this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("startDate");
          });
          return;
        }
    }

    if (this.form.endDate) {
      if (!DateValidator.validatePtBR(this.form.endDate)) {
        this._textDialog.error(messages["invalid.end.date"], this._SHOW_MESSAGE_DELAY, () => {
          this.setFocus("endDate");
        });
        return;
      }
    }

    if (this.form.startDate) {
      startDate = DateConverter.ptBR2EnUS(this.form.startDate);
    }

    if (this.form.endDate) {
      endDate = DateConverter.ptBR2EnUS(this.form.endDate);
    }

    const request: SearchTransactionLogRequest = {
        groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
        nsuTerminal: this.form.nsuTerminal,
        startDate: startDate,
        endDate: endDate
    }

    this.page = 1;

    this.transactionLogService.searchTransactionLog(request).subscribe(
      (response) => {
        if (response.data.transactionLogs.length > 0) {
          this.showTransactionLogs(response.data.transactionLogs);
        }
        else {
          this._textDialog.info(messages["no.vouchers.found"], this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("nsuTerminal");
          });
        }
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("nsuTerminal");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("nsuTerminal");
          });
        }
      }
    );

  }

  /**
   * Verifica o NSU informado.
   */

  private checkNSU(): boolean {

    const pattern: RegExp = /^([A-Z]{3})([0-9]{12})$/;

    if (!pattern.test(this.form.nsuTerminal)) {
        return false;
    }

    return true;

  }

  /**
   * Apresenta os logs de transação.
   * 
   * @param transactionLogs - Lista de transações.
   */

  private showTransactionLogs(transactionLogs: Array<TransactionLog>): void {

    this.isShowFilter = false;
    this.isShowTransactions = true;

    this._cache = transactionLogs;

    this.pages = Math.ceil(this._cache.length / this._TAB_MAX_ROWS);

    this.paginate();

  } 

  /**
   * Recebe o evento click do botão cancelar da pesquisa.
   */

  public onCancelSearch() {

    this.goBack();

  }

  /**
   * Recebe o evento click do botão cancelar da lista de transações.
   */

  public onCancelList() {

    this.isShowTransactions = false;
    this.isShowFilter = true;

  }

  /**
   * Habilita ou desabilita o botão de confirmação.
   */

  public disableConfirmSearchButton() {

    if (!this.form.nsuTerminal && 
        !this.form.startDate && 
        !this.form.endDate) {
        return true;
    }

    if (this.form.startDate && 
        !this.form.endDate) {
        return true;
    }

    if (this.form.endDate && 
      !this.form.startDate) {
      return true;
    }

    return false;

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

  public listDepositDetail(index: number) {

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
   * Apresenta os dados do detalhe da abertura do terminal.
   * 
   * @param index - Índice do item no array.
   */

  public getOpeningDetail(index : number) {

    const request: GetOpeningDetailRequest = {
      dateTime: this.transactionLogs[index].dateTime,
      nsuTerminal: this.transactionLogs[index].nsuTerminal,
      unitName: this.transactionLogs[index].unitName,
      terminalId: this.transactionLogs[index].terminalId,
      userName: this.transactionLogs[index].userName,
  }

    this.commAreaService.data["getOpeningDetailRequest"] = request;

    this.isOpeningDetail = true;

  }

  /**
   * Apresenta os dados do detalhe do fechamento do terminal.
   * 
   * @param index - Índice do item no array.
   */

  public getClosingDetail(index : number) {

    const request: GetClosingDetailRequest = {
      dateTime: this.transactionLogs[index].dateTime,
      nsuTerminal: this.transactionLogs[index].nsuTerminal,
      unitName: this.transactionLogs[index].unitName,
      terminalId: this.transactionLogs[index].terminalId,
      userName: this.transactionLogs[index].userName,
  }

    this.commAreaService.data["getClosingDetailRequest"] = request;

    this.isClosingDetail = true;

  }

  /**
   * Apresenta a lista de detalhes de depósito.
   * 
   * @param index - Índice do item no array.
   */

  public listCashCollectionDetails(index: number) {

    const request: ListCashCollectionDetailsRequest = {
        dateTime: this.transactionLogs[index].dateTime,
        unitName: this.transactionLogs[index].unitName,
        terminalId: this.transactionLogs[index].terminalId,
        userName: this.transactionLogs[index].userName,
        cashCollectionNsu: this.transactionLogs[index].nsuTerminal,
        bankNotes: this.transactionLogs[index].bankNotes,
        amount: this.transactionLogs[index].amount
    }

    this.commAreaService.data["listCashCollectionDetails"] = request;

    this.isCashCollectionDetail = true;

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    this.timeoutService.reset();

    if (this.isCashCollectionDetail) {
      return;
    }

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        return;
    }

    if (event.key === 'Escape') {
      if (this.isShowTransactions) {
          this.isShowTransactions = false;
          this.isShowFilter = true;
      }
      else {
        if (!this.isOpeningDetail && !this.isClosingDetail && 
            !this.isDepositDetail && !this.isCashCollectionDetail) {
            this.goBack();
        }
      }
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
   * Retorna para a tela de menu
   */

  public goBack() {

      this.router.navigate(['menu']);
      
  }

  /**
   * Retorna para a tela de login
   */

  public goLoginPage() {

    setTimeout(()=> {
      this.router.navigate(['login']);
    }, 250);

  }
 
  /**
   * Efetua o cleanup dos recursos do componente.
   */

  ngOnDestroy(): void {

    this.isDepositDetail = false;
    this.isOpeningDetail = false;
    this.isClosingDetail = false;
    this.isCashCollectionDetail = false;

    this.timeoutService.stop();

  }

  /**
   * Posiciona o foco no campo informado.
   * 
   * @param fieldId - Identificador do campo para posicinamento.
   */

  private setFocus(fieldId: string): void {

    setTimeout(() => {
      $(`#${fieldId}`).focus();
    }, 250);

  }

}
