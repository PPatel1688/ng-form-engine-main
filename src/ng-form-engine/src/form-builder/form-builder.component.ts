import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import FrameWrapper from "../common/frameWrapper";
import { Observable } from "rxjs";

@Component({
    selector: "ng-form-builder",
    templateUrl: "./form-builder.component.html",
    styleUrls: ["./form-builder.component.scss"],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBuilderComponent extends FrameWrapper implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('refFrameWrapper') refFrameWrapper?: ElementRef<any>;
    @ViewChild('refPlaceHolder') refPlaceHolder?: ElementRef<any>;
    @ViewChild('refHoverFrame') refHoverFrame?: ElementRef<any>;
    @ViewChild('refToolBar') refToolBar?: ElementRef<any>;

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

    get isActiveStyleTool() {
       return this.toolBarAction =='style';
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
        let that = this;
        let context = {
            id: null,
            control: null,
            general: {
                float: null,
                display: null,
                position: null,
                top: null,
                right: null,
                left: null,
                bottom: null,
            },
            dimension: {
                width: null,
                height: null,
                maxWidth: null,
                minHeight: null,
                margin: { top: null, right: null, left: null, bottom: null, },
                padding: { top: null, right: null, left: null, bottom: null, }
            },
            typography: {
                font: null,
                size: null,
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
        if(event == null) {
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
        console.log("action", action);
        this.toolBarAction = action;
    }

    hasValue(section: any, field: any) {
        return this.context[section][field] != null;
    }

    onClearValue(section: any, field: any) {
        this.context[section][field] = null;
    }

    ngOnDestroy() {
        this._onChangeSubscription.unsubscribe();
        this.destroy();
    }
}