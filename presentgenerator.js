//globals
var domain = 'https://investmoscow.ru';
var numPictures = 0;
var firstPicture = '';
var present = {};
var galleryNum = Math.round(Date.now() / 1000);
var wait = 300;

function sendAjax() {
    var url = 'http://utilites.2hut.ru/presentGenerator/generator.php';
    var data = {string: present.secondStr, cnt: numPictures};
    $.post(url, data, function (data, status, jqXHR) {
        if (status === 'success') {
            getPdfLink(JSON.parse(data));
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
        customClass: 'present',
        allowOutsideClick: true
    });
}

function placeholdersReplace(data, pdf) {
    pdf = pdf || '';
    data = data.replace(/\{galleryNum\}/g, galleryNum).replace(/\{pdf\}/g, pdf);
    return data;
}

function getPdfLink(data) {
    var output = pdf = '#';
    var flag = false;
    if ($('.umb-table-body').first().find('.umb-table-row.ng-scope i.icon-files').length === 0) {
        output = present.before + present.first + data + present.pdfStr + present.after;
        output = placeholdersReplace(output, galleryNum);
        setTimeout(function () {
            show(output);
        }, wait);
    } else {
        $('.umb-table-body')
            .first()
            .find('.umb-table-row.ng-scope i.icon-files')
            .last()
            .parent('.umb-table-cell')
            .next('.umb-table-cell.umb-table__name')
            .children('a')
            .click();
        waitPdf();
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


/*function getStringByPresentsType(presentType) {
 chrome.storage.local.get('presentType', function (result) {
 var presentType = result.presentType;
 if (presentType) {
 var before = presentsData[presentType].before;
 var firstStr = presentsData[presentType].first.replace(/{\link\}/g, firstPicture);
 var secondStr = presentsData[presentType].other.replace(/{\link\}/g, firstPicture);
 var pdfStr = presentsData[presentType].pdf;
 var after = presentsData[presentType].after.replace(/{\link\}/g, firstPicture);
 setTitleAndSendAjax(before, {string: secondStr, cnt: numPictures}, firstStr, pdfStr, after);
 }
 });
 }*/

function handSlides() {
    store.get('presentType', getStringByPresentsType);
}

function waitPdf() {
    var timeout = setTimeout(function () {
        if ($('ul.thumbnails a').length !== 0) {
            clearTimeout(timeout);
            var pdf = domain + $('ul.thumbnails a').attr('href');
            var ext = pdf.substr(pdf.indexOf('.') + 1);
            if (ext === 'pdf') {
                var output = present.before + present.first + data + present.pdfStr + present.after;
                output = placeholdersReplace(output, pdf);
                show(output);
            }
        } else {
            waitPdf();
        }
    }, wait)
}

function waitPicture() {
    var timeout = setTimeout(function () {
        if ($('ul.thumbnails a').length !== 0) {
            clearTimeout(timeout);
            firstPicture = domain + $('ul.thumbnails a').attr('href');
            handSlides();
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
        lastPicture.next('.umb-table-cell.umb-table__name').children('a')[0].click();
        waitPicture();
    }, wait * 10)
}

function getLastPage() {
    $('.pagination').first().find('li[ng-repeat="pgn in pagination"]').last().find('a')[0].click();
    waitPictures();
}

function getPresentation() {
    getLastPage();
}

getPresentation();
