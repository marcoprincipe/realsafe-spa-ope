import { Directive, ElementRef, Input, HostListener } from '@angular/core';

/**
 * Diretiva para posiciona o foco no campo informado
 */

@Directive({
  selector: '[setFocus]'
})
export class SetFocusDirective {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SET_FOCUS_TIMEOUT: number = 100;

  /**
   * Declaração das variáveis membro
   */

  @Input()
  public setFocus: string;

  private _type: string;

  /**
   * Construtor default da classe.
   * 
   * @param el - Referência nativa do elemento.
   */

  constructor(private el: ElementRef) {
    this._type = this.el.nativeElement.tagName.toLowerCase();
  }

  /**
   * Recebe o evento change do componente
   */

  @HostListener('change', ['$event'])
  private onChange(event: Event) {

    if (this._type !== 'select') {
        return;
    }

    this.doSetFocus();

  }

  /**
   * Recebe o evento keydown do componente.
   */

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent): void {

    if (this._type !== 'input') {
      return;
    }

    if (event.key === 'Enter') {
      this.doSetFocus();
    }

  }

  /**
   * Posiciona o foco no elemento informado
   */

  private doSetFocus() {
    
    const params: any = this.setFocus;

    if (params.allowEmpty === null || 
        params.allowEmpty === undefined) {
        params.allowEmpty = true;
    }

    if (params.allowEmpty === false) {
      const value: string = this.el.nativeElement.value;
      if (!value || value.trim() === "") {
          return;
      }
    }

    const element: any = document.querySelector(`#${params.field}`);

    window.setTimeout(()=> {
      element.focus();
    }, this._SET_FOCUS_TIMEOUT);

  }

}
