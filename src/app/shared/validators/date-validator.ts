import { Formatter } from '../formatters';

/**
 * Classe para validação de datas.
 */

export class DateValidator {

    /**
     * Efetua a validação da data informada.
     * 
     * @param date - Data no formato dd/MM/yyyy a ser validada.
     */

    public static validatePtBR(date: string): boolean {

        const pattern: RegExp = /^(\d{2})\/(\d{2})\/(\d{4})$/; 

        if (!pattern.test(date)) {
            return false;
        }

        const temp: string = Formatter.padLeft(Formatter.unFormat(date), "0", 8);

        const day: number = Number(temp.substr(0 ,2));
        const month: number = Number(temp.substr(2 ,2));
        const year: number = Number(temp.substr(4 ,4));

        if (day < 1 || day > 31) {
            return false;
        }

        if (month < 1 || month > 12) {
            return false;
        }

        const isLeap: boolean = (((year % 4) === 0 && (year % 100 !== 0)) || ((year % 4 !== 0) && (year % 400) === 0));

        if (month === 2) {
            if (isLeap) {
                if (day > 29) {
                    return false;
                }
            }
            else {
                if (day > 28) {
                    return false;
                }
            }
        }

        return true;

    }

}