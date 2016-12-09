function contextMenuClick(element) {

    if (!element)
        return false;

    var evt = element.ownerDocument.createEvent('MouseEvents');

    var RIGHT_CLICK_BUTTON_CODE = 2; // the same for FF and IE

    evt.initMouseEvent('contextmenu', true, true,
            element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
            false, false, false, RIGHT_CLICK_BUTTON_CODE, null);

    if (document.createEventObject) {
        // dispatch for IE
        return element.fireEvent('onclick', evt);
    }
    else {
        // dispatch for firefox + others
        return !element.dispatchEvent(evt);
    }
}

function getErrorMessage(title, message) {
    sweetAlert(title, message, "error");
}

/**
 * проверяет правильность выбора элемента для работы расширения
 * @returns {bool}
 */
function checkClickedElement() {
//    presentation = presentation || false;
//    if (presentation && $('li.loaded a.clicked').parent('li').index() !== 0)
//        return false;
    return ($('li.loaded a.clicked') && !$('li.loaded a.clicked').parent('li').hasClass('closed') && !$('li.loaded a.clicked').parent('li').hasClass('open')) ? true : false;  
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

/**
 * Split a string by string
 * @param delimiter
 * @param string
 * @returns {*}
 */
function explode( delimiter, string ) {

    var emptyArray = { 0: '' };

    if ( arguments.length != 2
        || typeof arguments[0] == 'undefined'
        || typeof arguments[1] == 'undefined' )
    {
        return null;
    }

    if ( delimiter === ''
        || delimiter === false
        || delimiter === null )
    {
        return false;
    }

    if ( typeof delimiter == 'function'
        || typeof delimiter == 'object'
        || typeof string == 'function'
        || typeof string == 'object' )
    {
        return emptyArray;
    }

    if ( delimiter === true ) {
        delimiter = '1';
    }

    return string.toString().split ( delimiter.toString() );
}
