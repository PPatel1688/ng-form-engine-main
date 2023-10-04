import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: '[appNumbersOnly]',
})
export class NumbersOnlyDirective {
    @Input("negative") negative: boolean = false;

    private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    private specialKeys: Array<string> = [
        'Backspace',
        'Tab',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowRight',
        'Del',
        'Delete',
    ];
    private negativeKeys: Array<string> = ['-'];

    constructor(private el: ElementRef) { }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if(this.negative) {
            if (this.specialKeys.indexOf(event.key) !== -1 || this.negativeKeys.indexOf(event.key) !== -1) {
                return;
            }
        } else {
            if (this.specialKeys.indexOf(event.key) !== -1) {
                return;
            }
        }
        
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}