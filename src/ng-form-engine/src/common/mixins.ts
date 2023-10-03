
import cssToJSON from './cssToJSON';

export default class Mixins {
    public frame: any = null;
    public document: any = null;
    public cstStyle: any = null;
    public cstStyleJson: any = {};

    public blockType: any = {
        OneColumn: "ctrOneColumn",
        TwoColumn: "ctrTwoColumn",
        ThreeColumn: "ctrThreeColumn",
        TwoThirdColumn: "ctrTwoThirdColumn",
        Text: "ctrText",
        Image: "ctrImage",
        Paragraph: "ctrParagraph",
        Table: "ctrTable",
        Input: "ctrInput",
        Textarea: "ctrTextarea",
        Checkbox: "ctrCheckbox",
        Radio: "ctrRadio",
        RadioList: "ctrRadioList",
        CheckboxList: "ctrCheckboxList"
    }

    public context: any = null;

    constructor() {
        this.context = this._GetStyleContext();
    }


    public ctrMainWrapper() {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Wrapper");
        source.setAttribute("draggable", "true");
        return source;
    }

    /********/

    public ctrOneColumn() {
        let row = this.createDomRow();
        let column = this.createDomColumn(0);
        row.append(column);
        return row;
    }

    public ctrTwoColumn() {
        let row = this.createDomRow();
        Array(2).fill(0).forEach((value: any, index: any) => {
            let column = this.createDomColumn(index);
            row.append(column);
        })
        return row;
    }

    public ctrThreeColumn() {
        let row = this.createDomRow();
        Array(3).fill(0).forEach((value: any, index: any) => {
            let column = this.createDomColumn(index);
            row.append(column);
        })
        return row;
    }

    public ctrTwoThirdColumn() {
        let row = this.createDomRow();
        Array(2).fill(0).forEach((value: any, index: any) => {
            let column = this.createDomColumn(index, "TwoThird");
            row.append(column);
        })
        return row;
    }

    public ctrText() {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Text");

        source.setAttribute("draggable", "true");
        source.setAttribute("contenteditable", "true");
        source.innerText = "Insert your text here";
        return source;
    }

    public ctrImage() {
        let id = this.getNewId();
        let source = this.document.createElement("img");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Image");
        source.setAttribute("draggable", "true");
        source.setAttribute("src", "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6IHJnYmEoMCwwLDAsMC4xNSk7IHRyYW5zZm9ybTogc2NhbGUoMC43NSkiPgogICAgICAgIDxwYXRoIGQ9Ik04LjUgMTMuNWwyLjUgMyAzLjUtNC41IDQuNSA2SDVtMTYgMVY1YTIgMiAwIDAgMC0yLTJINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMnoiPjwvcGF0aD4KICAgICAgPC9zdmc+");
        return source;
    }

    public ctrParagraph() {
        let id = this.getNewId();
        let source = this.document.createElement("p");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Paragraph");
        source.setAttribute("draggable", "true");
        source.setAttribute("contenteditable", "true");
        source.innerText = "Insert your text here";
        return source;
    }

