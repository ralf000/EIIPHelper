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

jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function (arg) {
    return function (elem) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

/*
 * RegEx Selector для jQuery
 * @returns {Boolean}
 */
$.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

function in_array(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
    }
    return false;
}