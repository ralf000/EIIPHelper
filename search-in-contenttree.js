//globals
var searchText = '';
var cachingTime = 30;
//Если работаем с тестом
var cacheDateInDaysName = 'cacheDateInDays';
var contentTreePageName = 'contentTreePage';
var contentTreeLink = 'https://investmoscow.ru/contenttree';
var host = 'https://investmoscow.ru';

/**
 * Если работаем с тестом
 */
function switchToTest() {
    cacheDateInDaysName = 'cacheDateInDaysTest';
    contentTreePageName = 'contentTreePageTest';
    contentTreeLink = 'http://investmoscow.upt24.ru/contenttree';
    host = 'http://investmoscow.upt24.ru';
}

function getCurrentDateInDays() {
    return Math.round(Date.now() / 1000 / 60 / 60 / 24);
}

function getAndSearch(result) {
    searchText = result;
    store.delete('searchText');

    store.get('test',
        function () {
            //если нужно открыть ссылку теста
            store.delete('test');
            switchToTest();
            hasSavedContentTree();
        }, function () {
            //если нужно открыть ссылку прома
            hasSavedContentTree();
        });
}

function saveContentTreePage(html) {
    store.set(contentTreePageName, html);
    store.set(cacheDateInDaysName, getCurrentDateInDays());
}

function hasSavedContentTree() {
    store.get(cacheDateInDaysName,
        function () {
            checkCachedDate();
        },
        function () {
            topLayer.addTopLayerOnPage();
            getContentTreePage(function (html) {
                topLayer.deleteTopLayer();
                saveContentTreePage(html);
                search(html);
            });
        });
}

function checkCachedDate() {
    store.get(cacheDateInDaysName, function (cacheDateInDays) {
        var nowInDays = getCurrentDateInDays();
        if (nowInDays - cacheDateInDays > cachingTime) {
            return getContentTreePage(function (html) {
                saveContentTreePage(html);
                search(html);
            });
        } else {
            store.get(contentTreePageName, search);
        }
    });
}


function getContentTreePage(callback) {
    $.ajax({
        url: contentTreeLink,
        // context: document.body
    }).success(callback)
        .error(function () {
            topLayer.deleteTopLayer();
        });
}

function search(html) {
    var regexp = new RegExp('<a.*?href="(.*?)".*?>' + searchText, 'i');
    var result = html.match(regexp);
    if (!result || result.length !== 2){
        return sweetAlert("Ошибка", "По запросу «"+searchText+"» ничего не найдено", "error");
    }
    var url = host + html.match(regexp)[1];
    store.set('url', url);
    chrome.extension.sendMessage({openLink: true});
}

//run
store.get('searchText', getAndSearch);