define(['lib/jquery', 'lib/slicknav'], function ($) {

	var FullyResponsiveMenu = function (options) {
		
		var defaultOptions = {
			selector: ".menu"
		};

		this.options = $.extend(defaultOptions, options);

		this.menu = $(this.options.selector);

		if (this.menu.length === 0) {
			console.error('Invalid selector provided.');
		} else {
			this.init();
		}
	};

	FullyResponsiveMenu.prototype = {

		init: function () {
			this.callSlicknav();
			this.copySlicknavElementsToDesktop();
			this.listenForResize();
		},

		callSlicknav: function () {
			this.desktopMenu().slicknav({
				prependTo: 'nav',
				label: ""
			});
			this.provisionSlicknav();
		},

		provisionSlicknav: function () {
			$('.slicknav_parent').each(function () {
				var myAccount = $(this).find('.slicknav_arrow').parent().find('a');
				$(this).prepend(myAccount.clone());
				myAccount.remove();
			});
		},

		copySlicknavElementsToDesktop: function () {
			var submenu = $('.slicknav_nav .slicknav_parent');
			var unstyledSubmenu = this.desktopMenu().find('.page_item_has_children');
			unstyledSubmenu.html(submenu.clone());
			this.desktopMenu().find('.children').attr('style', '');

			this.provisionDesktop();
		},

		listenForResize: function () {
			var self = this;
			$(window).resize(function () {
				self.responsiveMenu();
			});
			self.responsiveMenu();
		},

		provisionDesktop: function () {
			this.desktopMenu().find('.children').addClass('slicknav_hidden');
			this.desktopMenu().find('.visible_has_children').append('<a href="#" role="menuitem" aria-haspopup="true" tabindex="-1" class="slicknav_item"><span class="slicknav_arrow">►</span></a>');
			this.addListenerToDesktopArrow();
		},

		addListenerToDesktopArrow: function () {
			this.desktopMenu().find('.slicknav_item').click(function (e) {
				var subMenu = $(this).parent().find('.children');
				if (subMenu.hasClass('slicknav_hidden')) {
					$(this).html('▼');
					subMenu.slideDown();
					subMenu.removeClass('slicknav_hidden');
				} else {
					$(this).html('►');
					subMenu.slideUp();
					subMenu.addClass('slicknav_hidden');
				}
				e.preventDefault();
				return false;
			});				
		},

		responsiveMenu: function () {

			var self = this,
				viewportWidth = $(window).width(),
				menuWidth = 0,
				buffer = 80; // allow space for the slicknav_menu to overlap, padding, etc

			this.desktopMenu().find('.page_item').each(function (i) {
				// we don't want to run this block on nested menus
				if (!($(this).parent().parent().hasClass('page_item'))) {
					var uniqueClass = self.getUniqueClass($(this).attr('class')),
						listItemWidth = $(this).width();

					// ie6 fix
					if (listItemWidth == 0) {
						listItemWidth = 150;
					}

					if (uniqueClass) {
						menuWidth += listItemWidth;

						if (menuWidth + buffer > viewportWidth) {
							self.addToMobileMenu(uniqueClass);
						} else {
							self.addToDesktopMenu(uniqueClass);
						}
					}
				}
			});
			this.displayMobileMenuIfItHasItems();
		},

		displayMobileMenuIfItHasItems: function () {
			var mobileMenu  = this.mobileMenu();

			if (mobileMenu.find('.visible:not(.visible--submenuitem)').length > 0) {
				mobileMenu.parent().addClass('visible');
			} else {
				mobileMenu.parent().removeClass('visible');
			}
		},

		getUniqueClass: function (multipleClasses) {
			var pageID = multipleClasses.match(/[0-9]+/);
			if (pageID !== null) {
				return ".page-item-" + pageID;
			}
			return false;
		},

		addToMobileMenu: function (menuItem) {
			this.desktopMenu().find(menuItem).removeClass('visible');
			this.mobileMenu().find(menuItem).addClass('visible');
		},

		addToDesktopMenu: function (menuItem) {
			this.mobileMenu().find(menuItem).removeClass('visible');
			this.desktopMenu().find(menuItem).addClass('visible');
		},

		desktopMenu: function () {
			return this.menu;
		},

		mobileMenu: function () {
			return $('.slicknav_menu .slicknav_nav');
		}

	};

	return FullyResponsiveMenu;
});