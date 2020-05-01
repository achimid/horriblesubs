
(function ($) {


	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function () {
		setTimeout(function () {
			if ($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
	$.Scrollax();


	$('nav .dropdown').hover(function () {
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function () {
		var $this = $(this);
		// timer;
		// timer = setTimeout(function(){
		$this.removeClass('show');
		$this.find('> a').attr('aria-expanded', false);
		// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
		console.log('show');
	});

	// scroll
	var scrollWindow = function () {
		$(window).scroll(function () {
			var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar'),
				sd = $('.js-scroll-wrap');

			if (st > 150) {
				if (!navbar.hasClass('scrolled')) {
					navbar.addClass('scrolled');
				}
			}
			if (st < 150) {
				if (navbar.hasClass('scrolled')) {
					navbar.removeClass('scrolled sleep');
				}
			}
			if (st > 350) {
				if (!navbar.hasClass('awake')) {
					navbar.addClass('awake');
				}

				if (sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if (st < 350) {
				if (navbar.hasClass('awake')) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if (sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();


	contentWayPoint = function () {
		var i = 0;
		$('.ftco-animate').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .ftco-animate.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						}, k * 50, 'easeInOutExpo');
					});

				}, 100);

			}

		}, { offset: '95%' });
	};
	contentWayPoint();


})(jQuery);



// =============== COMMON FUNCTION =============== 

	function setWithExpiry(key, value, ttl) {
		const now = new Date()

		// `item` is an object which contains the original value
		// as well as the time when it's supposed to expire
		const item = {
			value: value,
			expiry: now.getTime() + ttl
		}
		localStorage.setItem(key, JSON.stringify(item))
	}

	function getWithExpiry(key) {
		const itemStr = localStorage.getItem(key)

		// if the item doesn't exist, return null
		if (!itemStr) {
			return null
		}

		const item = JSON.parse(itemStr)
		const now = new Date()

		// compare the expiry time of the item with the current time
		if (now.getTime() > item.expiry) {
			// If the item is expired, delete the item from storage
			// and return null
			localStorage.removeItem(key)
			return null
		}
		return item.value
	}

	function encodeQueryData(data) {
		const ret = [];
		for (let d in data)
		  ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
		return ret.join('&');
	 }
	
	const buildURLParams = (url, params) => `${url}?${encodeQueryData(params)}`




// ===============  CONSTANTS =============== 

	const API = '/api/v1'
	// const API = 'https://horriblesubs-community.herokuapp.com/api/v1'
	// const API = 'http://localhost:9002/api/v1'



// ===============  ENDPOINTS =============== 

	const subscribeNotificationAPI = (subscription) => fetch(`${API}/notification/subscribe`,
		{
			method: 'POST',
			body: JSON.stringify(subscription),
			headers: { 'content-type': 'application/json' }
		}
	)
	.catch(err => console.error('Erro ao cadastrar notificação push', err))



	const upVoteAPI = (suggestionId) => fetch(`${API}/suggestion/upvote/${suggestionId}`, 
		{ 
			method: 'PUT', 
			headers: { 'Content-Type': 'application/json' } 
		}
	).catch(err => console.error('Erro ao votar (upVote) sugestão de legenda', err))



	const downVoteAPI = (suggestionId) => fetch(`${API}/suggestion/downvote/${suggestionId}`, 
		{ 
			method: 'PUT', 
			headers: { 'Content-Type': 'application/json' } 
		}
	)
	.catch(err => console.error('Erro ao votar (downVote) sugestão de legenda', err))



	const getDialoguesToSuggestionAPI = (params) => fetch(buildURLParams(`${API}/suggestion`, params),
		{ 
			method: 'GET', 
			headers: { 'Content-Type': 'application/json' } 
		}
	)
	.then(data => data.json())
	.catch(err => console.error('Erro ao buscar dialogos para sugestão', err))



	const sendNewSuggestionAPI = (id, body) => fetch(`${API}/suggestion/${id}`, 
        { 
			method: 'PUT', 
			body: JSON.stringify(body), 
			headers: { 'Content-Type': 'application/json' }
		}
	)
	.catch(err => console.error('Erro ao enviar nova sugestão', err))
	


	const getLastTitlesReleasedAPI = (params) => fetch(buildURLParams(`${API}/subtitle/titles`, params),
		{ 
			method: 'GET', 
			headers: { 'Content-Type': 'application/json' } 
		}
	)
	.then(data => data.json())
	.catch(err => console.error('Erro ao buscar titulos', err))



	const getDialoguesSuggestionToEvaluateAPI = (params) => fetch(buildURLParams(`${API}/suggestion/evaluate`, params),
		{ 
			method: 'GET', 
			headers: { 'Content-Type': 'application/json' } 
		}
	)
	.then(data => data.json())
	.catch(err => console.error('Erro ao buscar sugestão para avaliar', err))
