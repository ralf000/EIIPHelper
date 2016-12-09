chrome.extension.onMessage.addListener(
    function (request, sender, send_response) {
        if (request.docsCreator === "on" || request.docCreateAgain === "on") {
            chrome.tabs.executeScript(null, {file: 'doccreator.js'});
        }
        if (request.docDragger === "on") {
            chrome.tabs.executeScript(null, {file: 'docdragger.js'});
        }
        if (request.presentGenerator === "on") {
            chrome.tabs.executeScript(null, {file: 'presentgenerator.js'});
        }
        if (request.openLink) {
            getUrl(createNewTab);
        }
    });

function createNewTab(url) {
    url = (url.indexOf('itopcase') === -1)
        ? 'http://investmoscow.ru/umbraco/'
        : 'http://investmoscow.itopcase.ru/umbraco';
    chrome.tabs.create({url: url}, function (tab) {
        tab = tab.id;
        chrome.tabs.executeScript(tab, {file: 'link-opener.js'});
    });
}