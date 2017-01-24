var store = {
    /**
     *
     * @param name string
     * @param onTrue closure
     * @param onFalse closure
     */
    get: function (name, onTrue, onFalse) {
        onTrue = onTrue || null;
        onFalse = onFalse || null;
        name = String(name);
        chrome.storage.local.get(name, function (result) {
            var value = result[name];
            if (value) {
                return onTrue(value)
            } else {
                return onFalse()
            }
        });
    },

    /**
     *
     * @param name string
     * @param value string
     */
    set: function (name, value) {
        var obj = {};
        obj[name] = value;
        chrome.storage.local.set(obj);
    },
    //
    // check: function (name) {
    //     return this.get(name);
    // },
    
    delete: function (name) {
        chrome.storage.local.remove(String(name));
    },
    
    deleteAll: function () {
        chrome.storage.local.clear();
    }

};