import { DatePipe } from '@angular/common';

    /**
     * Direções de pads disponíveis
     */

    export enum PadDirection {
        LEFT,
        RIGHT
    }

    /**
     * Classe para formatação de dados
     */

    export class Formatter {

    /**
     * Formata o valor informado como um valor.
     * 
     * @param value - Valor ser formatado.
     */

    public static cpf(value: string): string {

        const mask: string = '###.###.###-##'
        const temp: string = Formatter.unFormat(value);

        return Formatter.format(temp, mask);

    }

    /**
     * Formata o valor informado como um valor.
     * 
     * @param value - Valor ser formatado.
     */

    public static cnpj(value: string): string {

        const mask: string = '##.###.###/####-##'
        const temp: string = Formatter.unFormat(value);

        return Formatter.format(temp, mask);

    }

    /**
     * Formata o valor informado como um valor.
     * 
     * @param value - Valor ser formatado.
     */

    public static currency(value: string): string {

        const mask: string = '###.###.###,##'
        const temp: string = Formatter.unFormat(value);

        return Formatter.format(temp, mask);

    }

    /**
     * Formata o valor informado como um valor.
     * 
     * @param value - Valor ser formatado.
     */

    public static datePtBR(value: string | Date): string {

        let temp: string = null;
        const mask: string = '##/##/####'

        if (value instanceof Date) {
            const datePipe: DatePipe = new DatePipe("pt_BR");
            temp = datePipe.transform(value, "ddMMyyyy", "UTC");
        }
        else {
            temp = Formatter.unFormat(value);
        }

        return Formatter.formatLR(temp, mask);

    }

    /**
     * Método genérico para formatação de valores.
     * 
     * @param value - Valor ser formatado.
     * @param mask - Máscara a ser utilizada.
     */

    public static format(value: string, mask: string): string {
    
        let result: string = "";
    
        let index1: number = (value.length - 1);
        let index2: number = (mask.length - 1);
    
        while (true)  {
    
          if (index1 < 0) {
              break;
          }
    
          if (mask[index2] === "#") {
              result = value[index1] + result; index1--; index2--;
          }
          else {
              result = mask[index2] + result; index2--;
          }
    
        }
    
        return result;
    }

    /**
     * Método genérico para formatação de valores.
     * 
     * @param value - Valor ser formatado.
     * @param mask - Máscara a ser utilizada.
     */

    public static formatLR(value: string, mask: string): string {
    
        let result: string = "";
    
        let index1: number = 0;
        let index2: number = 0;
    
        while (true)  {
    
          if (index1 > (value.length - 1)) {
              break;
          }
    
          if (mask[index2] === "#") {
              result += value[index1]; index1++; index2++;
          }
          else {
              result += mask[index2]; index2++;
          }
    
        }
    
        return result;
    }

    /**
     * Remove os caracteres especiais do valor informado.
     * 
     * @param value - Valor a ser desformatado.
     */

    public static unFormat(value: string): string {
        return value.replace(/\W+/gi, "");
    }

    /**
     * Completa o valor com caracteres a esquerda.
     * 
     * @param value - Valor a ser formatado.
     * @param char - Caracter a ser utilizado.
     * @param length - Tamanho máximo do valor.
     */

    public static padLeft(value: string, char: string, length: number): string {
        return Formatter.pad(value, char, length, PadDirection.LEFT);
    }

    /**
     * Completa o valor com caracteres a direita.
     * 
     * @param value - Valor a ser formatado.
     * @param char - Caracter a ser utilizado.
     * @param length - Tamanho máximo do valor.
     */

    public static padRight(value: string, char: string, length: number): string {
        return Formatter.pad(value, char, length, PadDirection.RIGHT);
    }

    /**
     * Completa o valor com o caractere informado na direção desejada.
     * 
     * @param value - Valor a ser formatado.
     * @param char - Caracter a ser utilizado.
     * @param length - Tamanho máximo do valor.
     * @param direction - Direção a ser utilizada.
     */

    public static pad(value: string, char: string, length: number, direction: PadDirection): string {

        if (!value) {
            return value;
        }

        if (value.length === length) {
            return value;
        }

        let result: string = value;

        while (result.length < length) {
            if (direction === PadDirection.LEFT) {
                result = (char + result);
            }
            else if (direction === PadDirection.RIGHT) {
                result = (result + char);
            }
        }

        return result;

    }

}
