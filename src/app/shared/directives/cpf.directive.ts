import { Directive, ElementRef, HostListener } from '@angular/core';
import { Formatter } from '../formatters';

/**
 * Diretiva para formatação de cpfs.
 */

@Directive({
  selector: '[rsCpf]'
})
export class CpfDirective {

  /**
   * Declaração das constantes da classe.
   */

  private readonly _ALLOWED_KEYS: string[] = 
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Shift", "Tab", "Backspace"];

  /**
   * Declaração das variáveis membro.
   */

  private _element: any;

  /**
   * Construtor default da classe.
   * 
   * @param el - Referência nativa do elemento.
   */

  constructor(private el: ElementRef) {
    this._element = el.nativeElement;
  }

  /**
   * Recebe o evento keydown do elemento.
   * 
   * @param event - Instância da classe KeyboardEvent.
   */

  @HostListener('keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    
    if (this.checkKey(event)) {
        return;
    }

    event.preventDefault();

  }

  /**
   * Recebe o evento keyup do elemento.
   * 
   * @param event - Instância da classe KeyboardEvent.
   */

  @HostListener('keyup')
  public onKeyUp() {
    this._element.value = Formatter.cpf(this._element.value);
  }
 
  /**
   * Recebe o evento blur do elemento.
   */

  @HostListener('blur')
  public onBlur() {

    let temp: string = Formatter.unFormat(this._element.value);

    if (temp.length > 11) {
        temp = temp.substring(0, 11);
    }

    this._element.value = Formatter.cpf(Formatter.padLeft(temp, "0", 11));

  }

  /**
   * Verifica a validade da tecla pressionada.
   * 
   * @param event - Instância da classe KeyboardEvent.
   */


  private checkKey(event: KeyboardEvent): boolean {

    if (this._ALLOWED_KEYS.indexOf(event.key) !== -1) {
      return true;      
    }

    return false;

  }

}