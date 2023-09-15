const template = `
<html>
<head>
    <style>
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
            background-color: #fff
        }

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

        [data-fe-type="Checkbox"] {
            display: flex;
            align-items: center;
            padding: 5px;
        }

        [data-fe-type="Checkbox"] input[type=checkbox] {
            flex: none;
        }

        [data-fe-type="Radio"] {
            display: flex;
            align-items: center;
            padding: 5px;
        }

        [data-fe-type="Radio"] input[type=radio] {
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

        [data-fe-type="Wrapper"] {
            min-height: 100vh;
            padding-top: 0.001em;
        }
    </style>
</head>
<body class="fe-dashed" data-fe-type="Body">
    <div data-fe-highlightable="true" id="ivjz" data-fe-type="Wrapper" class="" draggable="true">
        <div id="iud7" data-fe-highlightable="true" data-fe-type="Row" draggable="true" class="fe-row">
            <div id="ivdu" data-fe-highlightable="true" data-fe-type="Cell" draggable="true" class="fe-cell">1</div>
            <div id="i32z" data-fe-highlightable="true" data-fe-type="Cell" draggable="true" class="fe-cell">2</div>
            <div id="i32o" data-fe-highlightable="true" data-fe-type="Cell" draggable="true" class="fe-cell">3</div>
        </div>
        <div id="iuv4" data-fe-highlightable="true" data-fe-type="Row" draggable="true" class="fe-row">
            <div id="i32P" data-fe-highlightable="true" data-fe-type="Cell" draggable="true" class="fe-cell">
                <div data-fe-highlightable="true" id="iavs" data-fe-type="Text" draggable="false" contenteditable="true">Insert your text here</div>
            </div>
        </div>
        <div id="iuv9" data-fe-highlightable="true" data-fe-type="Row" draggable="true" class="fe-row">

        </div>
        <label for="c1"><input type="checkbox" name="color" value="red" id="c1">Red</label>
    </div>
</body>
</html>
`;



export default template;