import { EventEmitter } from "@angular/core";

import Mixins from "./mixins";

export class FrameEvent {
    element: string = "";
    action: string = "";
    data: any;
}

export default class Frame extends Mixins {
    public onChange: EventEmitter<FrameEvent> = new EventEmitter<FrameEvent>();

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
        super();
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
        if (event.target.getAttribute('data-fe-highlightable') === "true") {
            this.hovered = event.target;
            this.hovered.classList.add("fe-hovered");

            data.type = this.hovered.getAttribute('data-fe-type');
            if (data.type) {
                data.clientRect = this.hovered.getBoundingClientRect();
                data.display = "block";
            }
        }
        this.onChange.emit({ element: "hoverframe", action: "update", data: data });
    }

    private _onDocMouseOut(event: any) {
        let data: any = {
            clientRect: null,
            display: "none",
            type: null
        }
        if (this.hovered) {
            this.hovered.classList.remove("fe-hovered");
        }
        this.hovered = null;
        this.onChange.emit({ element: "hoverframe", action: "update", data: data });
    }

    private _onDocDragOver(event: any) {
        if (this.drag.parent) {
            this.drag.parent.classList.remove("fe-selected-parent");
        }
        this.drag.target = null;
        if (event.target.getAttribute('draggable') === "true") {
            let drag = this._prepareDrag(event);
            if (drag) {
                this.drag.parent = drag.parent;
                this.drag.target = drag.target;
                this.drag.append = drag.append;
                this.drag.parent.classList.add("fe-selected-parent");
                this.onChange.emit({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
                this.onChange.emit({ element: "placeholder", action: "update", data: drag.style });
            } else {
                this.onChange.emit({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
            }
        } else {
            this.onChange.emit({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
        }
        event.preventDefault();
    }

    private _onDocDrop(event: any) {
        if (this.drag.parent) {
            this.drag.parent.classList.remove("fe-selected-parent");
        }
        this.onChange.emit({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
        this.onChange.emit({ element: "hoverframe", action: "update", data: { clientRect: null, display: "none" } });
        if (this.selected && this.drag.target && this.drag.target.getAttribute('draggable') === "true") {
            let data = event.dataTransfer.getData("text");
            if (data) {
                //let element = this.document.getElementById(data);
                this.drag.target.appendChild(this.selected);
                //element.classList.remove("fe-freezed");
                //this.selected.click();
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
                isInvalid = targetType == "Row";
                break;
            case "Cell":
                isInvalid = ["Cell", "Wrapper"].includes(targetType);
                break;
            case "Text1":
                break;
            default:
                isInvalid = ["Row", "Text", "Image", "Paragraph", "Table", "Input", "Textarea", "Checkbox", "Radio", "RadioList", "CheckboxList"].includes(targetType);
                break;
        }
        return isInvalid;
    }

    private _prepareDrag(event: any) {
        const source = this.selected;
        let sourceType = source.getAttribute('data-fe-type');

        const target = event.target;
        let targetType = target.getAttribute('data-fe-type');

        const parent = event.target.parentElement;
        let parentType = parent.getAttribute('data-fe-type');

        if (parentType == "Body") {
            return null;
        }
        //console.log("type", sourceType, targetType, parentType);
        let data: any = { target: target, parent: parent, style: { clientRect: null, display: "block", class: "horizontal" } };
        let current: any = null;
        let currentType: any = null;
        let isInvalid = this._isValidPlace(sourceType, targetType);

        if (isInvalid) {
            current = target.parentElement;
            currentType = current.getAttribute('data-fe-type');
        } else {
            current = target;
            currentType = target.getAttribute('data-fe-type');
        }

        let hasChild = current.children.length > 0;
        let clientRect = current.getBoundingClientRect();
        let className = "horizontal";

        if (currentType != "Wrapper" && hasChild) {
            className = "vertical";
        }

        if (currentType != "Wrapper") {
            if (className == "vertical") {
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
        } else {
            let lastElementChild = current.lastElementChild;
            if (lastElementChild) {
                clientRect = lastElementChild.getBoundingClientRect();
                data.style.clientRect = {
                    top: clientRect.bottom + 5,
                    left: clientRect.left + 5,
                    width: clientRect.width - 10,
                    height: 10
                };
            } else {
                data.style.clientRect = {
                    top: clientRect.top + 5,
                    left: clientRect.left + 5,
                    width: clientRect.width - 10,
                    height: 10
                };
            }
        }
        /*console.log("----------");
        console.log("className", className);
        console.log("currentType", currentType);
        console.log("----------");*/
        data.target = current;
        data.style.class = className;

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
            let id = this.getNewId();
            let parent = this.selected.parentElement as HTMLElement;
            let node = this.selected.cloneNode(true);
            node.id = id;
            parent.appendChild(node);
            node.click();
        }
    }

    MoveSelected(event: any, block: string) {
        let that: any = this;
        if (block == "self") {
            if (that.selected) {
                that.selected.classList.remove("fe-selected");
            }
            event.dataTransfer.setData("text", that.selected.id);
        } else {
            if (that.selected) {
                that.selected.classList.remove("fe-selected");
            }
            that.selected = that[that.blockType[block]]();

            console.log(that.selected);
            event.dataTransfer.setData("text", that.selected.id || that.selected.for);
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