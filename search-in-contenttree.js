function getSearchText(callback) {
    chrome.storage.local.get('searchText', function (result) {
        var searchText = result.searchText;
        if (searchText) {
            callback(searchText);
        }
    });
}

function search(searchText) {
    $.ajax({
        url: "https://investmoscow.ru/contenttree",
        context: document.body
    }).success(function(html) {
        var regexp = new RegExp('<a.*?href="(.*?)".*?>' + searchText);
        var url = 'https://investmoscow.ru' + html.match(regexp)[1];
        chrome.storage.local.set({url: url});
        chrome.extension.sendMessage({openLink: true});
    });
}

getSearchText(search);