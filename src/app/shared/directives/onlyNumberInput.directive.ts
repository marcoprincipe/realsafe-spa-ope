import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

/**
 * Diretiva para permitir apenas a digitação de números
 */

@Directive({
    selector: '[onlyNumbersInput]',
})
export class OnlyNumbersInputDirective {
    private el: NgControl;

    constructor(private ngControl: NgControl) {
        this.el = ngControl;
    }

    @HostListener('input', ['$event.target.value'])
    oninput(value: string) {
        this.el.control.patchValue(value.replace(/[^0-9]/g, ''));
    }

}