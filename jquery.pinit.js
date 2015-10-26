/*
 * Pinit.js
 * custom jQuery plugin
 * imhamza.com
 */

;(function ( $, window, document, undefined ) {
		var alias = 'Pinit';
		function Pinit ( element ) {
				this.element = element;
				this._name = alias;
				this.init();
		}

		$.extend(Pinit.prototype, {
				init: function () {
                    this._create(this.element);
                    this._setupEvents(this.element);
				},
				_create: function (el) {
					var $el = $(el),
						base = 'http://pinterest.com/pin/create/button/?',
						postTitle = $el.attr('data-title'),
                        postLink = $el.attr('data-permalink'),
                        imageMinWidth = 200,
                        imageMinHeight = 200;
                    
                    $el.find('img:not(.icon-heart,.pin--image)').each(function () {
                        var $image = $(this),
                            src = $image.attr('src'),
                            imageWidth = $image.attr('width'),
                            imageHeight = $image.attr('height'),
                            pinterestLink = base +'url='+ (postLink ? postLink : '') +'&description='+ (postTitle ? postTitle : '') +'&media='+ src,
                            retinaSuffix = window.devicePixelRatio > 1.5 ? '-2x' : '',
                            pinBtn = '<div class="pin--btn-link" data-link="'+ encodeURI(pinterestLink) +'"><div class="pin--btn"><img class="icon-heart" src="/wp-content/themes/sarahhearts/images/icon-heart'+ retinaSuffix +'.png" width="47" height="56"><span>Save this<br/>for later</span><div class="pin--sep"></div><span><strong>Pin it</strong></span></div></div>',
                            $pinContainer = $('<div />', {'class': 'pin--container'});
                        if( 
                            src &&
                            imageWidth &&
                            imageHeight &&
                            imageWidth >= imageMinWidth &&
                            imageHeight >= imageMinHeight
                          ) {
                            $image
                            	.addClass('pin--image')
                            	.wrap($pinContainer)
                            	.after(pinBtn);
                        }
                    });
                },
                _setupEvents: function (el){
                     $(el)
                         .on({
                            mouseenter: function () {
                                $(this).addClass('pin--btn-visible');
                            },
                            mouseleave: function () {
                                $(this).removeClass('pin--btn-visible');
                            },
                         }, '.pin--container')
                         .on({
                            mouseenter: function () {
                                $(this).addClass('pin--btn-hover');
                            },
                            mouseleave: function () {
                                $(this).removeClass('pin--btn-hover');
                            },
                         }, '.pin--btn')
                         .on('click', '.pin--btn-link', function() {
                             window.open($(this).attr('data-link'), '_blank');
                             return false;
                         });
                    }
		});


		$.fn[alias] = function () {
				return $(this).each(function() {
						if ( !$.data( this, alias ) ) {
								$.data( this, alias, new Pinit( this ) );
						}
				});
		};

})( jQuery, window, document );