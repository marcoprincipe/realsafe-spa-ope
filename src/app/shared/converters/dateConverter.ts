import { Formatter } from '../formatters';

/**
 * Classe para conversão de datas.
 */
export class DateConverter {
    
    /**
     * Converte uma data pt_BR para un_US.
     * 
     * @param ptBRDate - Data no formato pt_BR dd/mm/yyyy.
     */

    public static ptBR2EnUS(ptBRDate: string): string {

        let temp: string = Formatter.unFormat(ptBRDate);
        temp = Formatter.padLeft(temp, "0", 8);

        const result: string = 
            temp.substr(4, 4) + "-" +
            temp.substr(2, 2) + "-" +
            temp.substr(0, 2);

        return result;

    }


}