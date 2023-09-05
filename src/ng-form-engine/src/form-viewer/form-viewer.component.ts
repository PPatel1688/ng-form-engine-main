import { Component, HostListener, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
    selector: "ng-form-viewer",
    templateUrl: "./form-viewer.component.html",
    styleUrls: ["./form-viewer.component.scss"],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormViewerComponent {

}