import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import FrameWrapper from "../common/frameWrapper";

@Component({
    selector: "ng-form-builder",
    templateUrl: "./form-builder.component.html",
    styleUrls: ["./form-builder.component.scss"],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('refFrameWrapper') refFrameWrapper?: ElementRef<any>;
    @ViewChild('refPlaceHolder') refPlaceHolder?: ElementRef<any>;
    @ViewChild('refHoverFrame') refHoverFrame?: ElementRef<any>;
    @ViewChild('refToolBar') refToolBar?: ElementRef<any>;

    _frameWrapper: any = null;
    _onChangeSubscription: any = null;
    _toolBarAction: any = "block";
    _blockToolAction: any = "basic";

    get nePlaceHolder() {
        return this.refPlaceHolder?.nativeElement as HTMLElement;
    }

    get neHoverFrame() {
        return this.refHoverFrame?.nativeElement as HTMLElement;
    }

    get neToolBar() {
        return this.refToolBar?.nativeElement as HTMLElement;
    }

    public get isStyleTool() {
        return this._toolBarAction == "style";
    }

    public get isBlockTool() {
        return this._toolBarAction == "block";
    }

    constructor() {
        this._frameWrapper = new FrameWrapper();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this._initializeEditor();
    }

    _initializeEditor() {
        let that = this;
        that._frameWrapper.initFrame(this.refFrameWrapper?.nativeElement);
        that._onChangeSubscription = that._frameWrapper.onChange.subscribe((event: any) => { 
            if(event) {
                that._onEditorChange(event);
            }
        });
    }

    /**************************/
    _onEditorChange(event: any) {
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
                //this.onToolbarAction('style');
                break;
            default:
                break;
        }
    }

    _setToolbarStyle(data: any) {
        this.neToolBar.style.display = data.display;
        let element = data.clientRect;
        if(element) {
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
        if(element) {
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
        if(element) {
            let placeholder = this.nePlaceHolder.getElementsByClassName("fe-placeholder")[0] as HTMLElement;
            placeholder.classList.add(data.class);
            if(data.class == "vertical") {
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
        this._frameWrapper.DeleteSelected(event);
    }

    onCopy(event: any) {
        this._frameWrapper.CopySelected(event);
    }

    onMove(event: any, block: any) {
        this._frameWrapper.MoveSelected(event, block);
    }

    onSetting(event: any) {
        this.onToolbarAction('style');
    }

    onSelectParent(event: any) {
        this._frameWrapper.SelectParent(event);
    }

    onToolbarAction(action: any) {
        this._toolBarAction = action;
    }

    ngOnDestroy() {
        this._onChangeSubscription.unsubscribe();
        this._frameWrapper.destroy();
    }
}