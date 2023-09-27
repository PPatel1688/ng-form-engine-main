const HTMLTemplate = `
<html>
<head>
</head>
<body class="fe-dashed" data-fe-type="Body">
</body>
</html>
`;


const StyleHTML = `
* {
    box-sizing: border-box;
}
* ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1)
}
* ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2)
}
* ::-webkit-scrollbar {
    width: 10px
}
body {
    margin: 0;
    background-color: #fff;
    font-family: "Arial, Helvetica, sans-serif";
}
[data-fe-type="Wrapper"] {
    min-height: 100vh;
    padding-top: 0.001em;
}
[data-fe-type="Row"] {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: 10px;
}
[data-fe-type="Cell"] {
    min-height: 75px;
    flex-grow: 1;
    flex-basis: 100%;
}
[data-fe-type="Text"] {
    padding: 10px;
}
[data-fe-type="Image"] {
    background: #f5f5f5;
    border: none;
    height: 100px;
    width: 100px;
    display: block;
    outline: 3px solid #ffca6f;
    cursor: pointer;
    outline-offset: -2px;
}

[data-fe-type="Checkbox List"] div,
[data-fe-type="Checkbox"] {
    padding: 5px;
}
[data-fe-type="Checkbox List"] div label,
[data-fe-type="Checkbox"] label {
    display: flex;
    align-items: center;
}
[data-fe-type="Checkbox List"] div label input[type=checkbox],
[data-fe-type="Checkbox"] label input[type=checkbox] {
    flex: none;
}
[data-fe-type="Radio List"] div,
[data-fe-type="Radio"] {
    padding: 5px;
}
[data-fe-type="Radio List"] div label,
[data-fe-type="Radio"] label {
    display: flex;
    align-items: center;
}
[data-fe-type="Radio List"] div label input[type=radio],
[data-fe-type="Radio"] label input[type=radio] {
    flex: none;
    margin: 3px 3px 3px 4px;
}

[data-fe-type="Radio List"],
[data-fe-type="Checkbox List"] {
    padding: 10px;
}
[data-fe-type="Table"] {
    width: 100%;
    padding: 10px;
}
[data-fe-type="Table"] table {
    width: 100%;
    border-collapse: collapse;
}
`;

const StyleBuilder = `
.fe-dashed *[data-fe-highlightable] {
    outline: 1px dashed rgba(170,170,170,0.7);
    outline-offset: -2px;
}
.fe-dashed [data-fe-type="wrapper"] {
    min-height: 100vh;
    padding-top: 0.001em;
}
.fe-selected {
    outline: 2px solid #3b97e3 !important;
    outline-offset: -2px;
}
.fe-selected-parent {
    outline: 2px solid #ffca6f !important;
}
.fe-no-select {
    user-select: none;
    -webkit-user-select:none;
    -moz-user-select: none;
}
.fe-freezed {
    opacity: 0.5;
    pointer-events: none;
}
.fe-no-pointer {
    ointer-events: none;
}
.fe-plh-image {
    background: #f5f5f5;
    border: none;
    height: 100px;
    width: 100px;
    display: block;
    outline: 3px solid #ffca6f;
    cursor: pointer;
    outline-offset: -2px
}
`;

export { HTMLTemplate, StyleHTML, StyleBuilder };