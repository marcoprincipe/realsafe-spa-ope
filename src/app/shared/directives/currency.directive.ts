import { Directive, ElementRef, HostListener } from '@angular/core';
import { Formatter } from '../formatters';

/**
 * Diretiva para formatação de valores.
 */

@Directive({
  selector: '[currency]'
})
export class CurrencyDirective {

  /**
   * Declaração das constantes da classe.
   */

  private readonly _ALLOWED_KEYS: string[] = 
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
       "Shift", "Tab", "Backspace"];

  /**
   * Construtor default da classe.
   * 
   * @param el - Referência nativa do elemento.
   */

  constructor(private el: ElementRef) {
  }

  /**
   * Recebe o evento keydown do elemento.
   * 
   * @param event - Instância da classe KeyboardEvent.
   */

  @HostListener('keydown', ['$event'])
  public onKeyUp(event: KeyboardEvent) {

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        event.preventDefault();
        return;
    }

    window.setTimeout(() => {

      const result: string = Formatter.currency(this.el.nativeElement.value);
  
      this.el.nativeElement.value = result;
  
    }, 100);

  }

}
