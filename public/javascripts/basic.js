let tbody = document.getElementsByTagName('tbody')[0];

for (let i = 1; i < 10; i++) {

    let trElement = document.createElement('tr');
    let thElement = document.createElement('th');

    thElement.setAttribute('class', 'text-center');
    thElement.setAttribute('scope', 'row');
    thElement.textContent = i;
    trElement.appendChild(thElement);


    //=========================================================================

    let tdElement_1 = document.createElement('td');
    let selectElement_position = document.createElement('select')
    selectElement_position.setAttribute('id', `position-${i}`);
    selectElement_position.setAttribute('name', `position-${i}`);

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

    for (const key in positionObject) {

        let optionElement_position = document.createElement('option');
        optionElement_position.setAttribute('value', key);
        optionElement_position.textContent = positionObject[key];

        // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓動作確認用↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

        if (key == Object.keys(positionObject)[i]) {
            optionElement_position.selected = true;
        }

        // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑動作確認用↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

        selectElement_position.appendChild(optionElement_position);
        selectElement_position.setAttribute('class', 'custom-select');
    }

    tdElement_1.appendChild(selectElement_position);
    trElement.appendChild(tdElement_1);

    //=========================================================================

    // let tdElement_2 = document.createElement('td');
    // let selectElement_butter = document.createElement('select')
    // selectElement_butter.setAttribute('id', `batterbox-${i}`);
    // selectElement_butter.setAttribute('name', `batterbox-${i}`);

    // let butterObject = {
    //     none: '',
    //     right: '右',
    //     left: '左',
    //     both: '両',
    // }

    // for (const key in butterObject) {
    //     let optionElement_butter = document.createElement('option');
    //     optionElement_butter.setAttribute('value', key);
    //     optionElement_butter.textContent = butterObject[key];
    //     if (key == "right") {
    //         optionElement_butter.setAttribute('selected', null);
    //     }
    //     selectElement_butter.appendChild(optionElement_butter);
    //     selectElement_butter.setAttribute('class', 'custom-select');
    // }

    // tdElement_2.appendChild(selectElement_butter);
    // trElement.appendChild(tdElement_2);

    //=========================================================================

    let tdElement_3 = document.createElement('td');
    let inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('class', 'form-control');
    inputElement.setAttribute('name', `name-${i}`);
    inputElement.setAttribute('size', '10');
    inputElement.setAttribute('maxlength', '15');

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓動作確認用↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    let playerName = ''

    switch (i) {
        case 1:
            playerName = '末廣風真';
            break;
        case 2:
            playerName = '新村一真';
            break;
        case 3:
            playerName = '山本樹';
            break;
        case 4:
            playerName = '金崎素良';
            break;
        case 5:
            playerName = '山田まさや';
            break;
        case 6:
            playerName = '中野雄太';
            break;
        case 7:
            playerName = '若井拓也';
            break;
        case 8:
            playerName = '末廣海人';
            break;
        case 9:
            playerName = '山川創至';
            break;

        default:
            break;
    }

    inputElement.value = playerName;
    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑動作確認用↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑



    tdElement_3.appendChild(inputElement);
    trElement.appendChild(tdElement_3);

    tbody.appendChild(trElement);

}

