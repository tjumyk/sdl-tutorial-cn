// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {

  $(function(){

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this)
        , method = $this.attr('checked') ? 'addClass' : 'removeClass'
      $(this).parents('.add-on')[method]('active')
    })

    // position static twipsies for components page
    if ($(".twipsies a").length) {
      $(window).on('load resize', function () {
        $(".twipsies a").each(function () {
          $(this)
            .tooltip({
              placement: $(this).attr('title')
            , trigger: 'manual'
            })
            .tooltip('show')
          })
      })
    }

    // add tipsies to grid for scaffolding
    if ($('#grid-system').length) {
      $('#grid-system').tooltip({
          selector: '.show-grid > div'
        , title: function () { return $(this).width() + 'px' }
      })
    }

    // fix sub nav on scroll
    var $win = $(window)
      , $nav = $('.subnav')
      , navTop = $('.subnav').length && $('.subnav').offset().top - 40
      , isFixed = 0

    processScroll()

    // hack sad times - holdover until rewrite for 2.1
    $nav.on('click', function () {
      if (!isFixed) setTimeout(function () {  $win.scrollTop($win.scrollTop() - 47) }, 10)
    })

    $win.on('scroll', processScroll)

    function processScroll() {
      var i, scrollTop = $win.scrollTop()
      if (scrollTop >= navTop && !isFixed) {
        isFixed = 1
        $nav.addClass('subnav-fixed')
      } else if (scrollTop <= navTop && isFixed) {
        isFixed = 0
        $nav.removeClass('subnav-fixed')
      }
    }

    // tooltip demo
    $('.tooltip-demo.well').tooltip({
      selector: "a[rel=tooltip]"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // popover demo
    $("a[rel=popover]")
      .popover()
      .click(function(e) {
        e.preventDefault()
      })

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })

    // carousel demo
    $('#myCarousel').carousel()

    // javascript build logic
    var inputsComponent = $("#components.download input")
      , inputsPlugin = $("#plugins.download input")
      , inputsVariables = $("#variables.download input")

    // toggle all plugin checkboxes
    $('#components.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsComponent.attr('checked', !inputsComponent.is(':checked'))
    })

    $('#plugins.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsPlugin.attr('checked', !inputsPlugin.is(':checked'))
    })

    $('#variables.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsVariables.val('')
    })

    // request built javascript
    $('.download-btn').on('click', function () {

      var css = $("#components.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , js = $("#plugins.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , vars = {}
        , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png']

    $("#variables.download input")
      .each(function () {
        $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
      })

      $.ajax({
        type: 'POST'
      , url: /\?dev/.test(window.location) ? 'http://localhost:3000' : 'http://bootstrap.herokuapp.com'
      , dataType: 'jsonpi'
      , params: {
          js: js
        , css: css
        , vars: vars
        , img: img
      }
      })
    })
  })

// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
$.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
  var url = opts.url;

  return {
    send: function(_, completeCallback) {
      var name = 'jQuery_iframe_' + jQuery.now()
        , iframe, form

      iframe = $('<iframe>')
        .attr('name', name)
        .appendTo('head')

      form = $('<form>')
        .attr('method', opts.type) // GET or POST
        .attr('action', url)
        .attr('target', name)

      $.each(opts.params, function(k, v) {

        $('<input>')
          .attr('type', 'hidden')
          .attr('name', k)
          .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
          .appendTo(form)
      })

      form.appendTo('body').submit()
    }
  }
})

}(window.jQuery);

