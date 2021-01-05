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

    class PeskyUI {
      static get defaultInitializers() {
        return ['initLeftSidebar', 'initRightSidebar'];
      }

      static get defaults() {
        return {
          //< array of functions to call in constructor (strings - call PeskyUI methods, functions - call custom methods
          initializers: PeskyUI.defaultInitializers,
          leftSidebarSelector: '#left-sidebar',
          rightSidebarSelector: '#right-sidebar'
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

      initLeftSidebar() {
        this.$leftSidebar = $__default['default'](this.options.leftSidebarSelector);
      }

      initLeftSidebarMenu(menuId) {
        $__default['default'](menuId).Treeview();
      }

      initRightSidebar() {
        this.$rightSidebar = $__default['default'](this.options.rightSidebarSelector);
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
      window.PeskyUI = new PeskyUI(typeof PeskyUIConfig === 'undefined' ? {} : PeskyUIConfig);
    });

    const Treeview = ($ => {
      const NAME = 'Treeview';
      const DATA_KEY = 'treeview';
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
        TREEVIEW_MENU: '.nav-submenu',
        OPEN: '.menu-open',
        DATA_WIDGET: '[data-widget="treeview"]'
      };
      const ClassName = {
        LI: 'nav-item',
        LINK: 'nav-link',
        TREEVIEW_MENU: 'nav-submenu',
        OPEN: 'menu-open'
      };
      const Default = {
        trigger: `${Selector.DATA_WIDGET} ${Selector.LINK}`,
        animationSpeed: 300,
        accordion: true
      };
      /**
       * Class Definition
       * ====================================================
       */

      class Treeview {
        constructor(element, config) {
          this._config = config;
          this._element = element;
        } // Public


        init() {
          console.log('treeview init');

          this._setupListeners();
        }

        expand(treeviewMenu, parentLi) {
          const expandedEvent = $.Event(Event.EXPANDED);

          if (this._config.accordion) {
            const openMenuLi = parentLi.siblings(Selector.OPEN).first();
            const openTreeview = openMenuLi.find(Selector.TREEVIEW_MENU).first();
            this.collapse(openTreeview, openMenuLi);
          }

          treeviewMenu.stop().slideDown(this._config.animationSpeed, () => {
            parentLi.addClass(ClassName.OPEN);
            $(this._element).trigger(expandedEvent);
          });
        }

        collapse(treeviewMenu, parentLi) {
          const collapsedEvent = $.Event(Event.COLLAPSED);
          treeviewMenu.stop().slideUp(this._config.animationSpeed, () => {
            parentLi.removeClass(ClassName.OPEN);
            $(this._element).trigger(collapsedEvent);
            treeviewMenu.find(`${Selector.OPEN} > ${Selector.TREEVIEW_MENU}`).slideUp();
            treeviewMenu.find(Selector.OPEN).removeClass(ClassName.OPEN);
          });
        }

        toggle(event) {
          const $relativeTarget = $(event.currentTarget);
          const $parent = $relativeTarget.parent();
          let treeviewMenu = $parent.find('> ' + Selector.TREEVIEW_MENU);

          if (!treeviewMenu.is(Selector.TREEVIEW_MENU)) {
            if (!$parent.is(Selector.LI)) {
              treeviewMenu = $parent.parent().find('> ' + Selector.TREEVIEW_MENU);
            }

            if (!treeviewMenu.is(Selector.TREEVIEW_MENU)) {
              return;
            }
          }

          event.preventDefault();
          const parentLi = $relativeTarget.parents(Selector.LI).first();
          const isOpen = parentLi.hasClass(ClassName.OPEN);

          if (isOpen) {
            this.collapse($(treeviewMenu), parentLi);
          } else {
            this.expand($(treeviewMenu), parentLi);
          }
        } // Private


        _setupListeners() {
          $(document).on('click', this._config.trigger, event => {
            this.toggle(event);
          });
        } // Static


        static _jQueryInterface(config) {
          return this.each(function () {
            let data = $(this).data(DATA_KEY);

            const _options = $.extend({}, Default, $(this).data());

            if (!data) {
              data = new Treeview($(this), _options);
              $(this).data(DATA_KEY, data);
            }

            if (config === 'init') {
              data[config]();
            }
          });
        }

      }
      /**
       * Data API
       * ====================================================
       */


      $(window).on(Event.LOAD_DATA_API, () => {
        $(Selector.DATA_WIDGET).each(function () {
          Treeview._jQueryInterface.call($(this), 'init');
        });
      });
      /**
       * jQuery API
       * ====================================================
       */

      $.fn[NAME] = Treeview._jQueryInterface;
      $.fn[NAME].Constructor = Treeview;

      $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Treeview._jQueryInterface;
      };

      return Treeview;
    })(jQuery);

    exports.PeskyUI = PeskyUI;
    exports.Treeview = Treeview;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pesky-ui.bundle.js.map
