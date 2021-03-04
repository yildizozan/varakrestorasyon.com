(function ($, window, document, undefined) {
    'use strict';
    $(function () {
        $(document).ready(function () {
			var $rtl = false;
			if ($('html').attr('dir') == 'rtl'){
				$rtl = true;
			}
            $('[data-slide="owl-carousel"]').each(function () {
                $(this).vcOwlCarousel({
					rtl: $rtl,
					loop: true,
					navText: ['',''],
					margin: parseInt($(this).attr('data-margin')),
					stagePadding: 15,
					dots: $.parseJSON($(this).attr('data-dots')),
					nav: $.parseJSON($(this).attr('data-nav')),
					autoplay: $.parseJSON($(this).attr('data-autoplay')),
					autoplayspeed: parseInt($(this).attr('data-autoplayspeed')),
					autoplayHoverPause: $.parseJSON($(this).attr('data-autoplayHoverPause')),
					responsive:{
						0:{
							items:1,
						},
						576:{
							items: $(this).attr('data-cols-sm'),
						},
						768:{
							items: $(this).attr('data-cols-md'),
						},
						992:{
							items: $(this).attr('data-cols-lg'),
						},
						1200:{
							items: $(this).attr('data-cols-xl'),
						},
					}
				});
            });
            if ($('[data-layout="isotope"]').length) {
                var $originLeft = false;
                if ($rtl) {
                    $originLeft = true;
                }
                $('[data-layout="isotope"]').each( function() {
                    var $isotope = $(this).imagesLoaded(function () {
                        $isotope.isotope({
                            itemSelector: '.isotope-item',
                            percentPosition: true,
                            layoutMode: 'masonry',
                            originLeft: $originLeft,
                        });
                    });
                    $(this).prev('.filters-button-group').on('click', '.filter-btn', function () {
                        var filterValue = $(this).attr('data-filter');
                        $isotope.isotope({filter: filterValue});
                        if(($(this).not('.is-checked'))){
                            $(this).parents('.filters-button-group').eq(0).find('.is-checked').removeClass('is-checked');
                            $(this).addClass('is-checked');
                        }
                    });
                });
            }
            $(window).on('resize', function () {
                
            });
        });
    });

})(jQuery, window, document);
