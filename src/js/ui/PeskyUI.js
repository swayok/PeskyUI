import $ from 'jquery';
import Sidebar from "./Sidebar";

class PeskyUI {

    static get defaultInitializers() {

    }

    static get defaults() {
        return {
            //< array of functions to call in constructor (strings - call PeskyUI methods, functions - call custom methods
            initializers: PeskyUI.defaultInitializers,
            leftSidebarSelector: '#left-sidebar',
            leftSidebarTogglerSelector: '.sidebar-left-toggle',
            rightSidebarSelector: '#right-sidebar',
            rightSidebarTogglerSelector: '.sidebar-right-toggle',
            headerSelector: '#app > header, #content-wrapper > header, #content > header',
            footerSelector: '#app > footer, #content-wrapper > footer, #content > footer',
            contentId: 'content',
            contentTransitionDuration: 400
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
        if (!this.leftSidebar) {
            this.leftSidebar = new Sidebar(
                this.options.leftSidebarSelector,
                this.options.leftSidebarTogglerSelector
            );
        }
        return this.leftSidebar;
    }

    initLeftSidebar() {
        this.getLeftSidebar();
    }

    getRightSidebar() {
        if (!this.rightSidebar) {
            this.rightSidebar = new Sidebar(
                this.options.rightSidebarSelector,
                this.options.rightSidebarTogglerSelector
            );
        }
        return this.rightSidebar;
    }

    initRightSidebar() {
        this.getRightSidebar();
    }

    initSidebarNestedMenu(menuSelector) {
        $(menuSelector).NestedMenu();
    }

    getContent() {
        return $('#' + this.options.contentId);
    }

    showPreloader($el) {
        $el.addClass('loading');
    }

    hidePreloader($el) {
        $el.removeClass('loading');
    }

    switchContent(newContentJqueryPromise) {
        const $oldContent = this.getContent();
        this.showPreloader($oldContent);

        newContentJqueryPromise
            .done((newContent) => {
                const $newContent = $('<div></div>')
                    .append(newContent)
                    .attr('id', this.options.contentId + '-new')
                    .css('height', $oldContent.height());
                $oldContent
                    .css({
                        height: $oldContent.height(),
                        top: $oldContent.offset().top
                    })
                    .attr('id', this.options.contentId + '-old')
                    .after($newContent);
                setTimeout(() => {
                    $oldContent.addClass('hide');
                    $newContent.addClass('show');
                }, 100);
                setTimeout(() => {
                    $oldContent.remove();
                    $newContent
                        .css('height', 'auto')
                        .attr('id', this.options.contentId)
                        .removeClass('show');
                }, this.options.contentTransitionDuration + 100);
            })
            .fail(() => {
                this.hidePreloader($oldContent);
            })
    }

    getHeader() {
        return $(this.options.headerSelector);
    }

    getFooter() {
        return $(this.options.footerSelector);
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