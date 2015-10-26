/*
 * SocialCount.js
 * custom jQuery plugin
 * imhamza.com
 */

;(function ( $, window, document, undefined ) {
		var alias = 'SocialCount';
		function SocialCount ( element ) {
            var $element = $(element);
			this._name = alias;
			this._url = $element.attr('data-link');
            this._title = $element.attr('data-title');
            this._id = $element.attr('data-id');
            this._media = $element.attr('data-media');
			if(this._url) {
				this.init();
			}
		}

		$.extend(SocialCount.prototype, {
			init: function () {
                if(this.isGrid) {
                    this._countPinterestGrid(this);
                } else {
                    this._countFacebook(this);
                    this._countTwitter(this);
                    this._countPinterest(this);
                    this._countGooglePlus(this);
                }
			},
			_countFacebook: function (obj) {
                $.getJSON(obj.requestURL.facebook + obj._url).done( function(data) {
                    obj.updateCount(data.shares || 0, 'fb');
                });
            },
            _countTwitter: function (obj) {
                $.getJSON(obj.requestURL.twitter + obj._url).done(function(data) {
                    obj.updateCount(data.count || 0, 'tw');
                });
            },
            _countPinterest: function(obj) {
                $.getJSON(obj.requestURL.pinterest , { url: obj._url }).done(function (data) {
                    obj.updateCount(data.count || 0, 'pt');
                });
            },
            _countPinterestGrid: function(obj) {
                $.getJSON(obj.requestURL.pinterest , { url: obj._url }).done(function (data) {
                    var elementSelector = '#post-'+ obj._id +' .pin--post-thumbnail',
                        $element = $(elementSelector),
                        count = parseInt(data.count),
                        link = 'http://pinterest.com/pin/create/button/?description=' + obj._title + '&url=' + encodeURI(obj._url) + '&media=' + encodeURI(obj._media);
                    if(count === 0) {
                        // Do nothing
                    } else if(count === 1) {
                        $element.html( '1 PIN' );
                    } else {
                        $element.html( count + ' PINS' );                            
                    }
                    $element.attr( 'href', link );
                });
            },
            _countGooglePlus: function(obj) {
                var data = {
                    'method': 'pos.plusones.get',
                    'id': obj._url,
                    'params':{
                        'nolog': true,
                        'id': obj._url,
                        'source':'widget',
                        'userId':'@viewer',
                        'groupId':'@self'
                    },
                    'jsonrpc':'2.0',
                    'key':'p',
                    'apiVersion':'v1'
                };
                $.ajax({
                    type: 'POST',
                    url: this.requestURL.googleplus,
                    processData: true,
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(r) {
                        obj.updateCount(r.result.metadata.globalCounts.count || 0, 'gp');
                    }
                });
            },
            updateCount: function(count, name) {
                $('#post-'+ this._id +' .'+ name +'--counter').html(count);
            },
            isGrid: $('.posts-grid').length ? true : false,
            requestURL: {
                facebook: 'http://graph.facebook.com/?callback=?&id=',
                twitter: 'https://cdn.api.twitter.com/1/urls/count.json?callback=?&url=',
                pinterest: 'http://api.pinterest.com/v1/urls/count.json?callback=?',
                googleplus: 'https://clients6.google.com/rpc'
            }
            
		});

		$.fn[alias] = function () {
				return $(this).each(function() {
						if ( !$.data( this, alias ) ) {
								$.data( this, alias, new SocialCount(this) );
						}
				});
		};

})( jQuery, window, document );

/*
 * Retina images
 * only for theme's images
 */

if( window.devicePixelRatio > 1.5 ) {
    jQuery('.has-retina').each( function() {
        var $this = jQuery(this), n = $this.attr('data-2x');
        if(n) {
            $this.attr( 'src', n );
        }
    });
}