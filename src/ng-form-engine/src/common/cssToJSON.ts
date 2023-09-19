
function tokenizer(code: any) {
    const tokens = [];
    let token = "";
    const whitespc = ["\r\n", "\n\r", "\n", "\r"];
    let lastChar = "\0";
    let nextChar = "\0";
    let char = "\0";
    const specialChars = ["{", "}", ":", ";"];
    const specialCharsPB = ["{", "}", ";"];
    let sc = null;
    let inBrackets = false;

    for (let i = 0; i < code.length; i++) {
        if (i) lastChar = code.charAt(i - 1);
        char = code.charAt(i);
        if (i + 1 < code.length) nextChar = code.charAt(i + 1);

        if (~whitespc.indexOf(char) && ~whitespc.indexOf(lastChar)) {
            continue;
        }

        sc = inBrackets ? specialChars : specialCharsPB;

        if (~sc.indexOf(char)) {
            if (char === "{") inBrackets = true;
            if (char === "}") inBrackets = false;
            tokens.push(token);
            tokens.push(char);
            token = "";
            continue;
        }

        token += char;
    }

    if (token) tokens.push(token);

    return tokens.map((token) => { return token.trim(); }).filter((token) => { return token; });
}

function cssToJSON(tokens: any) {
    const items: any = [];
    let actualItem: any = null;
    let actualProp: any = null;
    function readSelector(token: any) {
        const selectors = token.split(",");

        actualItem = {
            originalValue: token,
            selectors: selectors,
            values: {}
        };

        actualProp = null;
        items.push(actualItem);

        return readBracketO;
    }

    function readBracketO(token: any) {
        if (token !== "{") throw new Error("expected '{' ");

        return readProperty;
    }

    function readBracketC(token: any) {
        if (token !== "}") throw new Error("expected '}' ");
        return readSelector;
    }

    function readDefinition(token: any) {
        if (token !== ":") throw new Error("expected ':' ");

        return readValue;
    }

    function readProperty(token: any) {
        if (token === "}") return readBracketC(token);

        const property = token;
        actualProp = property;

        if (!actualItem.values[property]) {
            actualItem.values[property] = [];
        }

        return readDefinition;
    }

    function readValue(token: any) {
        actualItem.values[actualProp].push(token);

        return readFinal;
    }

    function readFinal(token: any) {
        if (token === "}") return readBracketC(token);
        if (token !== ";") throw new Error("expected ';' ");
        return readProperty;
    }

    let nextAction = readSelector;
    let i = 0;
    tokens.forEach((token: any) => {
        i++;
        nextAction = nextAction(token);
    });

    return renderJS(items);
}

function renderJS(items: any) {
    let objects = ["{"];
    objects = objects.concat(items.map(renderItem).join(","));
    objects.push("}");
    return objects.join("");
}

function renderItem(item: any) {
    const code: any = [];

    let properties: any = [];

    for (const prop in item.values) {
        if (item.values.hasOwnProperty(prop)) {
            const propitem = {
                name: prop,
                value: item.values[prop][item.values[prop].length - 1]
            };
            let markup = '"';
            if (~propitem.value.indexOf('"')) {
                markup = "'";
                propitem.value = propitem.value.replace(/'/gi, "\\'");
            }
            properties.push('"' + propitem.name + '"' + ":" + markup + propitem.value + markup);
        }
    }

    properties = properties.map((x: any) => { return x; });

    item.selectors.forEach((i: any) => {
        code.push('"' + i + '"' + ":{");
        code.push(properties.join(","));
        code.push("}");
    });

    return code.join("");
}

export default function (code: any) {
    return JSON.parse(cssToJSON(tokenizer(code)));
}