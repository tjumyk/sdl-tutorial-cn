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

// Add uyan plugin
$('div.content').append($('<div id="uyan_frame" style="margin-top:20px"></div><script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid=1529249"></script>'));

// Ready for trying new version
$('ul.nav').append($('<li><a class="try_new" href="#tryNewModal" data-toggle="modal">尝试新版</a></li>'));
$('body').prepend($(
'<div id="tryNewModal" class="modal hide fade" tabindex="-1">\
  <div class="modal-header">\
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
    <h3 id="myModalLabel">尝鲜提示</h3>\
  </div>\
  <div class="modal-body">\
    <p>即将进入尝鲜模式，该模式下将临时启用<code>PJAX</code>技术来加载页面，全程无刷新异步加载，大幅减少加载时间。</p>\
	<p style="text-align:center;font-size:20px;margin:12px">PJAX = PushState + AJAX</p>\
	<p>另外，该模式将启用最新版本的二代Bootstrap框架(2.3.2)，所以会有小幅<b>界面优化</b>。</p>\
	<p>但请冷静！由于代码还<b>未稳定</b>，可能存在各种潜在问题。尤其在各种<b>浏览器的兼容</b>方面，作者表示十分伤脑筋。如果遇到问题，敬请谅解并请告知作者！</p>\
	<p>尝鲜模式在您<b>刷新本站任意页面后自动取消</b>，您可以按顶部导航栏的“尝试新版”按钮再次进入。</p>\
  </div>\
  <div class="modal-footer">\
    <button class="btn" data-dismiss="modal">取消</button>\
    <button class="btn btn-primary try_new_confirm">确定尝鲜</button>\
  </div>\
</div>'));
/* hot fix : "fade of modal not supported in IE10" */
if(navigator.appVersion.match(/MSIE 10.0/)){
	$('.modal').removeClass('fade');
}
$('.try_new_confirm').on('click',function(e){
	e.preventDefault();
	window.location.href = "/sdl-tutorial-cn/jump.html?"+window.location.href;
});
