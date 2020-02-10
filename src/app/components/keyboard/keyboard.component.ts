import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { KeyboardOptions } from 'src/app/model';

declare let $ : any;

@Component({
  selector: 'ng-vk-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})

export class KeyboardComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes do componente.
   */

  private readonly _NUMERIC: string[] = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", '9'
  ];

  private readonly _ACCENTS: any = {
    "aa": ["a", "á", "ã", "â", "à", "ä"],
    "AA": ["A", "Á", "Ã", "Â", "À", "Ä"],
    "ee": ["e", "é", "ê", "è", "ë"],
    "EE": ["E", "É", "Ê", "È", "Ë"],
    "ii": ["i", "í", "î", "ì", "ï"],
    "II": ["I", "Í", "Î", "Ì", "Ï"],
    "oo": ["o", "ó", "ô", "ò", "õ", "ö"],
    "OO": ["O", "Ó", "Ô", "Ò", "Õ", "Ö"],
    "uu": ["u", "ú", "û", "ù", "ü"],
    "UU": ["U", "Ú", "Û", "Ù", "Ü"],
    "cc": ["c", "ç"],
    "CC": ["C", "Ç"]
  }

  /**
   * Declaração das variáveis membro.
   */

  public visible: boolean = false;
  public displayText: string = "";
  public kbType: string = "alpha";
  public shift: number = 0;

  @Output()
  public onEnterClicked: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public onCancelClicked: EventEmitter<any> = new EventEmitter<any>();

  public accents: string[] = [];
  
  private _fieldId: string = "";
  private _value: string = "";
  private _oldValue: string = "";
  private _isPassword: boolean = false;
  private _isNumeric: boolean = false;
  private _maxLength: number = 0;

  /**
   * Construtor default do componente.
   */

  constructor() {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {
  }

  /**
   * Apresenta o teclado virtual.
   * 
   * @param fieldId - Identificador do campo a ser tratado.
   */

  public show(options: KeyboardOptions): void {
    this.visible = true;
    this._fieldId = options.fieldId;
    this._value = options.value || "";
    this._oldValue = this._value;
    this._isPassword = options.isPassword || false;    
    this._isNumeric = options.isNumeric || false;    
    this._maxLength = options.maxLength || 0;
    this.displayText = this._isPassword ? "*".repeat(options.value.length) : options.value;
    this.kbType = options.kbType || "alpha";
  }

  /**
   * Recebe o evento do teclado virtual.
   * 
   * @param value - Valor da tecla pressionada.
   */

  public onKeyClicked(event: MouseEvent, value: string): void {

    this.accents = this._ACCENTS[value];

    if (this.accents) {
        this.showAccents(event);
    }
    else {
        this.singleClick(value);
    }

  }

  /**
   * Trata o evento de click único.
   * 
   * @param value - Valor da tecla pressionada.
   */

  private singleClick(value: string) {

    if (value === "ENTER") {
      this.enterClicked();
      return;
    }

    if (value === "CANCEL") {
      this.cancelClicked();
      return;
    }

    if (value === "ABC") {
        this.kbType = "alpha";
        return;
    }

    if (value === "SPE") {
        this.kbType = "special";
        return;
    }

    if (value === "DEL") {
      const length: number = (this._value.length - 1);
      this._value = this._value.substring(0, length);  
      this.displayText = this._isPassword ? "*".repeat(this._value.length) : this._value;
      return;
    }

    if (value === "SHIFT") {
        this.shift++;
        if (this.shift > 2) {
            this.shift = 0;
        }
        return;
    }

    if (value === "a1") {
        value = "'";
    }

    if (value === "a2") {
        value = '"';
    }

    if (this._maxLength === 0 || 
        this._value.length < this._maxLength) {
        
        if (this._isNumeric) { 
          if (this._NUMERIC.indexOf(value) > -1) {
            this._value += value;
            this.displayText += this._isPassword ? "*" : value;
          }
        }
        else {
          this._value += value;
          this.displayText += this._isPassword ? "*" : value;
      }

    }

    if (this.shift === 1) {
        this.shift = 0;
    }

    let box: any = $(".keyboard-accent-box");

    box.css({ display: 'none' });

  }

  /**
   * Trata o pressionamento da tecla enter.
   */

  private enterClicked() {

    this.onEnterClicked.emit({ "fieldId": this._fieldId, "value": this._value });

    this.hide();

  }

  /**
   * Trata o pressionamento da tecla cancelar.
   */

  private cancelClicked() {

    this.onCancelClicked.emit({ "fieldId": this._fieldId, "value": this._oldValue });

    this.hide();

  }

  /**
   * Trata o evento de click duplo.
   * 
   * @param event - Objeto com os dados do evento.
   */

  public showAccents(event: MouseEvent) {

    let box: any = $(".keyboard-accent-box");

    box.css({ display: 'block', top: event.clientY, left: event.clientX });

  }

  /**
   * Esconde o teclado virtual.
   */

  public hide() {
    this.visible = false;
    this.shift = 0;
  }

  /**
   * Efetua o cleanup do componente.
   */

  ngOnDestroy(): void {
  }

}
