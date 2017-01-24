var topLayer = {
    getTopLayer: function (style) {
        return '<div id="toplayer" style="\
                display: none;\
                background-color: black;\
                opacity: 0.8;\
                width: 100%;\
                height: 100vh;\
                z-index: 999;\
                position: absolute;">\
                <span style="\
                    display: block;\
                    color: white;\
                    position: relative;\
                    top: 45%;\
                    left: 46%;">\
                    Ожидайте\
                    <div id="working" style="width: 100px;font-size: 12px;margin-top: 10px;">\
                        <img src="https://investmoscow.ru/media/3064469/progressbar.gif" alt="" \
                            style="top: 10px;position: relative;">\
                    </div>\
                </span>\
            </div>';
    },

    addTopLayerOnPage: function () {
        this.deleteTopLayer();

        $('body').append(this.getTopLayer());
        $('#toplayer').show();
    },

    deleteTopLayer: function () {
        if ($('#toplayer').length !== 0)
            $('#toplayer').remove();
    }
};