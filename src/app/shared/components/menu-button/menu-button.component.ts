import { Component, OnInit, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

declare const $: any;

/**
 * Componente para representação de um botão do menu.
 */

@Component({
  selector: 'rs-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {

  /**
   * Declaração das variáveis membro.
   */

  @Input()
  public name: string = "";

  @Input()
  public accessKey: string = "";

  @Input()
  public title: string = "";

  @Input()
  public route: string = "";

  @Input()
  public disabled: boolean = false;

  @Output()
  public onClick: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Construtor default da classe.
   */

  constructor() {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {
  }

  /**
   * Recebe o evento click do botão.
   * 
   * @param event - Objeto do evento click do botão.
   */

  public doClick(event: any): void {
    this.onClick.emit(event);
  }

}
