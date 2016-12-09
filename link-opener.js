function chooseLanguage(langName) {
    var fullLangsMap = {
        ru: 'Русский',
        en: 'Английский',
        de: 'Немецкий',
        es: 'Испанский',
        ch: 'Китайский',
        ae: 'Арабский'
    };

    var tree = $('ul a.sprTree');
    var language = tree.find('div:contains("' + fullLangsMap.langName + '")');
    if (language.length !== -1)
        true // TODO
}

function checkLanguage(url) {
    var langName = '';
    var langsMap = ['en', 'de', 'es', 'ch', 'ae'];
    var parts = explode('.', url);
    var language = explode('://', parts[0]);
    if (language[1] && language[1].indexOf(langsMap) !== -1)
        langName = language[1];
    else
        langName = 'ru';
    chooseLanguage(langName);
}

/**
 * получает сохраненный url
 * @param callback
 */
function getUrl(callback) {
    chrome.storage.local.get('url', function (result) {
        var url = result.url;
        if (url) {
            callback(url);
        }
    });
}

getUrl(checkLanguage);