//globals
var domain = 'https://investmoscow.ru';
var numPictures = 0;
var firstPicture = '';
var present = {};
var galleryNum = Math.round(Date.now() / 1000);
var genData = '';
var wait = 300;

function sendAjax() {
    var url = 'http://utilites.2hut.ru/presentGenerator/generator.php';
    var data = {string: present.secondStr, cnt: numPictures};
    $.post(url, data, function (data, status, jqXHR) {
        if (status === 'success') {
            genData = JSON.parse(data);
            getPdfLink();
        }
    });
}

function setTitleAndSendAjax() {
    if ((present.before + present.pdfStr + present.after).indexOf('{title}') === -1) {
        sendAjax();
        return;
    }
    swal({
        title: "Введите заголовок презентации",
        text: "",
        type: "input",
        inputPlaceholder: "заголовок"
    }, function (inputValue) {
        if (inputValue === false)
            return false;
        if (inputValue === "") {
            swal.showInputError("Вы должны ввести заголовок презентации");
            return false;
        }
        present.before = present.before.replace(/\{title\}/, inputValue);
        present.pdfStr = present.pdfStr.replace(/\{title\}/, inputValue);
        present.after = present.after.replace(/\{title\}/, inputValue);
        sendAjax();
    });
}

function show(data) {
    swal({
        title: "",
        text: data,
        html: false,
        customClass: 'presentGen',
        allowOutsideClick: true,
    });
}

function placeholdersReplace(data) {
    data = data.replace(/\{galleryNum\}/g, galleryNum).replace(/\{pdf\}/g, present.pdfUrl);
    return data;
}

function waitLastPage() {
    setTimeout(function () {
        $('.umb-table-body')
            .first()
            .find('.umb-table-row.ng-scope i.icon-files')
            .last()
            .parent('.umb-table-cell')
            .next('.umb-table-cell.umb-table__name')
            .children('a')[0]
            .click();
        waitPdf();
    }, wait * 10);
}

function waitFilesList(callback) {
    var timeout = setTimeout(function () {
        if ($('.umb-table-body').first().find('.umb-table-row.ng-scope i.icon-picture').length !== 0) {
            clearTimeout(timeout);
            callback();
        } else {
            waitFilesList(callback);
        }
    }, wait)
}

function getPdfLink() {
    var output = '';
    if (!present.pdfStr || $('.umb-table-body').first().find('.umb-table-row.ng-scope i.icon-files').length === 0) {
        output = present.before + present.firstStr + genData + present.pdfStr + present.after;
        output = placeholdersReplace(output);
        setTimeout(function () {
            show(output);
        }, wait * 2);
    } else {
        // $('ul.umb-breadcrumbs li a:last')[0].click();
        // throw 1;
        // $('localize[key="buttons_returnToList"]').parent('button').click();
        waitFilesList(function () {
            $('.pagination').first().find('li[ng-repeat="pgn in pagination"]').last().find('a')[0].click();
            waitLastPage();
        });
    }
}

function getStringByPresentsType(presentType) {
    present.before = presentsData[presentType].before;
    present.firstStr = presentsData[presentType].first.replace(/{\link\}/g, firstPicture);
    present.secondStr = presentsData[presentType].other.replace(/{\link\}/g, firstPicture);
    present.pdfStr = presentsData[presentType].pdf;
    present.after = presentsData[presentType].after.replace(/{\link\}/g, firstPicture);
    setTitleAndSendAjax();
}

function handSlides() {
    store.get('presentType', getStringByPresentsType);
}

function waitPdf() {
    var timeout = setTimeout(function () {
        if ($('ul.thumbnails a').length !== 0) {
            clearTimeout(timeout);
            present.pdfUrl = domain + $('ul.thumbnails a').attr('href');
            var output = present.before + present.firstStr + genData + present.pdfStr + present.after;
            output = placeholdersReplace(output);
            show(output);
        } else {
            waitPdf();
        }
    }, wait)
}

function waitPicture() {
    var timeout = setTimeout(function () {
        if ($('ul.thumbnails a').length !== 0) {
            clearTimeout(timeout);
            setTimeout(function () {
                firstPicture = domain + $('ul.thumbnails a').attr('href');
                $('ul.umb-breadcrumbs li a:last')[0].click();
                if ($('localize[key="prompt_discardChanges"]').length !== 0)
                    $('localize[key="prompt_discardChanges"]').parent('button').click();
                waitFilesList(getLastPage);
            }, wait * 2);
        } else {
            waitPicture();
        }
    }, wait)
}

function waitPictures() {
    setTimeout(function () {
        var lastPicture =
            $('.umb-table-body')
                .first()
                .find('.umb-table-row.ng-scope i.icon-picture')
                .last()
                .parent('.umb-table-cell');
        numPictures = lastPicture.next().next().children('span').text();
        numPictures = Number(numPictures) + 1;
        handSlides();
    }, wait * 5)
}

function getLastPage() {
    $('.pagination').first().find('li[ng-repeat="pgn in pagination"]').last().find('a')[0].click();
    waitPictures();
}

function getFirstPicture() {
    $('.umb-table-body')
        .first()
        .find('.umb-table-row.ng-scope i.icon-picture')
        .first()
        .parent('.umb-table-cell')
        .next('.umb-table-cell.umb-table__name')
        .children('a')[0]
        .click();
    waitPicture();
}

function getPresentation() {
    getFirstPicture();
}

getPresentation();
