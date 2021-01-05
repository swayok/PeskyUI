import $ from 'jquery';

class PeskyUI {

    static get defaultInitializers() {
        return [
            'initLeftSidebar',
            'initRightSidebar',
        ];
    }

    static get defaults() {
        return {
            //< array of functions to call in constructor (strings - call PeskyUI methods, functions - call custom methods
            initializers: PeskyUI.defaultInitializers,
            leftSidebarSelector: '#left-sidebar',
            rightSidebarSelector: '#right-sidebar',
        };
    }

    constructor(options) {
        if (options && $.isPlainObject(options)) {
            options = {};
        }
        this.options = $.extend({}, PeskyUI.defaults, options);

        for (let key in this.options.initializers) {
            let initializer = this.options.initializers[key];
            if (typeof initializer === 'function') {
                initializer.call(this);
            } else {
                this[initializer]();
            }
        }
    }

    initLeftSidebar() {
        this.$leftSidebar = $(this.options.leftSidebarSelector);
    }

    initLeftSidebarMenu(menuId) {
        $(menuId).Treeview();
    }

    initRightSidebar() {
        this.$rightSidebar = $(this.options.rightSidebarSelector);
    }

    uuid4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = (c === 'x' ? r : (r & 0x3 | 0x8));
            return v.toString(16);
        });
    }

}

$(function () {
    window.PeskyUI = new PeskyUI(typeof PeskyUIConfig === 'undefined' ? {} : PeskyUIConfig);
});

export default PeskyUI;