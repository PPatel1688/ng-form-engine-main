
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
        let id = this.getNewId();
        let label = this.document.createElement("label");
        let text = this.document.createTextNode("value");
        label.setAttribute("for", id);
        label.setAttribute("data-fe-type", "Radio");
        if (self) {
            label.setAttribute("data-fe-highlightable", "true");
            label.setAttribute("draggable", "true");
        }

        let source = this.document.createElement("input");
        source.setAttribute("id", id);
        source.setAttribute("name", name || id);
        source.setAttribute("type", "radio");

        label.appendChild(source);
        label.appendChild(text);

        return label;
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

    createDomRow() {
        let id = this.getNewId();
        let source = this.document.createElement("div");
        source.setAttribute("id", id);
        source.setAttribute("data-fe-highlightable", "true");
        source.setAttribute("data-fe-type", "Row");

        source.setAttribute("draggable", "true");
        source.classList.add('fe-row');
        return source;
    }

    createDomColumn(index: any, style: any = null) {
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

    getCustomCSSString() {
        return this.jsonToCSS(this.cstStyleJson);
    }

    jsonToCSS(data: any) {
        const selectors = Object.keys(data);
        return selectors.map((selector: any) => {
            const definition = data[selector];
            const rules = Object.keys(definition);
            const result = rules.map((rule) => { return `${rule}:${definition[rule]}` }).join(';');
            return `${selector}{${result}}`;
        }).join('');
    }

    setCustomCSS(data: any = "") {
        try {
            this.cstStyleJson = cssToJSON(data);
        } catch (error) {
            console.log("error", error);
        }
    }

    GetStyleContext() {
        let context = {
            id: null,
            field: null,
            control: null,
            general: {
                float: null,
                display: null,
                position: null,
                top: { value: "", unit: "" },
                right: { value: "", unit: "" },
                left: { value: "", unit: "" },
                bottom: { value: "", unit: "" },
            },
            dimension: {
                width: { value: "", unit: "" },
                height: { value: "", unit: "" },
                maxWidth: { value: "", unit: "" },
                minHeight: { value: "", unit: "" },
                margin: { top: { value: "", unit: "" }, right: { value: "", unit: "" }, left: { value: "", unit: "" }, bottom: { value: "", unit: "" }, },
                padding: { top: { value: "", unit: "" }, right: { value: "", unit: "" }, left: { value: "", unit: "" }, bottom: { value: "", unit: "" }, }
            },
            typography: {
                font: null,
                size: { value: "", unit: "" },
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

    _ContextToStyleObject(context: any) {
        let Style: any = {};
        let UnitFields: any = ["top", "right", "left", "bottom", "width", "height", "maxWidth", "minHeight", "size"];
        let SubUnitFields: any = ["margin", "padding"];
        let labels: any = {
            maxWidth: "max-width",
            minHeight: "min-height",
            font: "font-family",
            size: "font-size",
            weight: "font-weight",
            align: "text-align",
            decoration: "text-decoration",
            
        };
        //"dimension", "typography", "decorations"
        for (let section of ["general", "dimension", "typography"]) {
            let obj = context[section];
            for (let key in obj) {
                let label = labels[key] || key;
                if (obj[key]) {
                    if (UnitFields.includes(key)) {
                        if (obj[key]["value"] && obj[key]["unit"]) {
                            Style[label] = obj[key]["value"] + obj[key]["unit"];
                        }
                    } else if (SubUnitFields.includes(key)) {
                        for (let subKey in obj[key]) {
                            let subLabel = label;
                            if (UnitFields.includes(subKey)) {
                                subLabel = subLabel + "-" + subKey;
                                if (obj[key][subKey]["value"] && obj[key][subKey]["unit"]) {
                                    Style[subLabel] = obj[key][subKey]["value"] + obj[key][subKey]["unit"];
                                }
                            }
                        }
                    } else {
                        Style[label] = obj[key];
                    }
                }
            }
        }
        return Style;
    }

    _StyleObjectToContext(id: any, control: any, cssStyle: any) {
        let UnitFields: any = ["top", "right", "left", "bottom", "width", "height", "maxWidth", "minHeight", "size"];
        let SubUnitFields: any = ["margin", "padding"];
        let labels: any = {
            maxWidth: "max-width",
            minHeight: "min-height",
            font: "font-family",
            size: "font-size",
            weight: "font-weight",
            align: "text-align",
            decoration: "text-decoration"
        };
        let context: any = this.GetStyleContext();
        context.id = "#" + id;
        context.control = control;

        for (let section of ["general", "dimension", "typography"]) {
            let obj = context[section];
            for (let key in obj) {
                let label = labels[key] || key;
                let value = cssStyle.getPropertyValue(label);
                if(section == "typography") {
                    if(key == "font") {
                        value = value.replace('"', "").replace('"', "");
                    }
                    console.log("value", label, value);
                }
               

                if (UnitFields.includes(key)) {
                    let num = value == "auto" ? "" : value.replace(/[^0-9\.]+/g, "");
                    let unit = value == "auto" ? "" : value.replace(num, "");
                    obj[key]["value"] = num;
                    obj[key]["unit"] = unit;
                } else if (SubUnitFields.includes(key)) {
                    for (let subKey in obj[key]) {
                        let subLabel = label;
                        if (UnitFields.includes(subKey)) {
                            subLabel = subLabel + "-" + subKey;
                            value = cssStyle.getPropertyValue(subLabel);
                            let num = value == "0px" ? "" : value.replace(/[^0-9\.]+/g, "");
                            let unit = value == "0px" ? "" : value.replace(num, "");
                            obj[key][subKey]["value"] = num;
                            obj[key][subKey]["unit"] = unit;
                        }
                    }
                } else {
                    obj[key] = value;
                }
            }
        }

        console.log("context", context);

        return context;
    }
}