    public ctrTable() {
        let id = this.getNewId();

        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Table");
        source.setAttribute("draggable", "true");

        let table = this.document.createElement("table");
        table.setAttribute("border", "1");

        let thead = this.document.createElement('thead');
        Array(1).fill(0).forEach(() => {
            let thr = this.document.createElement('tr');
            Array(2).fill(0).forEach((value: any, index: any) => {
                let th = document.createElement('th');
                th.appendChild(document.createTextNode("Header" + (index + 1)));
                thr.appendChild(th);
            });
            thead.appendChild(thr);
        });
        table.appendChild(thead);

        let tbody = this.document.createElement('tbody');
        Array(1).fill(0).forEach(() => {
            let tr = this.document.createElement('tr');
            Array(2).fill(0).forEach((value: any, index: any) => {
                let td = document.createElement('td');
                td.appendChild(document.createTextNode("Value" + (index + 1)));
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        source.append(table);
        return source;
    }

    /********/

    public ctrInput() {
        let id = this.getNewId();
        let source = this.document.createElement("input");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Input");
        source.setAttribute("draggable", "true");
        source.setAttribute("type", "text");
        return source;
    }

    public ctrTextarea() {
        let id = this.getNewId();
        let source = this.document.createElement("textarea");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Textarea");
        source.setAttribute("draggable", "true");
        return source;
    }

    public ctrCheckbox(self: any = true, name: any = "") {
        let main = this.document.createElement("div");
        if (self) {
            let id = this.getNewId();
            main.setAttribute("id", id);
            main.setAttribute("data-fe-highlightable", "true");
            main.setAttribute("data-fe-type", "Checkbox");
            main.setAttribute("draggable", "true");
        }

        let ctrId = "checkbox-" + this.getNewId();
        let label = this.document.createElement("label");
        let text = this.document.createTextNode("value");
        label.setAttribute("for", ctrId);

        let source = this.document.createElement("input");
        source.setAttribute("id", ctrId);
        source.setAttribute("name", name || ctrId);
        source.setAttribute("type", "checkbox");

        label.appendChild(source);
        label.appendChild(text);

        main.appendChild(label);
        return main;
    }


    public ctrCheckbox1(self: any = true, name: any = "") {
        let id = this.getNewId();

        let label = this.document.createElement("label");
        let text = this.document.createTextNode("value");
        label.setAttribute("for", id);
        label.setAttribute("data-fe-type", "Checkbox");

        if (self) {
            label.setAttribute("data-fe-highlightable", "true");
            label.setAttribute("draggable", "true");
        }

        let source = this.document.createElement("input");
        source.setAttribute("id", id);
        source.setAttribute("name", name || id);
        source.setAttribute("type", "checkbox");

        label.appendChild(source);
        label.appendChild(text);

        return label;
    }

    public ctrRadio(self: any = true, name: any = "") {
        let main = this.document.createElement("div");
        if (self) {
            let id = this.getNewId();
            main.setAttribute("id", id);
            main.setAttribute("data-fe-highlightable", "true");
            main.setAttribute("data-fe-type", "Radio");
            main.setAttribute("draggable", "true");
        }

        let ctrId = "radio-" + this.getNewId();
        let label = this.document.createElement("label");
        let text = this.document.createTextNode("value");
        label.setAttribute("for", ctrId);

        let source = this.document.createElement("input");
        source.setAttribute("id", ctrId);
        source.setAttribute("name", name || ctrId);
        source.setAttribute("type", "radio");
        source.value = "value";

        label.appendChild(source);
        label.appendChild(text);

        main.appendChild(label);
        return main;
    }

    public ctrRadioList() {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Radio List");

        source.setAttribute("draggable", "true");

        Array(3).fill(0).forEach(() => {
            let radio = this.ctrRadio(false, id);
            source.append(radio);
        });

        return source;
    }

    public ctrCheckboxList() {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Checkbox List");
        source.setAttribute("draggable", "true");

        Array(3).fill(0).forEach(() => {
            let radio = this.ctrCheckbox(false, id);
            source.append(radio);
        });

        return source;
    }

    /********/

    getNewId() {
        return "fe" + (Math.random() + 1.1).toString(36).slice(-3);
    }

    private createDomRow() {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Row");

        source.setAttribute("draggable", "true");
        source.classList.add('fe-row');
        return source;
    }

    private createDomColumn(index: any, style: any = null) {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Cell");

        source.setAttribute("draggable", "true");
        source.classList.add('fe-cell');

        if (style == "TwoThird") {
            if (index == 0) {
                source.setAttribute("style", "flex-basis: 50%;");
            } else {
                source.setAttribute("style", "flex-basis: 70%;");
            }
        }

        return source;
    }

    /********/

    _GetStyleContext(node: any = null) {
        let context = {
            id: null,
            node: null,
            settings: {
                field: null,
                src: null,
                groups: [],
            },
            style: {
                float: null,
                display: null,
                position: null,
                top: { value: "", unit: "" },
                right: { value: "", unit: "" },
                left: { value: "", unit: "" },
                bottom: { value: "", unit: "" },
                width: { value: "", unit: "" },
                height: { value: "", unit: "" },
                maxWidth: { value: "", unit: "" },
                minHeight: { value: "", unit: "" },
                margin: { top: { value: "", unit: "" }, right: { value: "", unit: "" }, left: { value: "", unit: "" }, bottom: { value: "", unit: "" } },
                padding: { top: { value: "", unit: "" }, right: { value: "", unit: "" }, left: { value: "", unit: "" }, bottom: { value: "", unit: "" } },
                fontFamily: null,
                fontSize: { value: "", unit: "" },
                fontWeight: null,
                color: null,
                textAlign: null,
                textDecoration: null
            }
        };

        /*decorations: {
            opacity: null,
            borderRadius: { tl: null, tr: null, br: null, bl: null, },
            border: { width: null, style: null, color: null, },
            background: null
        }*/
        return context;
    }

    ConvertJsonToCSS(data: any) {
        const selectors = Object.keys(data);
        return selectors.map((selector: any) => {
            const definition = data[selector];
            const rules = Object.keys(definition);
            const result = rules.map((rule) => { return `${rule}:${definition[rule]}` }).join(';');
            return `${selector}{${result}}`;
        }).join('');
    }

    SetCustomCSS(data: any = "") {
        try {
            let styles = cssToJSON(data);
            for (let key in styles) {
                let style: any = this.cstStyleJson[key];
                if (style == null) {
                    this.cstStyleJson[key] = this.StyleToContextObject(key, styles[key]);
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    StyleToContextObject(id: any, styles: any) {
        let UnitFields: any = ["top", "right", "left", "bottom", "width", "height", "maxWidth", "minHeight", "fontSize"];
        let SubUnitFields: any = ["margin", "padding"];
        let labels: any = {
            maxWidth: "max-width",
            minHeight: "min-height",
            fontFamily: "font-family",
            fontSize: "font-size",
            fontWeight: "font-weight",
            textAlign: "text-align",
            textDecoration: "text-decoration",
        };

        let context: any = this._GetStyleContext();
        context.id = id;
        for (let key in context.style) {
            let label = labels[key] || key;
            let value = null;
            if (UnitFields.includes(key)) {
                value = styles[label] || null;
                if (value) {
                    let num = (value || "").replace(/[^0-9\.]+/g, "");
                    let unit = (value || "").replace(num, "");
                    if (num && unit) {
                        context.style[key]["value"] = num;
                        context.style[key]["unit"] = unit;
                    }
                }
            } else if (SubUnitFields.includes(key)) {
                for (let subKey in context.style[key]) {
                    let subLabel = label + "-" + subKey;
                    value = styles[subLabel] || null;
                    if (value) {
                        let num = (value || "").replace(/[^0-9\.]+/g, "");
                        let unit = (value || "").replace(num, "");
                        if (num && unit) {
                            context.style[key][subKey]["value"] = num;
                            context.style[key][subKey]["unit"] = unit;
                        }
                    }
                }
            } else {
                value = styles[label] || null;
                if (value) {
                    context.style[key] = value;
                }
            }
        }
        return context;
    }

    ContextToStyleObject() {
        let styles: any = {};
        let UnitFields: any = ["top", "right", "left", "bottom", "width", "height", "maxWidth", "minHeight", "fontSize"];
        let SubUnitFields: any = ["margin", "padding"];
        let labels: any = {
            maxWidth: "max-width",
            minHeight: "min-height",
            fontFamily: "font-family",
            fontSize: "font-size",
            fontWeight: "font-weight",
            textAlign: "text-align",
            textDecoration: "text-decoration",
        };

        let cssStyles = JSON.parse(JSON.stringify(this.cstStyleJson));
        for (let key in cssStyles) {
            let style = cssStyles[key].style;
            let id = cssStyles[key]["id"];
            let obj: any = {};
            for (let sub in style) {
                let label = labels[sub] || sub;
                if (style[sub] != null) {
                    if (UnitFields.includes(sub)) {
                        if (style[sub]["value"] && style[sub]["unit"]) {
                            obj[label] = style[sub]["value"] + style[sub]["unit"];
                        }
                    } else if (SubUnitFields.includes(sub)) {
                        for (let subKey in style[sub]) {
                            let subLabel = label + "-" + subKey;
                            if (style[sub][subKey]["value"] && style[sub][subKey]["unit"]) {
                                obj[subLabel] = style[sub][subKey]["value"] + style[sub][subKey]["unit"];
                            }
                        }
                    } else {
                        obj[label] = style[sub];
                    }
                }
            }
            styles[id] = obj;
        }
        return styles;
    }

    /********/

    StoreDocument() {
        let source = this.document.documentElement.outerHTML
        let template = new DOMParser().parseFromString(source, 'text/html');
        let styleSystem = template.getElementById("system");
        if (styleSystem) {
            styleSystem.remove();
        }
        let outerHTML = template.documentElement.outerHTML;
        outerHTML = outerHTML.replace(/\bfe-selected\b/g, '');
        outerHTML = outerHTML.replace(/\bfe-hovered\b/g, '');
        localStorage.setItem("fe-document", outerHTML);
    }

    GetStoreDocument() {
        return localStorage.getItem("fe-document") || null;
    }
}