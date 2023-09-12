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

    drag: any = {
        parent: null,
        target: null,
        append: null
    }

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
        if (this.drag.parent) {
            this.drag.parent.classList.remove("fe-selected-parent");
        }
        if (event.target.getAttribute('draggable') === "true") {
            let drag = this._prepareDrag(event);
            this.drag.parent = drag.parent;
            this.drag.target = drag.target;
            this.drag.append = drag.append;
            this.drag.parent.classList.add("fe-selected-parent");
            this.onChange.emit({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
            this.onChange.emit({ element: "placeholder", action: "update", data: drag.style });
        } else {
            this.onChange.emit({ element: "hoverframe", action: "update", data: { clientRect: null, display: "none" } });
        }
        event.preventDefault();
    }

    private _onDocDrop(event: any) {
        if (this.drag.parent) {
            this.drag.parent.classList.remove("fe-selected-parent");
        }
        this.onChange.emit({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
        this.onChange.emit({ element: "hoverframe", action: "update", data: { clientRect: null, display: "none" } });
        if (this.drag && this.drag.target.getAttribute('draggable') === "true") {
            let data = event.dataTransfer.getData("text");
            if (data) {
                let element = this.document.getElementById(data);
                this.drag.target.appendChild(element);
                element.classList.remove("fe-freezed");
                element.click();
            }
        }
        this.drag.parent = null;
        this.drag.target = null;
        this.drag.append = null;
    }

    private _isValidPlace(sourceType: any, targetType: any) {
        let isInvalid = false;
        switch (sourceType) {
            case "Row":
            case "Cell":
                isInvalid = targetType == sourceType;
                break;
            case "Text":
                isInvalid = targetType == "Row";
                break;
            default:
                break;
        }
        return isInvalid;
    }

    private _prepareDrag(event: any) {
        let data: any = {
            parent: null,
            style: {
                clientRect: null,
                display: "block",
                class: "horizontal"
            },
            target: null,
            append: null
        };
        let source = this.selected;
        let sourceType = source.getAttribute('data-fe-type');

        let target = event.target;
        let targetType = target.getAttribute('data-fe-type');

        let isSameType = this._isValidPlace(sourceType, targetType);
        if(isSameType) {
            data.parent = target.parentElement;
            data.target = target.parentElement;
        } else {
            data.parent = target;
            data.target = target;
        }
        let hasChild = false;
        let parentType = data.parent.getAttribute('data-fe-type');
        if(parentType != "Wrapper") {
            hasChild = data.target.children.length > 0;
            if (hasChild) {
                data.style.class = "vertical";
            }
        }
        
        let clientRect = data.target.getBoundingClientRect();
        if (hasChild) {
            clientRect = target.getBoundingClientRect();
            if (targetType == "Row") {
                data.style.clientRect = {
                    top: clientRect.top + 5,
                    left: clientRect.left + 10,
                    width: "auto",
                    height: clientRect.height - 10
                };
            } else {
                data.style.clientRect = {
                    top: clientRect.top - 5,
                    left: clientRect.left,
                    width: "auto",
                    height: clientRect.height + 10
                };
            }
        } else {
            data.style.clientRect = {
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
            this.selected.classList.add("fe-freezed");
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