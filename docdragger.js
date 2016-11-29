chrome.storage.local.get('clickedDocName', function (result) {
    var clickedDocName = result.clickedDocName;
    if (clickedDocName) {
//        var needPosition = inListPosition + 1;//место для нового элемента
        contextMenuClick($('li.loaded a.clicked').parent('li').children('ul')[0]);
        $('.menuLabel:contains(Сортировать)').click();
        var intval = setInterval(function () {
            if ($('.umbModalBox iframe').contents().find('table#sortableNodes tr:last').length !== 0) {
                clearInterval(intval);
                chrome.storage.local.get('dragUp', function (result) {
                    var dragUp = result.dragUp;
                    if (dragUp && dragUp === 'on') {
                        var needPosition = 0;
                        chrome.storage.local.remove('dragUp');
                    } else {
                        var needPosition = $('.umbModalBox iframe')
                                .contents()
                                .find('table#sortableNodes tr td:contains("' + clickedDocName + '")')
                                .parent('tr')
                                .index();
                    }
                    $('.umbModalBox iframe').contents().find('table#sortableNodes tr:last');
                    $('.umbModalBox iframe')
                            .contents()
                            .find('table#sortableNodes tr:last')
                            .insertBefore($('.umbModalBox iframe').contents().find('table#sortableNodes tr').eq(needPosition + 1));
                    $('.umbModalBox iframe').contents().find('input#submitButton')[0].click();
                    var intval2 = setInterval(function () {
                        if ($('.umbModalBox iframe').contents().find('a:contains(Закрыть это окно)').length > 0) {
                            clearInterval(intval2);
                            $('.umbModalBox iframe').contents().find('a:contains(Закрыть это окно)')[0].click();
                            contextMenuClick($('li.loaded a.clicked').closest('ul').prev('a')[0]);
                            $('.menuLabel:contains("Обновить узлы")').click();
                        }
                    }, 1000);
                    chrome.storage.local.remove('clickedDocName');
                });
            }
        }, 1000);
    }
});