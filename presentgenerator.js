
function inArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value)
            return true;
    }
    return false;
}

function sendAjax(data, before, firstStr, pdfStr, after) {
    var url = 'http://utilites.2hut.ru/presentGenerator/generator.php';
    $.post(url, data, function (data, status, jqXHR) {
        if (status === 'success') {
            getPdfLink(before, firstStr, JSON.parse(data), pdfStr, after);
        }
    });
}

function setTitleAndSendAjax(before, data, firstStr, pdfStr, after) {
    if ((before + pdfStr + after).indexOf('{title}') === -1) {
        sendAjax(data, before, firstStr, pdfStr, after);
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
            swal.showInputError("Вы должны ввести количество копий");
            return false;
        }
        sendAjax(data, before.replace(/\{title\}/, inputValue), firstStr, pdfStr.replace(/\{title\}/, inputValue), after.replace(/\{title\}/, inputValue));
    });
}

function show(data) {
    swal({
        title: "",
        text: data,
        html: false,
        customClass: 'present'
    });
}

function placeholdersReplace(data, galleryNum, pdf) {
    pdf = pdf || '';
    data = data.replace(/\{galleryNum\}/g, galleryNum).replace(/\{pdf\}/g, pdf);
    return data;
}

function getPdfLink(before, first, data, pdfStr, after) {
    var output = pdf = '#';
    var flag = false;
    chrome.storage.local.get('galleryNum', function (result) {
        var galleryNum = result.galleryNum;
        if (galleryNum) {
            galleryNum++;
        } else {
            galleryNum = 20;
        }
        chrome.storage.local.set({galleryNum: galleryNum});
        $.each($('li.loaded a.clicked').closest('ul').children('li.loaded'), function () {
            if ($(this).find('a').attr('style').indexOf('mediaFile') !== -1) {
                flag = true;
                $(this).find('a')[0].click();
                var intVal = setInterval(function () {
                    if ($('iframe#right').contents().find('.header a span nobr:contains("Свойства")').length > 0) {
                        clearInterval(intVal);
                        var right = $('iframe#right').contents();
                        right.find('.header a span nobr:contains("Свойства")')[0].click();
                        var pdf = right.find('.propertyItemContent table tr:first td:last a').text();
                        var ext = pdf.substr(pdf.indexOf('.') + 1);
                        if (ext === 'pdf') {
                            output = before + first + data + pdfStr + after;
                            output = placeholdersReplace(output, galleryNum, pdf);
                            show(output);
                        }
                    }
                }, 500);
            }
        });

        if (!flag) {
            output = before + first + data + pdfStr + after;
            output = placeholdersReplace(output, galleryNum);
            setTimeout(function () {
                show(output);
            }, 300);
        }
    });
}

function getStringByPresentsType(image, num) {
    chrome.storage.local.get('presentType', function (result) {
        var presentType = result.presentType;
        if (presentType) {
            var before = presentsData[presentType].before;
            var firstStr = presentsData[presentType].first.replace(/{\link\}/g, image);
            var secondStr = presentsData[presentType].other.replace(/{\link\}/g, image);
            var pdfStr = presentsData[presentType].pdf;
            var after = presentsData[presentType].after.replace(/{\link\}/g, image);
            setTitleAndSendAjax(before, {string: secondStr, cnt: num}, firstStr, pdfStr, after);
        }
    });
}

function handSlides(num) {
    var avaliableExtensions = ['jpg', 'png', 'gif'];
//    var current = $('li.loaded a.clicked');
    var pos = $('li.loaded a.clicked').parent('li').index();
    var count = num - pos;
    $('li.loaded a.clicked').click();
    var intVal = setInterval(function () {
        if ($('iframe#right').contents().find('.header a span nobr:contains("Свойства")').length > 0) {
            clearInterval(intVal);
            var right = $('iframe#right').contents();
            right.find('.header a span nobr:contains("Свойства")')[0].click();
            var image = right.find('.propertyItemContent table tr:first td:last a').text();
            var ext = image.substr(image.indexOf('.') + 1);
            if (inArray(ext, avaliableExtensions)) {
                getStringByPresentsType(image, count);
            }
        }
    }, 500);
}

function getNumElements() {
    var cnt = 0;
    $.each($('li.loaded a.clicked').closest('ul').children('li.loaded'), function () {
        if ($(this).find('a').attr('style').indexOf('mediaPhoto') !== -1)
            cnt++;
    });
    return cnt;
}

function getPresentation() {
    if (!checkClickedElement())
        getErrorMessage('Ошибка', 'Для создания презентации выберите первое изображение в папке');
    var numElements = getNumElements();
    handSlides(numElements);
}

getPresentation();
