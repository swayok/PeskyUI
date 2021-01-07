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

    getLeftSidebar() {
        return $(this.options.leftSidebarSelector);
    }

    initLeftSidebar() {
        $(document.body).on('click', '.sidebar-left-toggle', () => {
            this.toggleLeftSidebar();
        });
    }

    toggleLeftSidebar() {
        console.log('Toggle left sidebar', this.getLeftSidebar());
        this.getLeftSidebar().toggleClass('closed');
    }

    showLeftSidebar() {
        this.getLeftSidebar().removeClass('closed');
    }

    hideLeftSidebar() {
        this.getLeftSidebar().addClass('closed');
    }

    initLeftSidebarMenu(menuId) {
        $(menuId).NestedMenu();
    }

    getRightSidebar() {
        return $(this.options.rightSidebarSelector);
    }

    initRightSidebar() {
        $(document.body).on('click', '.sidebar-right-toggle', () => {
            this.toggleRightSidebar();
        });
    }

    toggleRightSidebar() {
        this.getRightSidebar().toggleClass('closed');
    }

    showRightSidebar() {
        this.getRightSidebar().removeClass('closed');
    }

    hideRightSidebar() {
        this.getRightSidebar().addClass('closed');
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
    if (!window.PeskyUI) {
        window.PeskyUI = new PeskyUI(typeof PeskyUIConfig === 'undefined' ? {} : PeskyUIConfig);
    }
});

export default PeskyUI;