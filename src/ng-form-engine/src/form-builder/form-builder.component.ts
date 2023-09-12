import { Component, HostListener, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import Editor from "../common/editor";

import template from "../assets/template";

@Component({
    selector: "ng-form-builder",
    templateUrl: "./form-builder.component.html",
    styleUrls: ["./form-builder.component.scss"],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('refFrame') refFrame?: ElementRef<HTMLIFrameElement>;
    @ViewChild('refPlaceHolder') refPlaceHolder?: ElementRef<any>;
    @ViewChild('refHoverFrame') refHoverFrame?: ElementRef<any>;
    @ViewChild('refToolBar') refToolBar?: ElementRef<any>;

    _editor: any = null;
    _onChangeSubscription: any = null;

    getFrameEl() {
        return this.refFrame?.nativeElement as HTMLIFrameElement;
    }

    getDocument() {
        const frame = this.getFrameEl();
        return frame?.contentDocument as Document;
    }

    getHead() {
        const document = this.getDocument();
        return document.getElementsByTagName("head")[0];
    }

    getBody() {
        const document = this.getDocument();
        return document.getElementsByTagName("body")[0];
    }

    getHTMLAllCollection() {
        const document = this.getDocument();
        return document?.all as HTMLAllCollection;
    }

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
        this._editor = new Editor();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this._initializeEditor();
    }

    _initializeEditor() {
        let that = this;
        that._editor.initEditor(this.refFrame?.nativeElement);
        that._onChangeSubscription = this._editor.onChange.subscribe({
            next: (event: any) => {
                that._onEditorChange(event);
            }
        });

        const domParser = new DOMParser();
        const source = domParser.parseFromString(template, 'text/html');
        const head1 = source.getElementsByTagName("head");
        const body1 = source.getElementsByTagName("body");


        const document = this.getDocument();
        
        const head = this.getHead();
        const body = this.getBody();

        for (let child of this._getChildren(head1[0])) {
            head.appendChild(child);
        }

        for (let attributes of this._getAttributes(body1[0])) {
            body.setAttribute(attributes.nodeName, attributes.nodeValue || "");
        }

        for (let child of this._getChildren(body1[0])) {
            body.appendChild(child);
        }
    }

    _getChildren(dom: any) {
        return dom ? Array.from(dom.children as HTMLCollection) : [];
    }

    _getAttributes(dom: any) {
        return dom ? Array.from(dom.attributes as NamedNodeMap) : [];
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
            default:
                break;
        }
        //console.log("event", event);
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

            //console.log("element", JSON.stringify(element));
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

    onDelete(event: any) {
        this._editor.DeleteSelected(event);
    }

    onCopy(event: any) {
        this._editor.CopySelected(event);
    }

    onMove(event: any) {
        this._editor.MoveSelected(event);
    }

    onSelectParent(event: any) {
        this._editor.SelectParent(event);
    }

    ngOnDestroy() {
        this._onChangeSubscription.unsubscribe();
        this._editor.destroy();
    }
}