import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import FrameWrapper from "../common/frameWrapper";
import { NgForm } from "@angular/forms";

@Component({
    selector: "ng-form-builder",
    templateUrl: "./form-builder.component.html",
    styleUrls: ["./form-builder.component.scss"],
    providers: []
})
export class FormBuilderComponent extends FrameWrapper implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('refFrameWrapper') refFrameWrapper?: ElementRef<any>;
    @ViewChild('refPlaceHolder') refPlaceHolder?: ElementRef<any>;
    @ViewChild('refHoverFrame') refHoverFrame?: ElementRef<any>;
    @ViewChild('refToolBar') refToolBar?: ElementRef<any>;

    @ViewChild('ngContext') ngContext?: NgForm;

    _onChangeSubscription: any = null;

    public toolBarAction: string = "block";
    public subBlockToolBar: string = "basic";
    public subStyleToolBar: string = "settings";

    public context: any = null;
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

    constructor() {
        super();
        this.context = this._GetNgModelContext();
    }

    ngOnInit() {
       
    }

    ngAfterViewInit() {
        this._initializeEditor();
    }
    _GetNgModelContext() {
        let context = {
            id: null,
            control: null,
            general: {
                float: null,
                display: null,
                position: null,
                top: { value: null, unit: "" },
                right: { value: null, unit: "" },
                left: { value: null, unit: "" },
                bottom: { value: null, unit: "" },
            },
            dimension: {
                width: { value: null, unit: "" },
                height: { value: null, unit: "" },
                maxWidth: { value: null, unit: "" },
                minHeight: { value: null, unit: "" },
                margin: { top: { value: null, unit: "" }, right: { value: null, unit: "" }, left: { value: null, unit: "" }, bottom: { value: null, unit: "" }, },
                padding: { top: { value: null, unit: "" }, right: { value: null, unit: "" }, left: { value: null, unit: "" }, bottom: { value: null, unit: "" }, }
            },
            typography: {
                font: null,
                size: { value: null, unit: "" },
                weight: null,
                color: null,
                align: null,
                decoration: null,
            },
            decorations: {
                opacity: null,
                borderRadius: { tl: null, tr: null, br: null, bl: null, },
                border: { width: null, style: null, color: null, },
                background: null
            }
        };

        return context;
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
        this.toolBarAction = action;
        console.log("action", action);
    }

    hasValue(section: any, field: any) {
        if(this.context[section]) {
            if (['top', 'right', 'left', 'bottom'].includes(field) && this.context[section][field]) {
                if(this.context[section][field]) {
                    return this.context[section][field]["value"] != null && this.context[section][field]["unit"] != null
                } else {
                    return false;
                }
            } else {
                return this.context[section][field] != null;
            }
        } else {
            return false;
        }
    }

    onClearValue(section: any, field: any) {
        if(this.context[section]) {
            if (['top', 'right', 'left', 'bottom'].includes(field)) {
                if (this.context[section][field]) {
                    this.context[section][field]["value"] = null;
                    this.context[section][field]["unit"] = null;
                }
            } else {
                this.context[section][field] = null;
            }
        }
    }

    /*onUnitChange(event: any, field: any, data: any) {
        let unit = event.target.value;
        if (data.value == null) {
            event.target.value = "";
        }
        data.unit = unit;
    }*/

    onNumberKeyPress(txt: any, event: any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode == 46) {
            if (txt.indexOf('.') === -1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
        }
        return true;
    }

    /*onNumberBlur(event: any, data: any, selector: any) {
        if (data.value != null) {
            let select = event.view.document.getElementById(selector);
            if (select) {
                select.value = data.unit = "px";
            }
        }
    }*/

    onContextChange(form: NgForm) {
        console.log(form.value); 
    }

    ngOnDestroy() {
        this._onChangeSubscription.unsubscribe();
        this.destroy();
    }
}