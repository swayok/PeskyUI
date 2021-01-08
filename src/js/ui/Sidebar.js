import $ from 'jquery';

export default class Sidebar {

    constructor(selector, togglerSelector) {
        this.$element = $(selector);
        $(document.body).on('click', togglerSelector, () => {
            this.toggle();
            return false;
        });
        this.$element.on('click', '.close-sidebar', () => {
            this.hide();
            return false;
        });
    }

    toggle() {
        if (this.$element.hasClass('closed')) {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        this.$element.removeClass('closed').addClass('opened');
    }

    hide() {
        this.$element.addClass('closed').removeClass('opened');
    }

}