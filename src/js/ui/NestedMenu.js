const NestedMenu = (($) => {

    const NAME = 'NestedMenu'
    const DATA_KEY = 'nested-menu'
    const EVENT_KEY = `.${DATA_KEY}`
    const JQUERY_NO_CONFLICT = $.fn[NAME]

    const Event = {
        SELECTED: `selected${EVENT_KEY}`,
        EXPANDED: `expanded${EVENT_KEY}`,
        COLLAPSED: `collapsed${EVENT_KEY}`,
        LOAD_DATA_API: `load${EVENT_KEY}`
    }

    const Selector = {
        LI: '.nav-item',
        LINK: '.nav-link',
        NESTED_MENU: '.nav-submenu',
        OPEN: '.menu-open',
        DATA_WIDGET: '[data-widget="nested-menu"]'
    }

    const ClassName = {
        LI: 'nav-item',
        LINK: 'nav-link',
        NESTED_MENU: 'nav-submenu',
        OPEN: 'menu-open',
    }

    const Default = {
        animationSpeed: 200,
        accordion: true,
    }

    /**
     * Class Definition
     * ====================================================
     */
    class NestedMenu {
        constructor(element, config) {
            this._config = config
            this._element = element
            this.init()
        }

        // Public

        init() {
            this._setupListeners()
            this._initSubmenus()
        }

        expand(nestedMenu, parentLi) {
            const expandedEvent = $.Event(Event.EXPANDED)

            if (this._config.accordion) {
                const openMenuLi = parentLi.siblings(Selector.OPEN).first()
                const openNestedMenu = openMenuLi.find(Selector.NESTED_MENU).first()
                this.collapse(openNestedMenu, openMenuLi)
            }

            parentLi.addClass(ClassName.OPEN)
            nestedMenu.stop().slideDown(this._config.animationSpeed, () => {
                $(this._element).trigger(expandedEvent)
            })

        }

        collapse(nestedMenu, parentLi) {
            const collapsedEvent = $.Event(Event.COLLAPSED)

            parentLi.removeClass(ClassName.OPEN)
            nestedMenu.stop().slideUp(this._config.animationSpeed, () => {
                $(this._element).trigger(collapsedEvent)
                nestedMenu.find(`${Selector.OPEN} > ${Selector.NESTED_MENU}`).slideUp()
                nestedMenu.find(Selector.OPEN).removeClass(ClassName.OPEN)
            })
        }

        toggle(event) {

            const $relativeTarget = $(event.currentTarget)
            const $parent = $relativeTarget.parent()

            let nestedMenu = $parent.find('> ' + Selector.NESTED_MENU)

            if (!nestedMenu.is(Selector.NESTED_MENU)) {

                if (!$parent.is(Selector.LI)) {
                    nestedMenu = $parent.parent().find('> ' + Selector.NESTED_MENU)
                }

                if (!nestedMenu.is(Selector.NESTED_MENU)) {
                    return
                }
            }

            event.preventDefault()

            const parentLi = $relativeTarget.parents(Selector.LI).first()
            const isOpen = parentLi.hasClass(ClassName.OPEN)

            if (isOpen) {
                this.collapse($(nestedMenu), parentLi)
            } else {
                this.expand($(nestedMenu), parentLi)
            }
        }

        // Private

        _setupListeners() {
            $(this._element).on('click', Selector.LINK, (event) => {
                this.toggle(event)
            })
        }

        _initSubmenus() {
            this._element.find(Selector.NESTED_MENU).slideUp();
            this._element.find(Selector.LI + Selector.OPEN).each((i, el) => {
                let $li = $(el);
                let $nestedMenu = $li.find('> ' + Selector.NESTED_MENU);
                let $parentLi = $li.find('> ' + Selector.LINK).parents(Selector.LI).first();
                this.expand($nestedMenu, $parentLi);
            });
        }

        // Static

        static _jQueryInterface(config) {
            return this.each(function () {
                let data = $(this).data(DATA_KEY)
                const _options = $.extend({}, Default, $(this).data())

                if (!data) {
                    data = new NestedMenu($(this), _options)
                    $(this).data(DATA_KEY, data)
                }

            })
        }
    }

    /**
     * jQuery API
     * ====================================================
     */

    $.fn[NAME] = NestedMenu._jQueryInterface
    $.fn[NAME].Constructor = NestedMenu
    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT
        return NestedMenu._jQueryInterface
    }

    return NestedMenu
})(jQuery)

export default NestedMenu