/* PJAX =============================================================== */
(function(){
	var loaderElement = '<div id="pjax-loader" class="loader-wrapper"><div class="loader-wrapper-bar"><div class="loader"></div></div></div>';
	
	String.prototype.decodeHTML = function() {
		var map = {"gt":">" ,"lt":"<", "middot":"·", "nbsp":" "};
		return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
			if ($1[0] === "#") {
				return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
			} else {
				return map.hasOwnProperty($1) ? map[$1] : $0;
			}
		});
	};

	function parseURI(url) {
	  var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
	  // authority = '//' + user + ':' + pass '@' + hostname + ':' port
	  return (m ? {
		href     : m[0] || '',
		protocol : m[1] || '',
		authority: m[2] || '',
		host     : m[3] || '',
		hostname : m[4] || '',
		port     : m[5] || '',
		pathname : m[6] || '',
		search   : m[7] || '',
		hash     : m[8] || ''
	  } : null);
	}
	 
	window.absolutizeURI = function(base, href) {// RFC 3986
	 
	  function removeDotSegments(input) {
		var output = [];
		input.replace(/^(\.\.?(\/|$))+/, '')
			 .replace(/\/(\.(\/|$))+/g, '/')
			 .replace(/\/\.\.$/, '/../')
			 .replace(/\/?[^\/]*/g, function (p) {
		  if (p === '/..') {
			output.pop();
		  } else {
			output.push(p);
		  }
		});
		return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
	  }
	 
	  href = parseURI(href || '');
	  base = parseURI(base || '');
	 
	  return !href || !base ? null : (href.protocol || base.protocol) +
			 (href.protocol || href.authority ? href.authority : base.authority) +
			 removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
			 (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
			 href.hash;
	}

	var setupPjaxPage = function(){
		// make code pretty
		window.prettyPrint && prettyPrint();
		
		// show browser hint only when not using chrome
		if(!navigator.appVersion.match(/chrome/i))
			$('#installChrome').show();
		
		// Add uyan plugin
		if(typeof UYAN == 'undefined'){ // first load
			$('div.content').append($('<div id="uyan_frame" style="margin-top:20px"></div><script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid=1529249"></script>'));
		}else{ // create new element for Pjax pages
			var url = window.location.href;
			var params = 'url='+encodeURIComponent(url);
			var su = url.substring(url.indexOf('://')+3);
			params+='&su='+encodeURIComponent(su);
			params+='&title='+encodeURIComponent(document.title);
			params+='&uid=1529249&lan=zh-cn&du=&pic=&vid=&tag=&acl=';
			$('div.content').append($('<div id="uyan_frame" style="margin-top:20px"></div><script type="text/javascript" src="http://api.uyan.cc/?'+params+'"></script>'));
		}
		
		function getSys(){
			var Sys = {};
			var ua = navigator.userAgent.toLowerCase();
			var s;
			(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
			(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
			(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
			(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
			(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			return Sys;
		}
		
		var sys = getSys();
		if(sys.ie && parseFloat(sys.ie)<=8.0){
			$('.navbar').after($(
			'<div id="installChrome" class="hidden-phone" style="position:fixed;top:40px;width:100%;z-index:2">\
			  <p class="alert alert-info" align="center">为了您更好的阅读体验，请使用支持最新HTML5及CSS3的现代浏览器。推荐使用 <a target="_blank" href="http://chrome.google.com"><i class="chrome-icon"></i>Chrome(谷歌)浏览器</a>！</p>\
			</div>'));
		}
		
		$("a[href]").on('click',function(e){
			var link = $(this).attr('href');
			if(link.match(/^(http:)/)) // outer link
				return;
			if(link.match(/^(https:)/)) // outer link
				return;
			if(link.match(/^(mailto:)/)) // outer link
				return;
			if(link.match(/^(ftp:)/)) // outer link
				return;
				
			if(link.match(/^#/)){ // inner anchor
				var href = $(this).attr('href');
				var anchor = href.substring(1);
				if(anchor == '')
					scrollTo(0);
				else
					scrollTo($('a[name="'+anchor+'"]').offset().top);
				e.preventDefault();
				return;
			}
			
			if(!window.history.pushState)
				return
			
			// inner link
			pjaxLoad(link,true);
			e.preventDefault();
		});
	}

	window.pjaxLoad = function(link, push, scroll){
		$('body').append($(loaderElement));
		$.ajax({
			url: link,
			dataType: "html"
		}).done(function( responseText ) {
			var titleStart = responseText.indexOf('<title>');
			var title=responseText.substring(titleStart+7);
			title = title.substring(0,title.indexOf('<')).decodeHTML();
			
			var bodyStart = responseText.indexOf('<body');
			var body=responseText.substring(bodyStart);
			var bodyStart2 = body.indexOf('>');
			var bodyEnd = body.indexOf('</body');
			body=body.substring(bodyStart2+1,bodyEnd);
			body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
			body += loaderElement;
				
			// save current scroll position
			var state = window.history.state;
			if(!state)
				state = {url:document.location.href};
			state.scroll = window.scrollY;
			window.history.replaceState(state,"","");
			
			if(push){
				//console.info('[push]: '+link);
				window.history.pushState(null,"",link);
				window.history.replaceState({url:document.location.href},"",""); // save current absolute url
			}
			document.title = title;
			$("body").html(body);
			if(!scroll){
				var ind = link.indexOf('#');
				if(ind > 0){
					var anchor = link.substring(ind+1);
					if(anchor == '')
						scrollTo(0);
					else{
						var offset = $('a[name="'+anchor+'"]').offset();
						if(offset)
							scrollTo(offset.top);
						else
							scrollTo(0);
					}
				}else
					scrollTo(0);
			}else
				scrollTo(scroll);
			setupPjaxPage();
			$('#pjax-loader').fadeOut();
		}).complete(null);
	}
	
	function scrollTo(y){
		if(navigator.userAgent.match(/Android/i)){
			if(y <= 0)
				y = 1;
		}
		//console.info('[scroll]: '+y);
	    $("html, body").animate({scrollTop:y},'500', 'swing');
	}
	
	$(document).ready(function(){
		var link = document.location.href;
		var ind = link.indexOf('#');
		if(ind > 0){
			var anchor = link.substring(ind+1);
			//console.info('[scroll anchor]: '+anchor);
			if(anchor == '')
				scrollTo(0);
			else{
				var offset = $('a[name="'+anchor+'"]').offset();
				if(offset)
					scrollTo(offset.top);
				else
					scrollTo(0);
			}
		}else
			scrollTo(0);
		setupPjaxPage();
		$('head link[href]').each(function(){
			var link = $(this).attr('href');
			$(this).attr('href',absolutizeURI(document.location.href,link));
		});
		
		var firstUrl = window.location.href;
		var firstEvent = true;
		window.onpopstate = function(e){
			//console.info(e.state);
			if(firstEvent){
				firstEvent = false;
				return;
			}
			var url = firstUrl;
			if(e.state){
				url = e.state.url;
				pjaxLoad(url,false,e.state.scroll);
			}else
				pjaxLoad(url);
		}
	});

}());
/* End of PJAX =============================================================== */
