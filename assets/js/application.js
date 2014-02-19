// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {

  $(function(){

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })

    // make code pretty
    window.prettyPrint && prettyPrint()

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

}(window.jQuery)

$(document).ready(function(){
	// Add uyan plugin
	$('div.content').append($('<div id="uyan_frame" style="margin-top:20px"></div><script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid=1529249"></script>'));

	// Ready for trying new version
	if(window.history.pushState && window.history.replaceState){
		$('ul.nav').append($('<li><a class="try_new" href="#tryNewModal" data-toggle="modal">极速模式</a></li>'));
		$('body').prepend($(
		'<div id="tryNewModal" class="modal hide fade" tabindex="-1">\
		  <div class="modal-header">\
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
			<h3 id="myModalLabel">试验功能提示</h3>\
		  </div>\
		  <div class="modal-body">\
			<p>即将尝试进入极速模式，该模式下将临时启用<code>PJAX</code>技术来加载页面，全程<b>无刷新异步加载</b>，大幅减少加载时间。</p>\
			<p style="text-align:center;font-size:20px;margin:12px">PJAX = PushState + AJAX</p>\
			<p>该模式仅在最新的Chrome、Firefox以及IE10上测试过，其他浏览器慎入。</p>\
			<p>极速模式在您<b>刷新本站任意页面后自动取消</b>，您可以按顶部导航栏的“极速模式”按钮再次进入。</p>\
		  </div>\
		  <div class="modal-footer">\
			<button class="btn" data-dismiss="modal">取消</button>\
			<button class="btn btn-primary try_new_confirm">启用极速模式</button>\
		  </div>\
		</div>'));
	}
	
	/* hot fix : "fade of modal not supported in IE10" */
	if(navigator.appVersion.match(/MSIE 10.0/)){
		$('.modal').removeClass('fade');
	}
	$('.try_new_confirm').on('click',function(e){
		e.preventDefault();
		window.location.href = "/sdl-tutorial-cn/jump.html?"+window.location.href;
	});
	
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
	
	function scrollTo(y){
		if(navigator.userAgent.match(/Android/i)){
			if(y <= 0)
				y = 1;
		}
		//console.info('[scroll]: '+y);
	    $("html, body").animate({scrollTop:y},'500', 'swing');
	}
	
	$("a[href]").on('click',function(e){
		var link = $(this).attr('href');
		if(link.match(/^#/)){ // inner anchor
			var href = $(this).attr('href');
			var anchor = href.substring(1);
			if(anchor == '')
				scrollTo(0);
			else{
				var offset = $('a[name="'+anchor+'"]').offset();
				if(offset)
					scrollTo(offset.top);
				else
					scrollTo(0);
			}
			e.preventDefault();
		}
	});
});
