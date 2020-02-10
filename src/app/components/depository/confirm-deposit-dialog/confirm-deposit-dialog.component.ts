import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BankNoteDeposit } from 'src/app/model';

declare const $: any;

/**
 * Diálogo para apresentação de mensagens de confirmação de depósitos.
 */

@Component({
  selector: 'rs-confirm-deposit-dialog',
  templateUrl: './confirm-deposit-dialog.component.html',
  styleUrls: ['./confirm-deposit-dialog.component.scss']
})
export class ConfirmDepositDialogComponent implements OnInit {

  /**
   * Declaração das variáveis membro.
   */

  @Input()
  public title: string = "Detalhes do depósito";

  @Input()
  public bankNotes: BankNoteDeposit[] = [];

  @Output()
  public onClick: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  public amount: number = 0;

  /**
   * Construtor default do diálogo.
   */

  constructor() {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {
  }

  /**
   * Apresenta o diálogo de confirmação do depósito.
   */

  public show(): void {

    $("#confirmDepositDialog").modal({ backdrop: 'static', keyboard: false });

    $("#confirmDepositDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
        $("#btnYes").trigger('focus')
      }, 100);
    })

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {
    $("#confirmDepositDialog").modal('hide');
  }

  /**
   * Recebe o evento click de um botão.
   * 
   * @param event - Instância do objeto do evento.
   * @param value - Valor a ser enviado ao componente pai.
   */

  public onButtonClicked(event: MouseEvent, value: string) {

    window.setTimeout(() => {
      this.onClick.emit(value);
    }, 100);

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {

    if (event.key !== 'Escape') {
        return;
    }

    this.onButtonClicked(null, "N");

    event.stopPropagation();

  }

}
