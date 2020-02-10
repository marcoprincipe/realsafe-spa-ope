/**
 * Interface com as opções para apresentação do teclado.
 */

export interface KeyboardOptions {
    fieldId: string,
    value?: string,
    isPassword?: boolean,
    isNumeric?: boolean,
    maxLength?: number,
    kbType?: string
}