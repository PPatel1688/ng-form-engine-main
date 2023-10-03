import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import FrameWrapper from "../common/frameWrapper";
import { NgForm } from "@angular/forms";

@Component({
    selector: "ng-form-builder",
    templateUrl: "./form-builder.component.html",
    styleUrls: ["./form-builder.component.scss"],
    providers: [],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class FormBuilderComponent extends FrameWrapper implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('refFrameWrapper') refFrameWrapper?: ElementRef<any>;
    @ViewChild('refPlaceHolder') refPlaceHolder?: ElementRef<any>;
    @ViewChild('refHoverFrame') refHoverFrame?: ElementRef<any>;
    @ViewChild('refToolBar') refToolBar?: ElementRef<any>;

    @ViewChild('refPanelBlock') refPanelBlock?: ElementRef<any>;
    @ViewChild('refPanelStyle') refPanelStyle?: ElementRef<any>;

    @ViewChild('ngContext') ngContext?: NgForm;

    _onChangeSubscription: any = null;

    public toolBarAction: any = "block";
    public isValid: any = false;
    /****/

    get nePlaceHolder() {
        return this.refPlaceHolder?.nativeElement as HTMLElement;
    }

    get neHoverFrame() {
        return this.refHoverFrame?.nativeElement as HTMLElement;
    }

    get neToolBar() {
        return this.refToolBar?.nativeElement as HTMLElement;
    }

    get nePanelBlock() {
        return this.refPanelBlock?.nativeElement as HTMLElement;
    }

    get nePanelStyle() {
        return this.refPanelStyle?.nativeElement as HTMLElement;
    }

    get isSelected() {
        return this.selected != null;
    }

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.ngContext?.form.valueChanges.subscribe((value) => {
            console.log("test", value);
            this.changeDetectorRef.detectChanges();
        });
    }

    ngAfterViewInit() {
        this.nePanelBlock.style.display = "block";
        this.nePanelStyle.style.display = "none";
        this._initializeEditor();
    }

    _initializeEditor() {
        let that = this;
        that.initFrame(this.refFrameWrapper?.nativeElement);
        that._onChangeSubscription = that.onChange.subscribe(that._onEditorChange.bind(that));
        that.toolBarAction = "block";
    }
    /**************************/
    _onEditorChange(event: any) {
        if (event == null) {
            return;
        }
        switch (event.element) {
            case "toolbar":
                this._setToolbarStyle(event.data);
                break;
            case "hoverframe":
                this._setHoverFrameStyle(event.data);
                break;
            case "placeholder":
                this._setPlaceHolderStyle(event.data);
                break;
            case "selected":
                this.onToolbarAction('style');
                break;
            default:
                break;
        }
    }

    _setToolbarStyle(data: any) {
        this.neToolBar.style.display = data.display;
        let element = data.clientRect;
        if (element) {
            this.neToolBar.style.top = element.top + 'px';
            this.neToolBar.style.left = element.left + 'px';
            this.neToolBar.style.width = element.width + 'px';
            this.neToolBar.style.height = element.height + 'px';

            let toolbar = this.neToolBar.getElementsByClassName("fe-toolbar")[0] as HTMLElement;
            let bToolbar = toolbar.getBoundingClientRect();

            toolbar.style.top = element.height + 'px';
            toolbar.style.left = (element.width - bToolbar.width) + '0px';

            //this.onToolbarAction('style');
        }
    }

    _setHoverFrameStyle(data: any) {
        this.neHoverFrame.style.display = data.display;
        let element = data.clientRect;
        if (element) {
            this.neHoverFrame.style.top = element.top + 'px';
            this.neHoverFrame.style.left = element.left + 'px';
            this.neHoverFrame.style.width = element.width + 'px';
            this.neHoverFrame.style.height = element.height + 'px';

            let badge = this.neHoverFrame.getElementsByClassName("fe-badge")[0] as HTMLElement;
            let badgeName = this.neHoverFrame.getElementsByClassName("fe-badge__name")[0] as HTMLElement;
            badge.style.top = element.height + 'px';
            badge.style.left = '0px';
            badge.style.display = "block";
            badgeName.innerText = data.type;
        }
    }

    _setPlaceHolderStyle(data: any) {
        this.nePlaceHolder.style.display = data.display;
        let element = data.clientRect;
        if (element) {
            let placeholder = this.nePlaceHolder.getElementsByClassName("fe-placeholder")[0] as HTMLElement;
            placeholder.classList.add(data.class);
            if (data.class == "vertical") {
                placeholder.classList.remove("horizontal");
                placeholder.style.top = element.top + 'px';
                placeholder.style.left = element.left + 'px';
                placeholder.style.width = 'auto';
                placeholder.style.height = element.height + 'px';
            } else {
                placeholder.classList.remove("vertical");
                placeholder.style.top = element.top + 'px';
                placeholder.style.left = element.left + 'px';
                placeholder.style.width = element.width + 'px';
                placeholder.style.height = 'auto';
            }
        }
    }
    /**************************/

    onDelete(event: any) {
        this.DeleteSelected(event);
    }

    onCopy(event: any) {
        this.CopySelected(event);
    }

    onMove(event: any, block: any) {
        this.MoveSelected(event, block);
    }

    onSelectParent(event: any) {
        this.SelectParent(event);
    }

    onToolbarAction(action: any) {
        let that: any = this;
        if (action != "clear") {
            that.nePanelBlock.style.display = "none";
            that.nePanelStyle.style.display = "none";

            switch (action) {
                case "block":
                    that.nePanelBlock.style.display = "block";
                    that.toolBarAction = "block";
                    break;
                case "style":
                    that.isValid = false;
                    let context = this.GetStyleContext();
                    if (context) {
                        that.nePanelStyle.style.display = "block";
                        setTimeout(() => {
                            this.ngContext?.resetForm(context);
                            that.isValid = true;
                        }, 100);

                        that.toolBarAction = "style";
                    } else {
                        that.nePanelBlock.style.display = "block";
                        that.toolBarAction = "block";
                    }
                    break;
            }
        } else {
            this.ClearDocument();
        }
        console.log("action", action);
    }

    hasValue(section: any, field: any) {
        if (this.context[section]) {
            if (['top', 'right', 'left', 'bottom', 'width', 'height', 'maxWidth', 'minHeight', 'size'].includes(field) && this.context[section][field]) {
                if (this.context[section][field]) {
                    return (this.context[section][field]["value"] || "").toString().length > 0 && this.context[section][field]["unit"] != "";
                } else {
                    return false;
                }
            } else if (['margin', 'padding'].includes(field) && this.context[section][field]) {
                let keys = Object.keys(this.context[section][field])
                let hasValueKeys = keys.filter((x: any) => (this.context[section][field][x]["value"] || "").toString().length > 0 && this.context[section][field][x]["unit"] != null).length;
                return hasValueKeys > 0;
            }
            else {
                return this.context[section][field] != null;
            }

        } else {
            return false;
        }
    }

    onClearValue(section: any, field: any) {
        if (this.context[section]) {
            if (['top', 'right', 'left', 'bottom', 'width', 'height', 'maxWidth', 'minHeight', 'size'].includes(field)) {
                if (this.context[section][field]) {
                    this.context[section][field]["value"] = "";
                    this.context[section][field]["unit"] = "";
                }
            } else if (['margin', 'padding'].includes(field)) {
                let keys = Object.keys(this.context[section][field]);
                keys.forEach((x: any) => {
                    this.context[section][field][x]["value"] = "";
                    this.context[section][field][x]["unit"] = "";
                });
            } else {
                this.context[section][field] = null;
            }
        }
    }

    onNumberKeyPress(text: any, event: any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode == 46) {
            if (text.indexOf('.') === -1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
        }
        return true;
    }

    onNumberBlur(section: any, field: any, subSection: any = null) {
        let ctrStyle = this.ngContext?.controls[section] as any;
        let ctrField = ctrStyle?.controls[field] as any;

        if (["margin", "padding"].includes(field) && subSection != null) {
            ctrField = ctrField.controls[subSection] as any;
        }
        let ctrValue = ctrField?.controls["value"] as any;
        let ctrUnit = ctrField?.controls["unit"] as any;
        if (ctrValue) {
            if ((ctrValue.value || "").length > 0) {
                ctrUnit.patchValue("px");
            } else {
                ctrUnit.patchValue("");
            }
            ctrUnit.updateValueAndValidity();
        }
    }

    onArrowUp(section: any, field: any, subSection: any = null, isNegative: any = false) {
        let ctrSection = this.ngContext?.controls[section] as any;
        let ctrField = ctrSection?.controls[field] as any;
        if (subSection != null) {
            if (["margin", "padding"].includes(field)) {
                ctrField = ctrField.controls[subSection] as any
            }
        }
        let ctrValue = ctrField?.controls["value"] as any;
        let ctrUnit = ctrField?.controls["unit"] as any;
        let value = this.getNumericValue(ctrValue.value || "0") + 1;
        if (value != null) {
            ctrValue.setValue(value.toString());
            ctrValue.updateValueAndValidity({ onlySelf: true, emitEvent: true });
            if (ctrUnit.value == "") {
                ctrUnit.setValue("px");
                ctrUnit.updateValueAndValidity({ onlySelf: true, emitEvent: true });
            }
        }
        this.ngContext?.form.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }

    onArrowDown(section: any, field: any, subSection: any = null, isNegative: any = false) {
        let ctrSection = this.ngContext?.controls[section] as any;
        let ctrField = ctrSection?.controls[field] as any;
        if (["margin", "padding"].includes(field)) {
            ctrField = ctrField.controls[subSection] as any
        }

        let ctrValue = ctrField?.controls["value"] as any;
        let ctrUnit = ctrField?.controls["unit"] as any;
        let value = this.getNumericValue(ctrValue.value || "0") - 1;

        if (isNegative) {
            ctrValue.setValue(value.toString());
            ctrValue.updateValueAndValidity();
            if (ctrUnit.value == "") {
                ctrUnit.setValue("px");
                ctrUnit.updateValueAndValidity();
            }
        } else {
            if (value > 0) {
                ctrValue.setValue(value.toString());
                ctrValue.updateValueAndValidity();
                if (ctrUnit.value == "") {
                    ctrUnit.setValue("px");
                    ctrUnit.updateValueAndValidity();
                }
            } else {
                ctrValue.setValue("");
                ctrValue.updateValueAndValidity();
                if (ctrUnit.value != "") {
                    ctrUnit.setValue("");
                    ctrUnit.updateValueAndValidity();
                }
            }
        }
    }

    onContextChange(form: NgForm) {
        //this.context = form.value;
        let that = this;
        setTimeout(() => {
            console.log("form", form.value);
            that.UpdateStyleContext(form.value);
        }, 500);
    }

    getNumericValue(value: any) {
        value = parseInt(value);
        if (!isNaN(value))
            return value;
        else
            return 0;
    }

    ngOnDestroy() {
        this._onChangeSubscription.unsubscribe();
        this.destroy();
    }


}