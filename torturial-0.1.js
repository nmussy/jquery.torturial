/*
 *  Copyright 2013 Jimmy Gaussen
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
;(function ($) {
	var views, currentView, currentStep,
	handlers = {
		leftArrowClick: function(e) {
			transitions.openPreviousView.apply(e.data.element);
		},
		rightArrowClick: function(e) {
			transitions.openNextView.apply(e.data.element);
		},
		selectorClick: function(e) {
			transitions.cleanStep.apply(e.data.element);
			e.data.element.currentView = $(this).attr('data-view');
			e.data.element.currentStep = 0;
			transitions.openCurrentView.apply(e.data.element);
		},
		closeClick: function(e) {
			methods.destroy.apply(e.data.element);
		},
		multipleViewsKeydown: function(e) {
			if(e.keyCode == 27) { // ESC
				e.stopPropagation();
				methods.destroy.apply(e.data.element);
			}
			else if(e.keyCode == 37 && e.data.element.currentView != 0) { // Left Arrow
				e.stopPropagation();
				transitions.openPreviousView.apply(e.data.element);
			}
			else if(e.keyCode == 39 && e.data.element.currentView != e.data.element.views.length - 1) { // Right Arrow
				e.stopPropagation();
				transitions.openNextView.apply(e.data.element);
			}
		},
		singleViewKeydown: function(e) {
			if(e.keyCode == 27) { // ESC
				e.stopPropagation();
				methods.destroy.apply(e.data.element);
			}
		}
	},
	transitions = {
		openCurrentView: function () {
			$('.selected-element').removeClass('selected-element');
			$('.selector-element[data-view="' + this.currentView + '"]').addClass('selected-element');

			if(this.views.length > 1) {
				if(this.currentView <= 0)
					$('#torturial-left-arrow').remove();
				else if($('#torturial-left-arrow').length == 0) {
					$(this).append('<div id="torturial-left-arrow">&lt;</div>');
					$('#torturial-left-arrow').on('click', {element: this}, handlers.leftArrowClick);
				}

				if(this.currentView >= this.views.length - 1)
					$('#torturial-right-arrow').remove();
				else if($('#torturial-right-arrow').length == 0) {
					$(this).append('<div id="torturial-right-arrow">&gt;</div>');
					$('#torturial-right-arrow').on('click', {element: this}, handlers.rightArrowClick);
				}
			}
			transitions.openCurrentStep.apply(this);
		},
		openPreviousView: function () {
			if(this.currentView <= 0)
				return false;

			transitions.cleanStep.apply(this);
			this.currentStep = 0;
			this.currentView--;
			transitions.openCurrentView.apply(this);
		},
		openNextView: function () {
			if(this.currentView >= this.views.length - 1)
				return false;

			transitions.cleanStep.apply(this);
			this.currentStep = 0;
			this.currentView++;
			transitions.openCurrentView.apply(this);
		},
		openCurrentStep: function () {
			alert(this.currentView +  ' : ' + this.currentStep);
			if(this.currentStep == this.views[this.currentView].steps.length) {
				if(this.currentView == this.views.length) {
					// END OF SLIDESHOW
					return false;
				}
				this.currentStep = 0;
				++this.currentView;
				transitions.openNextView.apply(this);
				return false;
			}

			if(typeof this.views[this.currentView].steps[this.currentStep].popovers !== 'undefined') {
				this.views[this.currentView].steps[this.currentStep].popovers.forEach(function (element) {
					var popover = $('<div class="torturial-popover"></div>');

					if(typeof element.id !== 'undefined' && element.id.length > 0)
						popover.attr('id', element.id);

					if(typeof element.text !== 'undefined' && element.text.length > 0)
						$('<div class="torturial-popover-text">' + element.text + '</div>').appendTo(popover);

					$(this).append(popover);

					if(typeof element.attachTo !== 'undefined' && element.attachTo.length == 1) {
						var attach = element.attachTo;

						attach.css('z-index', function(index, value) {
							$(this).attr('data-z-index', value);
							return 9999;
						});

						attach.css('position', function(index, value) {
							$(this).attr('data-position', value);
							return 'relative';
						});

						popover.css({position: 'absolute'});

						switch(element.attachPos) {
							case 'top':
								$('<div class="torturial-popover-arrow-top"></div>').prependTo(popover);
								popover.css({
									top: attach.offset().top - popover.outerHeight(true) - 15,
									left: attach.offset().left - popover.outerWidth() / 2 + attach.outerWidth() / 2									
								});
								popover.children('.torturial-popover-arrow-top').css(
									'left', attach.offset().left - popover.offset().left + 5);
								break;
							case 'bottom':
								$('<div class="torturial-popover-arrow-bottom"></div>').prependTo(popover);
								popover.css({
									top: attach.offset().top + attach.outerHeight() + 15,
									left: attach.offset().left - popover.outerWidth() / 2 + attach.outerWidth() / 2
								});
								popover.children('.torturial-popover-arrow-bottom').css(
									'right', attach.offset().right - popover.offset().right - 5);
								break;
							case 'left':
								$('<div class="torturial-popover-arrow-left"></div>').prependTo(popover);
								popover.css({
									top: attach.offset().top + attach.outerHeight() / 2 - popover.outerHeight() / 2,
									left: attach.offset().left - popover.outerWidth(true) - 15
								});
								popover.children('.torturial-popover-arrow-left').css(
									'bottom', attach.offset().bottom - popover.offset().bottom + 5);
								break;
							default:
								$('<div class="torturial-popover-arrow-right"></div>').prependTo(popover);
								popover.css({
									top:  attach.offset().top +  attach.outerHeight() / 2 - popover.outerHeight() / 2,
									left:  attach.offset().left	+  attach.outerWidth() + 15
								});
								popover.children('.torturial-popover-arrow-right').css(
									'top', attach.offset().top - popover.offset().top - 5);
						}
					} else if (typeof element.position !== 'undefined' && element.position.length == 2) {
						popover.css({
							position: 'absolute',
							left: element.position[0],
							top: element.position[1]
						});
					} else { // defaults

					}
				}, this);
			}

			if(typeof this.views[this.currentView].steps[this.currentStep].foreground !== 'undefined'
				&& this.views[this.currentView].steps[this.currentStep].foreground.length > 0) {
				this.views[this.currentView].steps[this.currentStep].foreground.css('z-index', function(index, value) {
					$(this).attr('data-z-index', value);
					return 9999;
				});
				this.views[this.currentView].steps[this.currentStep].foreground.css('position', function(index, value) {
					$(this).attr('data-position', value);
					return 'relative';
				});
			}

			if(typeof this.views[this.currentView].steps[this.currentStep].delay !== 'undefined'
				&& this.views[this.currentView].steps[this.currentStep].delay.length > 0) {
				setTimeout(function () {
					$(this).children('.torturial-popover').remove();
					++this.currentStep;
					transitions.openNextStep.apply(this);
				}, this.views[this.currentView].steps[this.currentStep].delay);
			} 
			if (typeof this.views[this.currentView].steps[this.currentStep].changeOn !== 'undefined'
				&& this.views[this.currentView].steps[this.currentStep].changeOn.length > 1) {
				var changeOn = this.views[this.currentView].steps[this.currentStep].changeOn;
				
				var data = {};
				if(typeof changeOn[1] === 'object')
					var data = changeOn[1];
				else if(typeof changeOn[2] === 'object')
					var data = changeOn[2];

				data['foobarbaz'] = {element: this, eventType: changeOn[0]};

				var selector = '';	
				if(typeof changeOn[1] === 'string')
					var selector = changeOn[1];


				if(typeof changeOn[changeOn.length - 1] === 'function')
					data.foobarbaz['userHandler'] = changeOn[changeOn.length - 1];

				data.foobarbaz['handler'] = function(e) {
					if('userHandler' in e.data.foobarbaz) {
						var result = e.data.foobarbaz.userHandler.call(this, e);
						if(result == false)
							return;
					}

					$(document).off(e.data.foobarbaz.eventType, e.data.foobarbaz.handler);
					transitions.openNextStep.apply(e.data.foobarbaz.element);
				};

				$(document).on(changeOn[0], selector, data, data.foobarbaz.handler);
			}
			else { // defaults

			}

		},
		openNextStep: function () {
			if(this.currentStep >= this.views[this.currentView].steps.length - 1) {
				this.currentStep = 0;
				transitions.openNextView.apply(this);
				return;
			}
			transitions.cleanStep.apply(this);
			this.currentStep++;
			transitions.openCurrentStep.apply(this);
		},
		cleanStep: function() {
			$(this).children('.torturial-popover').remove();
			if(typeof this.views[this.currentView].steps[this.currentStep].popovers !== 'undefined') {
				this.views[this.currentView].steps[this.currentStep].popovers.forEach(function (element) {
					if(typeof element.attachTo !== 'undefined') {
						element.attachTo.css('z-index', function() {
							var old = $(this).attr('data-z-index');
							$(this).removeAttr('data-z-index');
							return old;
						}).css('position', function() {
							var old = $(this).attr('data-position');
							$(this).removeAttr('data-position');
							return old;
						});
					}
				});
			}

			if(typeof this.views[this.currentView].steps[this.currentStep].foreground !== 'undefined') {
				this.views[this.currentView].steps[this.currentStep].foreground.css('z-index', function() {
					var old = $(this).attr('data-z-index');
					$(this).removeAttr('data-z-index');
					return old;
				}).css('position', function() {
					var old = $(this).attr('data-position');
					$(this).removeAttr('data-position');
					return old;
				});
			}
		}
	},	
	methods = {
		initialize: function(views, options) {
			$(this).addClass('torturial').attr('hidden', 'hidden')
				.append('<div id="torturial-background"></div>')
				.append('<button id="torturial-close">&times;</button>');

			$('#torturial-close').one('click', {element: this}, handlers.closeClick);

			this.views = views;
			if(typeof options.startingView !== 'undefined')
				if(options.startingView > this.views.length - 1)
					this.currentView = this.views.length - 1;
				else
					this.currentView = options.startingView;
			else
				this.currentView = $.fn.torturial.defaultSettings.startingView;

			if(typeof options.startingStep !== 'undefined')
				if(options.startingStep > this.views[this.currentView].steps.length - 1)
					this.currentStep = this.views[this.currentView].steps.length - 1;
				else
					this.currentStep = options.startingStep;
			else
				this.currentStep = $.fn.torturial.defaultSettings.startingStep;

			if(this.views.length > 1) {
				if(this.currentView != 0) {
					$(this).append('<div id="torturial-left-arrow">&lt;</div>');
					$('#torturial-left-arrow').on('click', {element: this}, handlers.leftArrowClick);
				}
				if(this.currentView != this.views.length - 1) {
					$(this).append('<div id="torturial-right-arrow">&gt;</div>');
					$('#torturial-right-arrow').on('click', {element: this}, handlers.rightArrowClick);
				}

				$(this).append('<div id="torturial-selector"></div>');
				for(var i = 0; i < this.views.length; ++i)
					$(this).children('#torturial-selector').append('<span data-view="' + i + '" class="selector-element"></span>');

				$('#torturial-selector').on('click', '.selector-element:not(.selected-element)', {element: this}, handlers.selectorClick);
			}

			if(typeof this.views[this.currentView].title !== 'undefined' && this.views[this.currentView].title.length > 0)
				$(this).prepend('<div id="torturial-title"><h2>' + this.views[this.currentView].title +'</h2></div>');
			return this;
		},
		show: function() {
			if(typeof $(this).attr('hidden') === 'undefined')
				return;

			if(this.views.length > 1)
				$(document).on('keydown', {element: this}, handlers.multipleViewsKeydown);
			else 
				$(document).on('keydown', {element: this}, handlers.singleViewKeydown);

			$(this)
				.css('z-index', function(index, value) {
					$(this).attr('data-z-index', value);
					return 9999;
				}).css('position', function(index, value) {
					$(this).attr('data-position', value);
					return 'absolute';
				}).css('top', function(index, value) {
					$(this).attr('data-top', value);
					return 0;
				}).css('left', function(index, value) {
					$(this).attr('data-left', value);
					return 0;
				}).css('width', function(index, value) {
					$(this).attr('data-width', value);
					return '100%';
				}).css('height', function(index, value) {
					$(this).attr('data-height', value);
					return '100%';
				}).removeAttr('hidden');

			transitions.openCurrentView.apply(this);
			return $(this);
		},
		hide: function() {
			if(typeof $(this).attr('hidden') !== 'undefined')
				return;

			if(this.views.length > 1)
				$(document).off('keydown', handlers.multipleViewsKeydown);
			else 
				$(document).off('keydown', handlers.singleViewKeydown);

			$(this).attr('hidden', 'hidden')
				.css('z-index', function(index, value) {
					var old = $(this).attr('data-z-index');
					$(this).removeAttr('data-z-index');
					return old;
				}).css('position', function(index, value) {
					var old = $(this).attr('data-position');
					$(this).removeAttr('data-position');
					return old;
				}).css('top', function(index, value) {
					var old = $(this).attr('data-top');
					$(this).removeAttr('data-top');
					return old;
				}).css('left', function(index, value) {
					var old = $(this).attr('data-left');
					$(this).removeAttr('data-left');
					return old;
				}).css('width', function(index, value) {
					var old = $(this).attr('data-width');
					$(this).removeAttr('data-width');
					return old;
				}).css('height', function(index, value) {
					var old = $(this).attr('data-height');
					$(this).removeAttr('data-height');
					return old;
				});
			return $(this);
		},
		destroy: function() {
			methods.hide.apply(this);
			if(this.views.length > 1)
				$(document).off('keydown', handlers.multipleViewsKeydown);
			else
				$(document).off('keydown', handlers.singleViewKeydown);

			$(this).empty().removeAttr('hidden').removeClass('torturial');
			return $(this);
		}
	};

	$.fn.torturial = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, [].slice.call(arguments, 1));
		} else {
			return methods.initialize.apply(this, arguments);
		}
	};

	$.fn.torturial.defaultSettings = {
		startingView: 0,
		startingStep: 0,
		attachPos: 'left',
		viewTransition: {
			previous: [],
			next: []
		},
		stepTransition: {
			previous: [],
			next: []
		}
	};
}(window.jQuery));