var presentsData = {
    "default": {
        before: '',
        first: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox" data-toggle="&quot;collapse&quot;"><img style="margin: 0 7px 0 7px; width: 100%;" src="{link}" alt="" align="right" rel="1754,1240" /></a>\n',
        other: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox dnone" data-toggle="&quot;collapse&quot;"></a>',
        pdf: '<p> </p>\n<p><a href="{pdf}" target="blank" data-toggle="&quot;collapse&quot;"><img class="article-inline-image" src="http://www.en.investmoscow.ru/media/icons/pdf-icon.png" alt="" /> Скачать</a></p>',
        after: ''
    },
    "cityLife": {
        before: '<div class="tenders-list">\n<div class="tenders-line project-desc">\n<h4 class="address">{title}</h4><p>\n',
        first: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox" data-toggle="&quot;collapse&quot;"><img style="margin: 0 7px 0 7px; width: 100%;" src="{link}" alt="" align="right" rel="1754,1240" /></a>\n',
        other: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox dnone" data-toggle="&quot;collapse&quot;"></a>',
        pdf: '</p><p> </p>\n<p><a href="{pdf}" target="blank" data-toggle="&quot;collapse&quot;"><img class="article-inline-image" src="http://www.en.investmoscow.ru/media/icons/pdf-icon.png" alt="" /> Скачать</a></p>\n',
        after: '</div>\n</div>'
    },
    "analyticsInside": {
        before: '<p>',
        first: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox" data-toggle="&quot;collapse&quot;"><img style="width: 170px; margin-bottom: 0px; margin-right: -10px; height: 200px; margin-top: -63px;" src="{link}" alt="" align="right" rel="1240,1754" /></a>\n',
        other: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox dnone" data-toggle="&quot;collapse&quot;"></a>',
        pdf: '',
        after: '</p>'
    },
    "analyticsOutside": {
        before: '<div class="tenders-list">\n<div class="row">\n<div class="col-sm-12">\n<div class="tenders-line project-desc">\n<h4 class="address">\n<a href="" target="_blank" class="address" data-toggle="&quot;collapse&quot;">{title}</a>\n</h4>\n<p> </p>\n<p>',
        first: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox" data-toggle="&quot;collapse&quot;"><img style="width: 170px; margin-bottom: 0px; margin-right: -10px; height: 200px; margin-top: -63px;" src="{link}" alt="" align="right" rel="1240,1754" /> </a>\n',
        other: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox dnone" data-toggle="&quot;collapse&quot;"></a>',
        pdf: '<p><strong>Описание: </strong></p>\n<p><strong>Период: </strong></p>\n<p><strong>Источник: </strong></p>\n<p> </p>\n<p><a href="{pdf}" data-toggle="&quot;collapse&quot;"><img class="article-inline-image" src="/media/icons/pdf-icon.png" alt="" />',
        after: '{title}</a></p>\n</div>\n</div>\n</div>\n</div>'
    },
    "agencyGallery": {
        before: '<div class="col-md-4 border-right border-bottom widget-container">\n<div class="account-widget row">\n<span>\n',
        first: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox" data-toggle="&quot;collapse&quot;"> <img style="height: 240px;" src="{link}" alt="" rel="960,640" /> </a>\n',
        other: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox dnone" data-toggle="&quot;collapse&quot;"></a>',
        pdf: '',
        after: '</span><div class="text"><a href="{link}" data-toggle="&quot;collapse&quot;"><strong>{title}</strong></a>\n</div>\n</div>\n</div>'
    },
    "agencyDigest": {
        before: '<div class="col-md-4 border-right border-bottom widget-container">\n<div class="account-widget row">\n<p>\n',
        first: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox" data-toggle="&quot;collapse&quot;"> <img src="{link}" style="margin: 0 7px 0 7px; width: 100%;" align="right"> </a>\n',
        other: '<a rel="gallery{galleryNum}" href="{link}" class="fancybox dnone" data-toggle="&quot;collapse&quot;"></a>',
        pdf: '</p>\n<div class="text">\n<a href="{pdf}" target="blank" data-toggle="&quot;collapse&quot;"><img src="http://www.en.investmoscow.ru/media/icons/pdf-icon.png" class="article-inline-image"> &nbsp;<strong>{title}</strong></a>\n</div>\n',
        after: '</div>\n</div>'
    }
};
