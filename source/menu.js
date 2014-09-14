define(['lib/jquery'], function ($) {

	var FullyResponsiveMenu = function (options) {
		
		var defaultOptions = {
			selector:                       '.desktop_menu',
            classMobileMenu:                'mobile_menu',
            classMobileMenuItem:            'mobile_menu-item',
            classMobileMenuContainer:       'mobile_menu__container',
            classMobileMenuButton:          'mobile_menu__button'
		};

		this.options = $.extend(defaultOptions, options);

		this.desktopMenu = $(this.options.selector);

		if (this.desktopMenu.length === 0) {
			console.error('Invalid selector provided.');
		} else {
			this.init();
		}
	};

	FullyResponsiveMenu.prototype = {

		init: function () {
			this.prepareItems();
			this.copyDesktopMenuIntoResponsiveMenu();
			this.listenForResize();
		},

		prepareItems: function () {
			this.desktopMenu.find('li').each(function (i) {
				$(this).attr('data-id', 'identifier--' + i);
			});
		},

		copyDesktopMenuIntoResponsiveMenu: function () {
			this.desktopMenu.parent().append('<div class="' + this.options.classMobileMenuContainer + '"><a href="#" class="' + this.options.classMobileMenuButton + '">►</a><ul class="' + this.options.classMobileMenu + '" style="display: none"></ul></div>');

			$('.' + this.options.classMobileMenu).append(
				this.desktopMenu.find('li')
					.clone()
					.attr('class', '')
					.addClass(this.options.classMobileMenuItem)
			);

			var self = this;
			$('.' + this.options.classMobileMenuButton).on('click', function (e) {
				e.preventDefault();
				$('.' + self.options.classMobileMenu).toggle();
				return false;
			});
		},

		listenForResize: function () {
			var self = this;
			$(window).resize(function () {
				self.responsiveMenu();
			});
			self.responsiveMenu();
		},

		responsiveMenu: function () {

			$('.' + this.options.classMobileMenuItem + ', ' + this.options.selector + ' li').hide();

			var self = this,
				viewportWidth = $(window).width(),
				menuWidth = 0,
				buffer = 80; // allow space for the slicknav_menu to overlap, padding, etc

			this.desktopMenu.find('li').each(function (i) {
				
				var listItemWidth = $(this).width(),
					selector;

				// ie6 fix
				if (listItemWidth == 0) {
					listItemWidth = 150;
				}

				menuWidth += listItemWidth;

				if (menuWidth + buffer > viewportWidth) {
					selector = '.' + self.options.classMobileMenuItem + '[data-id="identifier--' + i + '"]';
				} else {
					selector = self.options.selector + ' li[data-id="identifier--' + i + '"]';
				}

				$(selector).show();
			});

			this.displayMobileMenuIfItHasItems();
		},

		displayMobileMenuIfItHasItems: function () {
			var itemsOnDisplay = 0;
			$('.' + this.options.classMobileMenuItem).each(function () {
				if ($(this).css('display') !== 'none') {
					itemsOnDisplay++;
				}
			});

			if (itemsOnDisplay > 0) {
				$('.' + this.options.classMobileMenuContainer).show();
			} else {
				$('.' + this.options.classMobileMenuContainer).hide();
			}
		}

	};

	return FullyResponsiveMenu;
});