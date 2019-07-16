var $ = jQuery;
function asdCounter() {
    $(".asdCounter").each(function() {
        if ($(this).hasClass('start')) {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).removeClass('start');
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 2500,
                    easing: 'swing',
                    step: function(now) {
                        $(this).text(Math.ceil(now) + '%');
                    }
                });
            }
        }
    });
}
function top_menu_sticky() {
    var headerHieght = $('header').outerHeight(true);
    if ($(window).scrollTop() > headerHieght) {
        $("body").addClass("sticky-header");
    } else {
        $("body").removeClass("sticky-header");
    }
}
$(document).ready(function() {

    $('.content-res-menu a').on('click', function(e) {
        var navHeight = $('.header-outer').outerHeight();
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('[id="' + $(this).attr('href').substr(1) + '"]').offset().top - navHeight - 30
        }, 1000);
    });

    $(window).scroll(function() {
        top_menu_sticky();
        if ($(window).scrollTop() > 400) {
            $('footer .back-to-top').addClass('ahs-visiable');
        } else {
            $('footer .back-to-top').removeClass('ahs-visiable');
        }
        if ($('.programSelectBlock').length > 0) {
            if ($(window).scrollTop() > $('.programSelectBlock').offset().top) {
                $('body').addClass('asd-widget-search-fixed');
            } else {
                $('body').removeClass('asd-widget-search-fixed');
            }
        }
    });
    $('.mobile-menu').on('click', function(e) {
        if ($(window).innerWidth() < 981) {
            $('#top-menu-nav').toggleClass('opened');
            $(this).next().slideToggle();
        }
    });
    $('.menu-item-has-children a').on('click', function(e) {
        if ($(window).innerWidth() < 981) {
            $(this).toggleClass('active');
            $(this).next().slideToggle();
        }
    });
    $('#search_icon,.close_search_field').on('click', function(e) {
        e.stopImmediatePropagation();
        $('body').toggleClass('active-search');
        $('.search-field').focus();
    });
    if ($('footer .back-to-top').length > 0) {
        $("footer .back-to-top a").click(function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 'slow');
        });
    }
    $(document).on('click', '.advgb-accordion-block .advgb-accordion-header', function(e) {
        e.stopImmediatePropagation();
        $(this).next().slideToggle(400);
        if ($(this).parent('.advgb-accordion-inner').hasClass('tab-close')) {
            $(this).parent('.advgb-accordion-inner').removeClass('tab-close').addClass('tab-open');
        } else {
            $(this).parent('.advgb-accordion-inner').removeClass('tab-open').addClass('tab-close');
        }
    });
    jQuery(function($) {
        $('#content').on('click', '#pagination a', function(e) {
            $('#blog-page-main').addClass('wait-for-blog-info');
            e.preventDefault();
            var link = $(this).attr('href');
            $('#content').load(link + ' #content', function() {
                goToByScroll($('#content').attr("id"));
                $('#blog-page-main').removeClass('wait-for-blog-info');
            });
        });
    });
    function goToByScroll(id) {
        id = id.replace("link", "");
        $('html,body').animate({
            scrollTop: $("#blog-page-main").offset().top - 110
        }, 1000);
    }
});
$(window).resize(function() {
    top_menu_sticky();
});
$(window).scroll(function() {
    asdCounter();
});
