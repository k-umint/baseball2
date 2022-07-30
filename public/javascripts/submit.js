class CSV {
    constructor(data, keys = false) {
        this.ARRAY = Symbol('ARRAY')
        this.OBJECT = Symbol('OBJECT')

        this.data = data

        if (CSV.isArray(data)) {
            if (0 == data.length) {
                this.dataType = this.ARRAY
            } else if (CSV.isObject(data[0])) {
                this.dataType = this.OBJECT
            } else if (CSV.isArray(data[0])) {
                this.dataType = this.ARRAY
            } else {
                throw Error('Error: 未対応のデータ型です')
            }
        } else {
            throw Error('Error: 未対応のデータ型です')
        }

        this.keys = keys
    }

    toString() {
        if (this.dataType === this.ARRAY) {
            return this.data.map((record) => (
                record.map((field) => (
                    CSV.prepare(field)
                )).join(',')
            )).join('\n')
        } else if (this.dataType === this.OBJECT) {
            const keys = this.keys || Array.from(this.extractKeys(this.data))

            const arrayData = this.data.map((record) => (
                keys.map((key) => record[key])
            ))

            console.log([].concat([keys], arrayData))

            return [].concat([keys], arrayData).map((record) => (
                record.map((field) => (
                    CSV.prepare(field)
                )).join(',')
            )).join('\n')
        }
    }

    save(filename = 'data.csv') {
        if (!filename.match(/\.csv$/i)) { filename = filename + '.csv' }

        console.info('filename:', filename)
        console.table(this.data)

        const csvStr = this.toString()

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvStr], { 'type': 'text/csv' });
        const url = window.URL || window.webkitURL;
        const blobURL = url.createObjectURL(blob);

        let a = document.createElement('a');
        a.download = decodeURI(filename);
        a.href = blobURL;
        a.type = 'text/csv';

        a.click();
    }

    extractKeys(data) {
        return new Set([].concat(...this.data.map((record) => Object.keys(record))))
    }

    static prepare(field) {
        return '"' + ('' + field).replace(/"/g, '""') + '"'
    }

    static isObject(obj) {
        return '[object Object]' === Object.prototype.toString.call(obj)
    }

    static isArray(obj) {
        return '[object Array]' === Object.prototype.toString.call(obj)
    }
}


function convertRegisteredData() {

    let jsonObject = [];

    for (let i = 1; i < 10; i++) {

        //get values
        let positionItem = document.getElementById(`position-${i}`).value;
        let butterItem = document.getElementById(`butterbox-${i}`).value;
        let nameItem = document.getElementsByName('name')[i - 1].value;
        // console.log(positionItem);
        // console.log(butterItem);
        // console.log(nameItem);

        let object = {
            position: positionItem,
            butter: butterItem,
            player: nameItem
        }

        jsonObject.push(object);

    }

    console.log(JSON.stringify(jsonObject, null, 2));

    // let startingCSV = new CSV(jsonObject);
    // startingCSV.save('starting.csv');
    // console.log(startingCSV.toString());

    aaa(jsonObject);

}

async function aaa(jsonObject) {

    console.log(jsonObject)

    fetch('/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject)
                // body: JSON.stringify({ "test": "test" })
        })
        .then((res) => (res.json()))
        .then((body) => {
            // console.log(JSON.stringify(body));
            console.log(body);
        })
}


// function gameStart() {

//     // let jsonObject = [];
//     let dateItem = document.getElementById('date').innerHTML;
//     let opponentItem = document.getElementById('opponent').value;

//     // console.log('dateItem : ' + dateItem);
//     // console.log('opponentItem : ' + opponentItem);

//     let object = {
//         date: dateItem,
//         opponent: opponentItem,
//     };

//     // jsonObject.push(object);

//     fetch('/members',
//         {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(object)
//         })
//         .then((res) => {
//             console.log(res);
//         })
//     // .then((body) => {
//     // console.log("aaaaaaaaaaaaaaaa");
//     // });
// }

function getBoxResult(event) {

    event.preventDefault();
    var form = document.createElement('form');
    form.action = event.target.href;
    form.method = 'post';

    document.body.appendChild(form);

    let aTagId = event.target.id;
    let numArr = aTagId.split('-');

    let orderNum = numArr[0];
    if (!orderNum) {
        orderNum = numArr[1] * -1;
    }
    console.log("orderNum : " + orderNum);

    let nameDiv = document.getElementById(`name_${orderNum}`);
    console.log("submit.js - 'nameDiv' : " + nameDiv.innerHTML);
    let playerName = nameDiv.innerHTML.trim();

    let inputTextOrder = document.createElement('input');
    inputTextOrder.type = 'number';
    inputTextOrder.name = 'orderNum';
    inputTextOrder.value = orderNum

    let inputTextName = document.createElement('input');
    inputTextName.type = 'text';
    inputTextName.name = 'playerName';
    inputTextName.value = playerName;

    form.appendChild(inputTextOrder);
    form.appendChild(inputTextName);

    form.submit();

}


//打席結果の変更があった場合にフラグを1にする
function changeFlg() {
    let changeFlag = document.getElementById('changeFlag');
    changeFlag.value = 1;
};

function changeNameFlg() {
    let changeFlag = document.getElementById('changeNameFlag');
    changeFlag.value = 1;
};

function changePositionFlg() {
    let changeFlag = document.getElementById('changePositionFlag');
    changeFlag.value = 1;
};

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('sw.js').then(async(registration) => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }).catch((err) => {
//         console.log('ServiceWorker registration failed: ', err);
//     });
// }