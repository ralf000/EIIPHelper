function initExtension() {
    chrome.storage.local.remove('createNum');
    chrome.storage.local.remove('docDragger');
    chrome.storage.local.remove('clickedDocName');
    chrome.storage.local.remove('url');
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function popupCopy(callback) {
    swal({
        title: 'Автокопир',
        text: 'Сколько копий выделенного документа сделать?',
        errorText: 'Вы должны ввести количество копий',
        type: "input"
    }, function (inputValue) {
        callback(inputValue);
    });
}

function getInputText(t) {
    return $(t).closest('body').find('input[type=text]').val();
}


function popupSearch(callback) {
    swal({
        title: 'Поиск',
        text: 'Какую страницу нужно найти для перехода?',
        errorText: 'Вы должны ввести название страницы',
        type: "input",
        buttons: [
            {
                text: 'Пром',
                className: 'btn btn-primary pull-left',
                click: function () {
                    var inputValue = getInputText(this);
                    search(inputValue);
                },
                close: true
            },
            {
                text: 'Тест',
                className: 'btn btn-default pull-right',
                click: function () {
                    chrome.storage.local.set({test: true});
                    var inputValue = getInputText(this);
                    search(inputValue);
                },
                close: true
            }
        ]
    });
}

function copy(inputValue) {
    if (inputValue === false || !isNumeric(inputValue))
        return false;
    if (inputValue === "") {
        return false;
    }
    chrome.storage.local.set({createNum: --inputValue});
    chrome.extension.sendMessage({docsCreator: 'on'});
}

function search(inputValue) {
    chrome.storage.local.set({searchText: inputValue});

    if (inputValue) {
        chrome.extension.sendMessage({search: true});
    }

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
        popupCopy(copy);
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

    $('#search').on('click', function (e) {
        e.preventDefault();
        popupSearch(search);
    });
    $('#search-update').on('click', function (e) {
        e.preventDefault();
        saveContentTreePages(this);
    });
}

function saveContentTreePages(t) {
    $(t).text('Обновляю').addClass('blink');
    sendAjax('https://investmoscow.ru/contenttree', function (html) {
        store.set('contentTreePage', html);
        store.set('cacheDateInDays', getCurrentDateInDays());
    });
    sendAjax('http://investmoscow.upt24.ru/contenttree', function (html) {
        $(t).text('Готово').removeClass('blink');
        store.set('contentTreePageTest', html);
        store.set('cacheDateInDaysTest', getCurrentDateInDays());
    });
}

function getCurrentDateInDays() {
    return Math.round(Date.now() / 1000 / 60 / 60 / 24);
}

function sendAjax(url, callback) {
    $.ajax({
        url: url
    }).success(callback)
        .error(function () {
            alert('Ошибка сохранения ContentTree');
        });
}

function opener(t, event, callback) {
    callback = callback || null;
    var url = $(t).attr('href');
    if (event.button == 0) {
        window.open(url, '_blank');
    } else {
        withoutLinkOpenerCheck(t);
        callback(url);
    }
}

function withoutLinkOpenerCheck(t) {
    if (!$(t).hasClass('without-link-opener'))
        return;
    var url = '';
    if ($(t).attr('href').indexOf('upt24') === -1)
        url = 'https://web1.investmoscow.ru/umbraco';
    else
        url = 'http://investmoscow.upt24.ru/umbraco';
    return window.open(url, '_blank');
}

$(function () {
    addHandlers();
});