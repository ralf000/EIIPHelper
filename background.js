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
        });