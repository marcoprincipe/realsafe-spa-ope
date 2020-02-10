import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';

declare const $: any;

/**
 * Diálogo para apresentação de mensagens de confirmação.
 */

@Component({
  selector: 'rs-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  /**
   * Declaração das variáveis membro.
   */

  @Input()
  public title: string = "Confirmar";

  @Input()
  public message: string = "";

  @Output()
  public onClick: EventEmitter<string> = new EventEmitter<string>();

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
   * Apresenta o diálogo de confirmação.
   */

  public show(): void {

    $('#confirmDialog').on('shown.bs.modal', function () {
      $('#btnYes').trigger('focus')
    })

    $("#confirmDialog").modal({ backdrop: 'static', keyboard: false });

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {
    $("#confirmDialog").modal('hide');
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
    }, 250);

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {

    if (event.key !== 'Escape') {
        return;
    }

    this.onButtonClicked(null, "N");

    event.stopPropagation();

  }

}