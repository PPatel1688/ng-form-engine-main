import { EventEmitter } from "@angular/core";


export class FrameEvent {
    element: string = "";
    action: string = "";
    data: any;
}

export default class Frame {
    public onChange: EventEmitter<FrameEvent> = new EventEmitter<FrameEvent>();

    frame: any = null;
    document: any = null;

    parent: any = null;
    dragArea: any = null;
    selected: any = null;
    hovered: any = null;

    constructor() {
    }

    initFrame(el: HTMLIFrameElement) {
        this.frame = el;
        this.document = el?.contentDocument as Document;
        this._BindDocEvents();
    }

    private _BindDocEvents() {
        if (this.document) {
            this.document.addEventListener("click", this._onDocClick.bind(this));
            this.document.addEventListener("mouseover", this._onDocMouseOver.bind(this));
            this.document.addEventListener("mouseout", this._onDocMouseOut.bind(this));
            this.document.addEventListener("dragover", this._onDocDragOver.bind(this));
            this.document.addEventListener("drop", this._onDocDrop.bind(this));
        }
    }

    private _UnbindDocEvents() {
        if (this.document) {
            this.document.removeEventListener("click", this._onDocClick);
            this.document.removeEventListener("mouseover", this._onDocMouseOver);
            this.document.removeEventListener("mouseout", this._onDocMouseOut);
            this.document.removeEventListener("dragover", this._onDocDragOver);
            this.document.removeEventListener("drop", this._onDocDrop);
        }
    }

    private _onDocClick(event: any) {
        let data: any = {
            clientRect: null,
            display: "none"
        }
        if (this.selected) {
            this.selected.classList.remove("fe-selected");
        }
        if (event.target.getAttribute('data-fe-highlightable') === "true") {
            this.selected = event.target;
            this.selected.classList.add("fe-selected");

            data.clientRect = this.selected.getBoundingClientRect();
            data.display = "block";
        }
        this.onChange.emit({ element: "toolbar", action: "update", data: data });
    }

    private _onDocMouseOver(event: any) {
        let data: any = {
            clientRect: null,
            display: "none",
            type: null
        }
        if (this.hovered) {
            this.hovered.classList.remove("fe-hovered");
        }
        this.hovered = event.target;
        this.hovered.classList.add("fe-hovered");

        data.type = this.hovered.getAttribute('data-fe-type');
        if (data.type) {
            data.clientRect = this.hovered.getBoundingClientRect();
            data.display = "block";
        }
        this.onChange.emit({ element: "hoverframe", action: "update", data: data });
    }

    private _onDocMouseOut(event: any) {
        let data: any = {
            clientRect: null,
            display: "none",
            type: null
        }
        this.hovered = null;
        this.onChange.emit({ element: "hoverframe", action: "update", data: data });
    }

    private _onDocDragOver(event: any) {
        let data: any = {
            clientRect: null,
            display: "none",
            class: "horizontal"
        }
        if (this.parent) {
            this.parent.classList.remove("fe-selected-parent");
        }
       
        this.parent = event.target;

        let isValid = this._isValidDragArea(event);
        if(!isValid) {
            this.parent = event.target.parentElement;
        }
        this.parent.classList.add("fe-selected-parent");

        let source = this._getBoundingClientRect(this.parent, event.target);
        this.dragArea = source.dragArea;
        data.class = source.class;
        data.clientRect = source.clientRect;
        data.display = "block";

        this.onChange.emit({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
        this.onChange.emit({ element: "placeholder", action: "update", data: data });
        event.preventDefault();
    }

    private _onDocDrop(event: any) {
        console.log("drop");
        if (this.parent) {
            this.parent.classList.remove("fe-selected-parent");
        }
        this.onChange.emit({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
        this.onChange.emit({ element: "hoverframe", action: "update", data: { clientRect: null, display: "none" } });
        if (this.dragArea && this.dragArea.getAttribute('draggable') === "true" ) {
            let data = event.dataTransfer.getData("text");
            if (data) {
                let element = this.document.getElementById(data);
                this.dragArea.appendChild(element);
                element.classList.remove("fe-freezed");
                element.click();
            }
        }
        this.parent = null;
        this.dragArea = null;

    }

    private _isValidDragArea(event: any) {
        let source = this.selected;
        let sourceType = source.getAttribute('data-fe-type');

        let target = event.target;
        let targetType = target.getAttribute('data-fe-type');

        let isValid = true;
        switch (sourceType) {
            case "Cell":
                if (targetType == "Cell") {
                    isValid = false;
                }
                break;
            case "Row":
                if (targetType == "Row") {
                    isValid = false;
                }
                break;
        }
        return isValid;
    }

    private _getBoundingClientRect(parent: any, target: any) {
        let data: any = {
            class: "horizontal",
            clientRect: null,
            dragArea: parent
            
        };
        let clientRect = parent.getBoundingClientRect();
        if(parent.children.length >  0) {
            clientRect = target.getBoundingClientRect();
            let targetType = target.getAttribute('data-fe-type');
            if(targetType == "Row") {
                data.clientRect = {
                    top: clientRect.top + 5,
                    left: clientRect.left + 10,
                    width: "auto",
                    height: clientRect.height - 10
                };
            } else {
                data.clientRect = {
                    top: clientRect.top - 5,
                    left: clientRect.left,
                    width: "auto",
                    height: clientRect.height + 10
                };
            }
            data.class = "vertical";
        } else {
            data.clientRect = {
                top: clientRect.top + 5,
                left: clientRect.left + 5,
                width: clientRect.width - 10,
                height: 10
            };
        }
        return data;
    }

    SelectParent(event: any) {
        if (this.selected) {
            let parent = this.selected.parentElement as HTMLElement;
            parent.click();
        }
    }

    CopySelected(event: any) {
        if (this.selected) {
            let parent = this.selected.parentElement as HTMLElement;
            let node = this.selected.cloneNode(true);
            parent.appendChild(node);
            node.click();
        }
    }

    MoveSelected(event: any) {
        if (this.selected) {
            event.dataTransfer.setData("text", this.selected.id);
            //this.selected.classList.add("fe-freezed");
            //this.selected = null;
        }
    }

    DeleteSelected(event: any) {
        if (this.selected) {
            this.onChange.emit({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
            this.selected.remove();
            this.selected = null;
        }
    }
    
    destroy() {
        this._UnbindDocEvents();
    }
}