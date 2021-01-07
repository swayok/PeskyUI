import $ from 'jquery';

class PeskyUI {

    static get defaultInitializers() {

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
            return false;
        });
        this.getLeftSidebar().on('click', '.close-sidebar', () => {
            this.hideLeftSidebar();
            return false;
        });
    }

    toggleLeftSidebar() {
        this.getLeftSidebar().toggleClass('closed').toggleClass('opened');
    }

    showLeftSidebar() {
        this.getLeftSidebar().removeClass('closed').addClass('opened');
    }

    hideLeftSidebar() {
        this.getLeftSidebar().addClass('closed').removeClass('opened');
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
            return false;
        });
        this.getRightSidebar().on('click', '.close-sidebar', () => {
            this.hideRightSidebar();
            return false;
        });
    }

    toggleRightSidebar() {
        this.getRightSidebar().toggleClass('closed opened');
    }

    showRightSidebar() {
        this.getRightSidebar().removeClass('closed').addClass('opened');
    }

    hideRightSidebar() {
        this.getRightSidebar().addClass('closed').removeClass('opened');
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