function initExtension() {
    chrome.storage.local.remove('createNum');
    chrome.storage.local.remove('docDragger');
    chrome.storage.local.remove('clickedDocName');
    chrome.storage.local.remove('url');
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function setNumCopies() {
    swal({
        title: "Автокопир",
        text: "Сколько копий выделенного документа сделать?",
        type: "input",
        inputPlaceholder: "Количество копий"
    }, function (inputValue) {
        if (inputValue === false || !isNumeric(inputValue))
            return false;
        if (inputValue === "") {
            swal.showInputError("Вы должны ввести количество копий");
            return false;
        }
        chrome.storage.local.set({createNum: --inputValue});
        chrome.extension.sendMessage({docsCreator: 'on'});
    });
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
        setNumCopies();
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
    
    $('.left').on('mousedown', function (e) {
        e.preventDefault();
        opener(this, e);
    });
    
    $('.files').on('mousedown', function (e) {
        e.preventDefault();
        opener(this, e, function () {
            chrome.storage.local.set({url: 'files'});
            chrome.extension.sendMessage({openLink: true});
        })
    })
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