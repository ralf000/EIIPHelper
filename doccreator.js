function stopCopied() {
    chrome.storage.local.remove('createNum');
    chrome.extension.sendMessage({docCreateAgain: "off"});
    chrome.extension.sendMessage({docsCreator: 'off'});
}

function docsCreateCounter() {
    chrome.storage.local.get('createNum', function (result) {
        var createNum = result.createNum;
        if (createNum && createNum > 0) {
            chrome.extension.sendMessage({docCreateAgain: "on"});
        } else {
            stopCopied();
            contextMenuClick($('li.loaded a.clicked').closest('ul').prev('a')[0]);
            initDocDragger();
        }
        chrome.storage.local.set({createNum: --createNum});
    });
}

function chooseTargetCatalog(waitTime) {
    var intval = setInterval(function () {
        if ($('.umbModalBox iframe').contents().find('li.loaded a.clicked').length > 0) {
            clearInterval(intval);
            $('.umbModalBox iframe').contents().find('li.loaded a.clicked')[0].click();
            $('.umbModalBox iframe').contents().find('.guiInputButton')[0].click();
            var intval2 = setInterval(function () {
                if ($('.umbModalBox iframe').contents().find('a:contains(Закрыть это окно)').length > 0) {
                    clearInterval(intval2);
                    $('.umbModalBox iframe').contents().find('a:contains(Закрыть это окно)')[0].click();
                    docsCreateCounter();
                }
            }, waitTime);
        }
    }, waitTime);
}

function initDocDragger() {
    chrome.storage.local.get('docDragger', function (result) {
        var docDragger = result.docDragger;
        if (docDragger === 'on') {
            chrome.extension.sendMessage({docDragger: "on"});
            chrome.storage.local.remove('docDragger');
        }else{
            $('.menuLabel:contains("Обновить узлы")').click();
        }
    });
}

if (checkClickedElement()) {
    var clickedDocName = $('li.loaded a.clicked').text();
    chrome.storage.local.set({clickedDocName: clickedDocName});
    contextMenuClick($('li.loaded a.clicked')[0]);
    $('.menuLabel:contains(Копировать)').click();
    chooseTargetCatalog(1000);
} else {
    getErrorMessage('Ошибка', 'Не выбран документ для копирования.\nВыберите документ для копирования (кликните на нём)');
    stopCopied();
}