//globals
var searchText = '';

function getCurrentDateInDays() {
    return Date.now() / 1000 / 60 / 60 / 24;
}

function getAndSearch(result) {
    searchText = result;
    hasSavedContentTree();
}

function saveContentTreePage(html) {
    store.set('contentTreePage', html);
    store.set('cacheDateInDays', getCurrentDateInDays());
}

function hasSavedContentTree() {
    store.get('cacheDateInDays',
        function () {
            checkCachedDate();
        },
        function () {
            getContentTreePage(function (html) {
                saveContentTreePage(html);
                search(html);
            });
        });
}

function checkCachedDate() {
    store.get('cacheDateInDays', function (cacheDateInDays) {
        var nowInDays = getCurrentDateInDays();
        if (nowInDays - cacheDateInDays > 14) {
            return getContentTreePage(function (html) {
                saveContentTreePage(html);
                search(html);
            });
        } else {
            store.get('contentTreePage', search);
        }
    });
}


function getContentTreePage(callback) {
    $.ajax({
        url: "https://investmoscow.ru/contenttree",
        context: document.body
    }).success(callback);
}

function search(html) {
    var regexp = new RegExp('<a.*?href="(.*?)".*?>' + searchText);
    var url = 'https://investmoscow.ru' + html.match(regexp)[1];
    store.set('url', url);
    chrome.extension.sendMessage({openLink: true});
}

//run
store.get('searchText', getAndSearch);