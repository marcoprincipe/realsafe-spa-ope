import { Component, OnInit, Input, ElementRef } from '@angular/core';

declare const $: any;

/**
 * Diálogo para apresentação de mensagens informativas.
 */

@Component({
  selector: 'rs-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss']
})
export class TextDialogComponent implements OnInit {

  /**
   * Declaração das variáveis membro.
   */

  @Input()
  public title: string = "Informativo";

  @Input()
  public message: string = "";

  @Input()
  public name: string = "textDialog";

  public messageType: string = "error";

  private isVisible: boolean = false;

  /**
   * Construtor default do diálogo.
   * 
   * @param element - Instância do elemento nativo.
   */

  constructor(private element: ElementRef) { 
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {
  }

  /**
   * Apresenta uma mensagem de sucesso.
   * 
   * @param message - Mensagem a ser apresentada.
   */

  public success(message: string, delay?: number, callback?: Function): void {
    
    this.reset();

    this.messageType = "success";

    this.title = "Sucesso";

    $(".modal-header-dialog").addClass("bg-success text-white");

    this.show(message, delay, callback);

  }

  /**
   * Apresenta uma mensagem informativa.
   * 
   * @param message - Mensagem a ser apresentada.
   */

  public info(message: string, delay?: number, callback?: Function): void {
    
    this.reset();

    this.messageType = "info";

    this.title = "Informativo";

    $(".modal-header-dialog").addClass("bg-info text-white");

    this.show(message, delay, callback);

  }

  /**
   * Apresenta uma mensagem de alerta.
   * 
   * @param message - Mensagem a ser apresentada.
   */

  public warning(message: string, delay?: number, callback?: Function): void {
    
    this.reset();

    this.messageType = "warning";

    this.title = "Atenção";

    $(".modal-header-dialog").addClass("bg-warning text-white");

    this.show(message, delay, callback);

  }

  /**
   * Apresenta uma mensagem de erro.
   * 
   * @param message - Mensagem a ser apresentada.
   */

  public error(message: string, delay?: number, callback?: Function): void {
    
    this.reset();

    this.messageType = "error";

    this.title = "Erro";

    $(".modal-header-dialog").addClass("bg-danger text-white");

    this.show(message, delay, callback);

  }

  /**
   * Apresenta o diálogo de informação.
   */

  public show(message: string, delay?: number, callback?: Function): void {
    
    this.message = message;
    
    if (!this.isVisible) {
        $(`#${this.name}`).modal({ backdrop: "static", keyboard: false });
      }

    this.isVisible = true;

    if (delay && delay > 0) {

      setTimeout(() => {
      
        this.hide();
      
        if (callback) {
            callback();
        }
      
      }, delay);

    }

  }

  /**
   * Inicializa o modal
   */

  private reset(): void {
    $(".modal-header-dialog").removeClass("bg-success text-white");
    $(".modal-header-dialog").removeClass("bg-info text-white");
    $(".modal-header-dialog").removeClass("bg-warning text-white");
    $(".modal-header-dialog").removeClass("bg-danger text-white");
  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {
    
    $(`#${this.name}`).modal('hide');

    this.isVisible = false;  

  }

}
