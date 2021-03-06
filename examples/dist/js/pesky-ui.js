/*!
  * PeskyUI v0.1.0 (https://github.com/swayok/PeskyUI#readme)
  * Copyright 2019-2021 Alexander Filippov
  * Licensed under MIT (https://github.com/swayok/PeskyUI/blob/master/LICENSE)
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['pesky-ui'] = {}, global.jQuery));
}(this, (function (exports, $) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    class Sidebar {
      constructor(selector, togglerSelector) {
        this.$element = $__default['default'](selector);
        $__default['default'](document.body).on('click', togglerSelector, () => {
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

    class PeskyUI {
      static get defaultInitializers() {}

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
        if (options && $__default['default'].isPlainObject(options)) {
          options = {};
        }

        this.options = $__default['default'].extend({}, PeskyUI.defaults, options);

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
          this.leftSidebar = new Sidebar(this.options.leftSidebarSelector, this.options.leftSidebarTogglerSelector);
        }

        return this.leftSidebar;
      }

      initLeftSidebar() {
        this.getLeftSidebar();
      }

      getRightSidebar() {
        if (!this.rightSidebar) {
          this.rightSidebar = new Sidebar(this.options.rightSidebarSelector, this.options.rightSidebarTogglerSelector);
        }

        return this.rightSidebar;
      }

      initRightSidebar() {
        this.getRightSidebar();
      }

      initSidebarNestedMenu(menuSelector) {
        $__default['default'](menuSelector).NestedMenu();
      }

      getContent() {
        return $__default['default']('#' + this.options.contentId);
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
        newContentJqueryPromise.done(newContent => {
          const $newContent = $__default['default']('<div></div>').append(newContent).attr('id', this.options.contentId + '-new').css('height', $oldContent.height());
          $oldContent.css({
            height: $oldContent.height(),
            top: $oldContent.offset().top
          }).attr('id', this.options.contentId + '-old').after($newContent);
          setTimeout(() => {
            $oldContent.addClass('hide');
            $newContent.addClass('show');
          }, 100);
          setTimeout(() => {
            $oldContent.remove();
            $newContent.css('height', 'auto').attr('id', this.options.contentId).removeClass('show');
          }, this.options.contentTransitionDuration + 100);
        }).fail(() => {
          this.hidePreloader($oldContent);
        });
      }

      getHeader() {
        return $__default['default'](this.options.headerSelector);
      }

      getFooter() {
        return $__default['default'](this.options.footerSelector);
      }

      uuid4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
              v = c === 'x' ? r : r & 0x3 | 0x8;
          return v.toString(16);
        });
      }

    }

    $__default['default'](function () {
      if (!window.PeskyUI) {
        window.PeskyUI = new PeskyUI(typeof PeskyUIConfig === 'undefined' ? {} : PeskyUIConfig);
      }
    });

    const NestedMenu = ($ => {
      const NAME = 'NestedMenu';
      const DATA_KEY = 'nested-menu';
      const EVENT_KEY = `.${DATA_KEY}`;
      const JQUERY_NO_CONFLICT = $.fn[NAME];
      const Event = {
        SELECTED: `selected${EVENT_KEY}`,
        EXPANDED: `expanded${EVENT_KEY}`,
        COLLAPSED: `collapsed${EVENT_KEY}`,
        LOAD_DATA_API: `load${EVENT_KEY}`
      };
      const Selector = {
        LI: '.nav-item',
        LINK: '.nav-link',
        NESTED_MENU: '.nav-submenu',
        OPEN: '.menu-open',
        DATA_WIDGET: '[data-widget="nested-menu"]'
      };
      const ClassName = {
        LI: 'nav-item',
        LINK: 'nav-link',
        NESTED_MENU: 'nav-submenu',
        OPEN: 'menu-open'
      };
      const Default = {
        animationSpeed: 200,
        accordion: true
      };
      /**
       * Class Definition
       * ====================================================
       */

      class NestedMenu {
        constructor(element, config) {
          this._config = config;
          this._element = element;
          this.init();
        } // Public


        init() {
          this._setupListeners();

          this._initSubmenus();
        }

        expand(nestedMenu, parentLi) {
          const expandedEvent = $.Event(Event.EXPANDED);

          if (this._config.accordion) {
            const openMenuLi = parentLi.siblings(Selector.OPEN).first();
            const openNestedMenu = openMenuLi.find(Selector.NESTED_MENU).first();
            this.collapse(openNestedMenu, openMenuLi);
          }

          parentLi.addClass(ClassName.OPEN);
          nestedMenu.stop().slideDown(this._config.animationSpeed, () => {
            $(this._element).trigger(expandedEvent);
          });
        }

        collapse(nestedMenu, parentLi) {
          const collapsedEvent = $.Event(Event.COLLAPSED);
          parentLi.removeClass(ClassName.OPEN);
          nestedMenu.stop().slideUp(this._config.animationSpeed, () => {
            $(this._element).trigger(collapsedEvent);
            nestedMenu.find(`${Selector.OPEN} > ${Selector.NESTED_MENU}`).slideUp();
            nestedMenu.find(Selector.OPEN).removeClass(ClassName.OPEN);
          });
        }

        toggle(event) {
          const $relativeTarget = $(event.currentTarget);
          const $parent = $relativeTarget.parent();
          let nestedMenu = $parent.find('> ' + Selector.NESTED_MENU);

          if (!nestedMenu.is(Selector.NESTED_MENU)) {
            if (!$parent.is(Selector.LI)) {
              nestedMenu = $parent.parent().find('> ' + Selector.NESTED_MENU);
            }

            if (!nestedMenu.is(Selector.NESTED_MENU)) {
              return;
            }
          }

          event.preventDefault();
          const parentLi = $relativeTarget.parents(Selector.LI).first();
          const isOpen = parentLi.hasClass(ClassName.OPEN);

          if (isOpen) {
            this.collapse($(nestedMenu), parentLi);
          } else {
            this.expand($(nestedMenu), parentLi);
          }
        } // Private


        _setupListeners() {
          $(this._element).on('click', Selector.LINK, event => {
            this.toggle(event);
          });
        }

        _initSubmenus() {
          this._element.find(Selector.NESTED_MENU).slideUp();

          this._element.find(Selector.LI + Selector.OPEN).each((i, el) => {
            let $li = $(el);
            let $nestedMenu = $li.find('> ' + Selector.NESTED_MENU);
            let $parentLi = $li.find('> ' + Selector.LINK).parents(Selector.LI).first();
            this.expand($nestedMenu, $parentLi);
          });
        } // Static


        static _jQueryInterface(config) {
          return this.each(function () {
            let data = $(this).data(DATA_KEY);

            const _options = $.extend({}, Default, $(this).data());

            if (!data) {
              data = new NestedMenu($(this), _options);
              $(this).data(DATA_KEY, data);
            }
          });
        }

      }
      /**
       * jQuery API
       * ====================================================
       */


      $.fn[NAME] = NestedMenu._jQueryInterface;
      $.fn[NAME].Constructor = NestedMenu;

      $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return NestedMenu._jQueryInterface;
      };

      return NestedMenu;
    })(jQuery);

    exports.NestedMenu = NestedMenu;
    exports.PeskyUI = PeskyUI;
    exports.Sidebar = Sidebar;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pesky-ui.js.map
