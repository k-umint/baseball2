let tbody = document.getElementsByTagName('tbody')[0];
let trElement = document.getElementsByClassName('tablebody-tr');
console.log("trElement.length : " + trElement.length);

for (let i = 1; i < 10; i++) {

    for (let j = 1; j < 7; j++) {

        let aElement = document.createElement('a');
        aElement.setAttribute('id', `aTagId_${i}-${j}`);
        aElement.setAttribute('href', `/batterBox?boxId=${i}-${j}`);
        aElement.setAttribute('onclick', 'sendGet(event)');

        let divElement = document.createElement('div');
        divElement.setAttribute('id', `box_${i}-${j}`);
        divElement.setAttribute('class', `hitting_result`);

        let tdElement = document.createElement('td');
        tdElement.setAttribute('class', `batter_box_td`);

        divElement.appendChild(aElement);
        tdElement.appendChild(divElement);
        trElement[i - 1].appendChild(tdElement);

    }

}