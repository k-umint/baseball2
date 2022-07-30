let resultTypeObj = {
    R: "",
    A: "安打",
    B: "二塁打",
    C: "三塁打",
    D: "本塁打",
    E: "エラー",
    F: "野選",
    G: "その他(セーフ)",
    H: "ゴロ",
    I: "フライ",
    J: "ライナー",
    K: "犠打",
    L: "犠飛",
    M: "邪飛",
    N: "邪直",
    O: "併殺",
    P: "三振",
    Q: "その他(アウト)",
}

let resultsObj = {
    A: {
        1: "投安",
        2: "捕安",
        3: "一安",
        4: "二安",
        5: "三安",
        6: "遊安",
        7: "左安",
        8: "中安",
        9: "右安",
    },
    B: {
        1: "左2",
        2: "中2",
        3: "右2",
    },
    C: {
        1: "左3",
        2: "中3",
        3: "右3",
    },
    D: {
        1: "左本",
        2: "中本",
        3: "右本",
        4: "走本",
    },
    E: {
        1: "投失",
        2: "捕失",
        3: "一失",
        4: "二失",
        5: "三失",
        6: "遊失",
        7: "左失",
        8: "中失",
        9: "右失",
    },
    F: {
        1: "投野選",
        2: "捕野選",
        3: "一野選",
        4: "二野選",
        5: "三野選",
        6: "遊野選",
        7: "左野選",
        8: "中野選",
        9: "右野選",
    },
    G: {
        1: "四球",
        2: "死球",
        3: "敬遠",
        4: "振逃",
        5: "打撃妨",
    },
    H: {
        1: "投ゴロ",
        2: "捕ゴロ",
        3: "一ゴロ",
        4: "二ゴロ",
        5: "三ゴロ",
        6: "遊ゴロ",
        7: "左ゴロ",
        8: "中ゴロ",
        9: "右ゴロ",
    },
    I: {
        1: "投飛",
        2: "捕飛",
        3: "一飛",
        4: "二飛",
        5: "三飛",
        6: "遊飛",
        7: "左飛",
        8: "中飛",
        9: "右飛",
    },
    J: {
        1: "投直",
        2: "捕直",
        3: "一直",
        4: "二直",
        5: "三直",
        6: "遊直",
        7: "左直",
        8: "中直",
        9: "右直",
    },
    K: {
        1: "投犠打",
        2: "捕犠打",
        3: "一犠打",
        4: "二犠打",
        5: "三犠打",
        6: "遊犠打",
        7: "左犠打",
        8: "中犠打",
        9: "右犠打",
    },
    L: {
        1: "投犠飛",
        2: "捕犠飛",
        3: "一犠飛",
        4: "二犠飛",
        5: "三犠飛",
        6: "遊犠飛",
        7: "左犠飛",
        8: "中犠飛",
        9: "右犠飛",
    },
    M: {
        1: "投邪飛",
        2: "捕邪飛",
        3: "一邪飛",
        4: "二邪飛",
        5: "三邪飛",
        6: "遊邪飛",
        7: "左邪飛",
        8: "中邪飛",
        9: "右邪飛",
    },
    N: {
        1: "投邪直",
        2: "捕邪直",
        3: "一邪直",
        4: "二邪直",
        5: "三邪直",
        6: "遊邪直",
        7: "左邪直",
        8: "中邪直",
        9: "右邪直",
    },
    O: {
        1: "投併殺",
        2: "捕併殺",
        3: "一併殺",
        4: "二併殺",
        5: "三併殺",
        6: "遊併殺",
        7: "左併殺",
        8: "中併殺",
        9: "右併殺",
    },
    P: {
        1: "空三振",
        2: "見三振",
    },
    Q: {
        1: "守妨害",
    },
}

let selectTypeElement = document.getElementById('selectType');
let selectTypeValue = document.getElementById('selectType').value;
let selectBattingResult = document.getElementById('selectBattingResult');
let resultInputElement = document.getElementById('result');
let changeButtonElement = document.getElementById('changeButton');
let resultEnterInputElement = document.getElementById('resultEnterBtn');
let finishButtonElement = document.getElementById('finishButton');
let resultTypeLabelElement = document.getElementById('resultType');
let selectTypeSelectElement = document.getElementById('selectType');
let battingResultLabelElement = document.getElementById('battingResult');
let selectBattingResultSelectElement = document.getElementById('selectBattingResult');

for (const key in resultTypeObj) {
    let optionResultType = document.createElement('option');
    optionResultType.setAttribute('value', key);
    optionResultType.textContent = resultTypeObj[key];

    if (key == "R") {
        optionResultType.selected = true;
    }

    selectTypeElement.appendChild(optionResultType);
}

function changeFlgaaa() {

    // let selectBattingResult = document.getElementById('selectBattingResult');
    selectBattingResult.innerHTML = "";

    let selectTypeValue2 = document.getElementById('selectType').value;
    let battingResultObj2 = resultsObj[selectTypeValue2];

    for (const key in battingResultObj2) {
        let optionBattingResult = document.createElement('option');
        optionBattingResult.setAttribute('value', key);
        optionBattingResult.textContent = battingResultObj2[key];

        selectBattingResult.appendChild(optionBattingResult);
    }
};

function changeButtonClick() {

    resultInputElement.hidden = true;
    changeButtonElement.hidden = true;
    resultEnterInputElement.hidden = true;
    finishButtonElement.hidden = false;
    resultTypeLabelElement.hidden = false;
    selectTypeSelectElement.hidden = false;
    battingResultLabelElement.hidden = false;
    selectBattingResultSelectElement.hidden = false;

}

function finishButtonClick() {

    resultInputElement.hidden = false;
    changeButtonElement.hidden = false;
    resultEnterInputElement.hidden = false;
    finishButtonElement.hidden = true;
    resultTypeLabelElement.hidden = true;
    selectTypeSelectElement.hidden = true;
    battingResultLabelElement.hidden = true;
    selectBattingResultSelectElement.hidden = true;

    let selectedIndex = selectBattingResultSelectElement.selectedIndex;
    console.log(selectedIndex);

    if (selectedIndex >= 0) {
        let selectedValue = selectBattingResultSelectElement.options[selectedIndex].innerText;
        resultInputElement.value = selectedValue

        let changeFlag = document.getElementById('changeFlag');
        changeFlag.value = 1;
    }

}

function undisabled() {
    document.getElementById("result").disabled = false;
    return true;
}