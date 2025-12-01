/// <reference types="./globals.d.ts" />

(function () {

	try {

		$('#photoPortfolio').nanoGallery({
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
			thumbnailGutterHeight: 0
		});

		// init bootstrap scrollspy for nav section highlighting behavior
		$('body').scrollspy({
			target: '.navbar',
			offset: 160
		});

		// Make sure gallery displays properly when this tab is open
		/** @type {HTMLDetailsElement | null} */
		const gallery_tab = document.querySelector('.nanoGallery');
		gallery_tab?.addEventListener("toggle", (e) => {
			if (gallery_tab.hasAttribute('open')) {
				// we need to reload if the thumbnail widths are 0px
				if(gallery_tab.querySelector('.nanoGalleryThumbnailContainer')?.getAttribute('style')?.includes('width: 0px')) {
					$('#photoPortfolio').nanoGallery('reload');
				}
			}
		});

	} catch (error) {
		console.error(error);
	}

})();
