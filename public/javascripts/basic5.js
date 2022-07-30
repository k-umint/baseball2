let positionObject = {
    none: '',
    pitcher: '投',
    catcher: '捕',
    first: '一',
    second: '二',
    third: '三',
    short: '遊',
    leftfield: '左',
    center: '中',
    rightfield: '右',
}

let selectElement = document.getElementById('position');
let positionHiddenValue = document.getElementById('position_hidden').value;

for (const key in positionObject) {
    let optionElement_position = document.createElement('option');
    optionElement_position.setAttribute('value', key);
    optionElement_position.textContent = positionObject[key];

    if (key == positionHiddenValue) {
        optionElement_position.selected = true;
    }

    selectElement.appendChild(optionElement_position);
    selectElement.setAttribute('class', 'custom-select');
}