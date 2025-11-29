/// <reference types="./JQueryStatic.d.ts" />

(function () {

	try {
		/**
		 * 
		 * @param {string} galleryElem 
		 */
		function flickrNano(galleryElem) {
			//@ts-expect-error
			$(galleryElem).nanoGallery({
				kind: 'flickr',
				userID: '142772868@N08',
				photoset: '72157667342772360',
				thumbnailWidth: 'auto',
				thumbnailHeight: 250,
				thumbnailHoverEffect: [{ name: 'labelAppear75', duration: 300 }],
				thumbnailLazyLoad: true,
				theme: 'light',
				viewerToolbar: { style: 'fullWidth' },
				thumbnailGutterWidth: 0,
				thumbnailGutterHeight: 0,
				fnInitGallery: function () {
					$(galleryElem).hide();
				}
			});
		};

		flickrNano('#photoPortfolio');

		$('.navbar-fixed-top a, .back-to-top-wrapper a, .portfolio-nav').bind('click', function (event) {
			//portfolio nav behavior for showing/hiding selected sections
			if ($(this).hasClass("portfolio-nav")) {
				$(".portfolio-section").hide();
				$($(this).attr("href")).show();
			}
		});

		//init bootstrap scrollspy for nav section highlighting behavior
		//@ts-expect-error
		$('body').scrollspy({
			target: '.navbar',
			offset: 160
		});

	} catch (error) {
		console.error(error);
	}

})();
