//init global variables
var url = '';
var time = 500;
var pathPieces = [];
var cnt = 0;

function languageMapInit(langName) {
    var fullLangsMap = {
        ru: 'Русский',
        en: 'Английский',
        de: 'Немецкий',
        es: 'Испанский',
        ch: 'Китайский',
        ae: 'Арабский'
    };
    var fullLangName = fullLangsMap[langName];
    chooseLanguage(fullLangName);

}

function chooseLanguage(fullLangName) {
    setTimeout(function () {
        if ($('ul.umb-tree > li > ul').find('a:Contains("' + fullLangName + '")').length === 0) {
            treeClick('Содержимое');
            checkLanguage(fullLangName);
        }
        treeClick(fullLangName);
        openByLink();
    }, time);
}

function openByLink() {
    pathHandler();
    wait(pathPieces[cnt]);
}

function pathHandler() {
    var parts = url.split('://');
    var path = parts[1];
    pathPieces = path.split('/');
    //не продолжаем если главная страница
    if (pathPieces.length === 1)
        return;
    pathPieces = pathPieces.slice(1, -1);
    pathPieces = pathPieces.map(function (el) {
        //превращаем каждый элемент массива в регулярное выражение и декодируем кириллицу
        return decodeURI(el.replace(/-/g, '.?[- ].?'));
    });
}

/**
 * Частный случай для открытия раздела с файлами
 */
function checkMedia() {
    if (url !== 'files')
        return false;

    var timeout = setTimeout(function () {
        if ($('a.traymedia').length !== 0) {
            clearTimeout(timeout);
            $('a.traymedia')[0].click();
            return true;
        } else {
            checkMedia();
        }
    }, time)
}

function checkLanguage() {
    if (checkMedia())
        return;

    var langName = '';
    var langsMap = ['en', 'de', 'es', 'ch', 'ae'];
    var parts = url.split('.');
    var language = parts[0].split('://');
    if (language[1] && in_array(language[1], langsMap))
        langName = language[1];
    else
        langName = 'ru';
    languageMapInit(langName);
}

function treeClick(elementName) {
    var element = getElement(elementName);
    return element.click();
}

function getElement(elementName) {
    var regex = new RegExp(elementName, 'i');
    var currentTree = $('ins.icon-navigation-down:last').closest('li').find('a').not('.umb-options');
    if (currentTree.length === 0) {
        return $('ul.umb-tree > li > ul')
            .find('a:Contains("' + elementName + '")')
            .prev()
            .prev();
    }
    return currentTree
        .filter(function () {
            return regex.test($(this).text());
        })
        .prev()
        .prev();
}

function wait(elementName) {
    var intvalId = setTimeout(function () {
        var element = getElement(elementName);
        if (element.length !== 0) {
            clearTimeout(intvalId);
            next(elementName, element);
        } else {
            wait(elementName);
        }
    }, time * 1.3);
}

function next(elementName, element) {
    treeClick(elementName);
    cnt++;
    if (pathPieces[cnt])
        openByLink();
    else {
        setTimeout(function () {
            element.next().next()[0].click();
        }, time);
    }
}

/**
 * получает сохраненный url
 * @param callback
 */
function getUrl(callback) {
    chrome.storage.local.get('url', function (result) {
        url = result.url;
        if (url) {
            callback(url);
        }
    });
}

function checkAuth() {
    var timeout = setTimeout(function () {
        if ($('form[name=loginForm]').length === 0) {
            clearTimeout(timeout);
            checkLanguage();
        } else {
            checkAuth();
        }
    }, time * 2)
}

getUrl(checkAuth);