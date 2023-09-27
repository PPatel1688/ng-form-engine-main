import { EventEmitter } from "@angular/core";

import { HTMLTemplate, StyleHTML, StyleBuilder } from "../assets/template";
import Mixins from "./mixins";
import { BehaviorSubject } from "rxjs";

export class FrameEvent {
    element: string = "";
    action: string = "";
    data: any;
}

export default class FrameWrapper extends Mixins {
    //public onChange: EventEmitter<FrameEvent> = new EventEmitter<FrameEvent>();
    public onChange = new BehaviorSubject<any>(null);

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

    initFrame(el: any, source: any = null) {
        this.frame = el.getElementsByTagName("iframe")[0];
        this.document = this.frame?.contentDocument as Document;
        this._RenderDocument(source);
        this._BindDocEvents();
    }

    _RenderDocument(source: any) {
        let isDefault = source ? false : true;
        let template = new DOMParser().parseFromString(source || HTMLTemplate, 'text/html');;

        if (isDefault) {
            let styleHTML = template.createElement("style");
            styleHTML.innerText = StyleHTML.replace(/(\r\n|\n|\r)/gm, "");
            this.document.head.appendChild(styleHTML);

            let styleBuilder = template.createElement("style");
            styleBuilder.innerText = StyleBuilder.replace(/(\r\n|\n|\r)/gm, "");
            styleBuilder.setAttribute("id", "system");
            this.document.head.appendChild(styleBuilder);

            let styleCustom = template.createElement("style");
            styleCustom.innerText = "body{margin:0;background-color:#fff;} body{margin:0;}";
            styleCustom.setAttribute("id", "custom");
            this.document.head.appendChild(styleCustom);
            this.cstStyle = styleCustom;

            let wrapper = this.ctrMainWrapper();
            this.document.body.appendChild(wrapper);

            let id = this.getNewId();
            this.document.body.setAttribute("id", id);
            this.document.body.setAttribute("data-fe-type", "Body");
            this.document.body.classList.add("fe-dashed");
        } else {
            let styleBuilder = template.createElement("style");
            styleBuilder.innerText = StyleBuilder.replace(/(\r\n|\n|\r)/gm, "");
            styleBuilder.setAttribute("id", "system");
            this.document.head.appendChild(styleBuilder);

            let styleCustom = template.getElementById("custom");
            if (styleCustom == null) {
                styleCustom = template.createElement("style");
                styleCustom.innerText = "";
                styleCustom.setAttribute("id", "custom");
                this.document.head.appendChild(styleCustom);
            }
            this.cstStyle = styleCustom;
        }
        this.setCustomCSS(this.cstStyle.innerText);
    }

    private _BindDocEvents() {
        if (this.document) {
            this.document.addEventListener("dblclick", this._onDocDblClick.bind(this));
            this.document.addEventListener("click", this._onDocClick.bind(this));
            this.document.addEventListener("mouseover", this._onDocMouseOver.bind(this));
            this.document.addEventListener("mouseout", this._onDocMouseOut.bind(this));
            this.document.addEventListener("dragover", this._onDocDragOver.bind(this));
            this.document.addEventListener("drop", this._onDocDrop.bind(this));
        }
    }

    private _UnbindDocEvents() {
        if (this.document) {
            this.document.removeEventListener("dblclick", this._onDocDblClick);
            this.document.removeEventListener("click", this._onDocClick);
            this.document.removeEventListener("mouseover", this._onDocMouseOver);
            this.document.removeEventListener("mouseout", this._onDocMouseOut);
            this.document.removeEventListener("dragover", this._onDocDragOver);
            this.document.removeEventListener("drop", this._onDocDrop);
        }
    }

    private _onDocDblClick(event: any) {
        if (event.target.getAttribute('data-fe-highlightable') === "true") {
            this.onChange.next({ element: "selected", action: "update", data: null });
        }
    }

    private _onDocClick(event: any) {
        let data: any = {
            clientRect: null,
            display: "none",
            node: "",
        }
        if (this.selected) {
            this.selected.classList.remove("fe-selected");
        }
        if (event.target.getAttribute('data-fe-highlightable') === "true") {
            this.selected = event.target;
            this.selected.classList.add("fe-selected");

            data.clientRect = this.selected.getBoundingClientRect();
            data.display = "block";
            data.node = this.selected.getAttribute('data-fe-type');
        }
        this.onChange.next({ element: "toolbar", action: "update", data: data });
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
        this.onChange.next({ element: "hoverframe", action: "update", data: data });
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
        this.onChange.next({ element: "hoverframe", action: "update", data: data });
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
                this.onChange.next({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
                this.onChange.next({ element: "placeholder", action: "update", data: drag.style });
            } else {
                this.onChange.next({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
            }
        } else {
            this.onChange.next({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
        }
        event.preventDefault();
    }

    private _onDocDrop(event: any) {
        if (this.drag.parent) {
            this.drag.parent.classList.remove("fe-selected-parent");
        }
        this.onChange.next({ element: "placeholder", action: "update", data: { clientRect: null, display: "none" } });
        this.onChange.next({ element: "hoverframe", action: "update", data: { clientRect: null, display: "none" } });
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

        //console.log("type", sourceType, targetType, parentType);

        if (parentType == "Body") {
            //return null;
        }

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
        //console.log("----------");
        //console.log("className", className);
        //console.log("currentType", currentType);
        //console.log("----------");
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
            event.dataTransfer.setData("text", that.selected.id || that.selected.for);
        }
    }

    DeleteSelected(event: any) {
        if (this.selected) {
            this.onChange.next({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
            this.selected.remove();
            this.selected = null;
        }
    }

    SetStyleContext() {
        if (this.selected == null) {
            return false;
        }
        let id = this.selected.getAttribute('id');
        let node = this.selected.getAttribute('data-fe-type');
        let cssStyle = this.document.defaultView.getComputedStyle(this.selected, null);
        if (node != "Wrapper") {
            //this.onChange.next({ element: "toolbar", action: "update", data: { clientRect: null, display: "none" } });
            this._StyleObjectToContext(this.context, id, node, cssStyle);
            return true;
        } else {
            return false;
        }
    }

    UpdateStyleContext(context: any) {
        this.cstStyleJson[context.id] = this._ContextToStyleObject(context);
        this.cstStyle.innerText = this.jsonToCSS(this.cstStyleJson);
    }

    destroy() {
        this._UnbindDocEvents();
    }
}