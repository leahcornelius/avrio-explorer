CONFIG = (function() {
    var conf_info = {};
    conf_info["node_ip"] = 'http://127.0.0.1:1234';
    return {
        getValue: function(param) {
            return conf_info[param];
        }
    }
})();