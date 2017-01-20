//init global variables
var url = '';
var time = 400;
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
        if ($('ul a.sprTree').find('div:Contains("' + fullLangName + '")').length === 0) {
            treeClick('Содержимое');
            checkLanguage(fullLangName);
        }
        treeClick(fullLangName);
        openByLink();
    }, time * 3);
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
        return;

    var timeout = setTimeout(function () {
        if ($('a.traymedia').length !== 0) {
            clearTimeout(timeout);
            $('a.traymedia')[0].click();
            throw 'stop';
        } else {
            checkMedia();
        }
    }, time)
}

function checkLanguage() {
    checkMedia();

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
    var currentTree = $('li.open:last div');
    return currentTree
        .filter(function () {
            return regex.test($(this).text());
        })
        .closest('li')
        .not('.dim');
    // .last();
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
    }, time);
}

function next(elementName, element) {
    treeClick(elementName);
    cnt++;
    if (pathPieces[cnt])
        openByLink();
    else {
        element.find('a')[0].click();
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

getUrl(checkLanguage);