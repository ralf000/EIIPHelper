function initExtension() {
    chrome.storage.local.remove('createNum');
    chrome.storage.local.remove('docDragger');
    chrome.storage.local.remove('clickedDocName');
    chrome.storage.local.remove('url');
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function popup(title, text, errorText, callback) {
    swal({
        title: title,
        text: text,
        type: "input"
    }, function (inputValue) {
        callback(inputValue);
    });
}

function copyPopup(inputValue) {
    if (inputValue === false || !isNumeric(inputValue))
        return false;
    if (inputValue === "") {
        return false;
    }
    chrome.storage.local.set({createNum: --inputValue});
    chrome.extension.sendMessage({docsCreator: 'on'});
}

function searchPopup(inputValue) {
    if (inputValue == false)
        return false;
    chrome.storage.local.set({searchText: inputValue});
    chrome.extension.sendMessage({search: true});
}

function addHandlers() {
    $('#openLink').on('click', function (e) {
        e.preventDefault();
        initExtension();
        chrome.tabs.getSelected(null, function (tab) {
            if (tab.url.indexOf('investmoscow') === -1)
                return false;
            chrome.storage.local.set({url: tab.url});
            chrome.extension.sendMessage({openLink: true});
        });
    });

    $('#runDocsCopied').on('click', function (e) {
        e.preventDefault();
        initExtension();
        popup('Автокопир', 'Сколько копий выделенного документа сделать?', 'Вы должны ввести количество копий', copyPopup);
    });

    $('#runInterviewCreator').on('click', function (e) {
        e.preventDefault();
        initExtension();
        chrome.storage.local.set({createNum: 0});
        chrome.storage.local.set({docDragger: 'on'});
        chrome.extension.sendMessage({docsCreator: 'on'});
    });

    $('#runInterviewCreatorUp').on('click', function (e) {
        e.preventDefault();
        chrome.storage.local.set({dragUp: 'on'});
        $('#runInterviewCreator').click();
    });

    $('#createPresentation').on('click', function (e) {
        e.preventDefault();
        initExtension();
        $(this).next('.subBlock').slideToggle();
    });


    $('.present').on('click', function (e) {
        e.preventDefault();
        chrome.storage.local.set({presentType: $(this).attr('id')});
        chrome.extension.sendMessage({presentGenerator: 'on'});
    });


    $('.link').on('mousedown', function (e) {
        e.preventDefault();
        opener(this, e, function (url) {
            chrome.storage.local.set({url: url});
            chrome.extension.sendMessage({openLink: true});
        });
    });

    $('.left').on('click', function (e) {
        e.preventDefault();
        opener(this, e);
    });

    $('.files').on('mousedown', function (e) {
        e.preventDefault();
        opener(this, e, function () {
            chrome.storage.local.set({url: 'files'});
            chrome.extension.sendMessage({openLink: true});
        })
    });

    $('.search').on('click', function (e) {
        e.preventDefault();
        popup('Поиск', 'Какую страницу нужно найти для перехода?', 'Вы должны ввести название страницы', searchPopup);
    });
}

function opener(t, event, callback) {
    callback = callback || null;
    var url = $(t).attr('href');
    if (event.button == 0) {
        window.open(url, '_blank');
    } else {
        callback(url);
    }
}

$(function () {
    addHandlers();
});