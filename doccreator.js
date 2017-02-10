//global vars
var parentName = '';
var currentLanguage = '';
var copyArea;
var path = [];
var waitTime = 500;

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

function chooseTargetCatalog() {
    var timeout = setTimeout(function () {
        if ($('.umbModalBox iframe').contents().find('li.loaded a.clicked').length > 0) {
            clearTimeout(timeout);
            $('.umbModalBox iframe').contents().find('li.loaded a.clicked')[0].click();
            $('.umbModalBox iframe').contents().find('.guiInputButton')[0].click();
            var intval2 = setInterval(function () {
                if ($('.umbModalBox iframe').contents().find('a:contains(Закрыть это окно)').length > 0) {
                    clearInterval(intval2);
                    $('.umbModalBox iframe').contents().find('a:contains(Закрыть это окно)')[0].click();
                    docsCreateCounter();
                }
            }, waitTime);
        }else{
            chooseTargetCatalog();
        }
    }, waitTime * 2);
}

function initDocDragger() {
    store.get('docDragger', function (value) {
        chrome.extension.sendMessage({docDragger: "on"});
        chrome.storage.local.remove('docDragger');
    }, function () {
        $('.menuLabel:contains("Обновить узлы")').click();
    });
}

function getCopyArea() {
    return $('[ng-hide="searchInfo.showSearch"]')
        .find('a:Contains("' + currentLanguage + '")').closest('li');
}

function checkOkButton() {
    var timeout = setTimeout(function () {
        if ($('button[ng-click="nav.hideDialog()"]').length !== 0){
            clearTimeout(timeout);
            $('button[ng-click="nav.hideDialog()"]').click();
        }else{
            checkOkButton();
        }
    }, waitTime);
}

function openCopyTree() {
    $.each(path, function (id, el) {
        setTimeout(function () {
            // console.log(id !== path.length);
            if (id !== path.length) {
                copyArea.find('a:Contains("' + el + '")').prev('i').prev('ins').click();
            }else {
                copyArea.find('a:Contains("' + el + '")')[0].click();
                // $('button[ng-click="copy()"]').click();
                // checkOkButton();
            }
        }, waitTime * ++id);
    });
}

function setPathToDir() {
    $.each($('ins.icon-navigation-down'), function (id, el) {
        path[id] = $(el).next('i').next('a').text();
    });
}

function run() {
    var element = $('li.current ins').next('i').next('a');
    parentName = $('li.current')
        .closest('li.has-children')
        .children('div')
        .children('ins')
        .next('i')
        .next('a')
        .text();
    currentLanguage = $('li.current').closest('li[tree=this]').find('a').first().text();
    var clickedDocName = element.text();
    store.set('clickedDocName', clickedDocName);
    setPathToDir();
    contextMenuClick(element[0]);
    setTimeout(function () {
        $('span.menu-label:contains(Копировать)').closest('a')[0].click();
        setTimeout(function () {
            copyArea = getCopyArea();
            openCopyTree();
        }, waitTime * 2);
        // chooseTargetCatalog(1000);
    }, waitTime * 2);
}

run();
