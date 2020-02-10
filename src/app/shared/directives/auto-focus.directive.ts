import { Directive, ElementRef, AfterContentInit } from '@angular/core';

/**
 * Diretiva para definir o foco em um elemento.
 */

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective implements AfterContentInit{

  /**
   * Declaração das constantes da classe
   */

  private readonly _SET_FOCUS_TIMEOUT: number = 250;

  /**
   * Construtor default da classe.
   * 
   * @param el - Elemento para que o foco seja posicionado.
   */

  constructor(private el: ElementRef) {
  }

  /**
   * Recebe o evento de conteúdo inicializado
   */

  ngAfterContentInit(): void {

    window.setTimeout(() => {
      this.el.nativeElement.focus();
    }, this._SET_FOCUS_TIMEOUT)

  }

}
