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

    /**
     * --------------------------------------------
     * AdminLTE Treeview.js
     * License MIT
     * --------------------------------------------
     */
    const Treeview = ($ => {
      /**
       * Constants
       * ====================================================
       */
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
        TREEVIEW_MENU: '.nav-treeview',
        OPEN: '.menu-open',
        DATA_WIDGET: '[data-widget="treeview"]'
      };
      const ClassName = {
        LI: 'nav-item',
        LINK: 'nav-link',
        TREEVIEW_MENU: 'nav-treeview',
        OPEN: 'menu-open',
        SIDEBAR_COLLAPSED: 'sidebar-collapse'
      };
      const Default = {
        trigger: `${Selector.DATA_WIDGET} ${Selector.LINK}`,
        animationSpeed: 300,
        accordion: true,
        expandSidebar: false,
        sidebarButtonSelector: '[data-widget="pushmenu"]'
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

          if (this._config.expandSidebar) {
            this._expandSidebar();
          }
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
        }

        _expandSidebar() {
          if ($('body').hasClass(ClassName.SIDEBAR_COLLAPSED)) {
            $(this._config.sidebarButtonSelector).PushMenu('expand');
          }
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

    class PeskyUI {
      static get defaultInitializers() {
        return ['initLeftSidebar', 'initRightSidebar'];
      }

      static get defaults() {
        return {
          //< array of functions to call in constructor (strings - call PeskyUI methods, functions - call custom methods
          initializers: PeskyUI.defaultInitializers,
          leftSidebarSelector: '#left-sidebar',
          rightSidebarSelector: '#right-sidebar',
          sidebarMenuContainerSelector: '.sidebar-menu',
          sidebarScrollContainerSelector: '.scrollable'
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

        if (this.$leftSidebar.length) {
          console.log(this.$leftSidebar, this.$leftSidebar.find(this.options.sidebarMenuContainerSelector), this.$leftSidebar.find(this.options.sidebarScrollContainerSelector));
          this.$leftSidebar.find(this.options.sidebarMenuContainerSelector).Treeview();
          let $scrollable = this.$leftSidebar.find(this.options.sidebarScrollContainerSelector);

          if (!$scrollable.length) {
            $scrollable = this.$leftSidebar;
          }

          $scrollable.SimpleScrollbar();
        }
      }

      initRightSidebar() {
        this.$rightSidebar = $__default['default'](this.options.rightSidebarSelector);

        if (this.$rightSidebar.length) {
          this.$rightSidebar.find(this.options.sidebarMenuContainerSelector).Treeview();
          let $scrollable = this.$rightSidebar.find(this.options.sidebarScrollContainerSelector);

          if (!$scrollable.length) {
            $scrollable = this.$rightSidebar;
          }

          $scrollable.SimpleScrollbar();
        }
      }

    }

    $__default['default'](function () {
      const dataKey = 'pesky-ui';

      if (!$__default['default'](document).data(dataKey)) {
        const data = new PeskyUI(typeof PeskyUIConfig === 'undefined' ? {} : PeskyUIConfig);
        $__default['default'](document).data(dataKey, data);
      }
    });

    exports.PeskyUI = PeskyUI;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pesky-ui.js.map
