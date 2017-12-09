const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  const query = {
    q: `${searchTerm}`,
    key: 'AIzaSyCM2MiOxeqWQySwERnltjfwC6NJc7p8gDU',
    part: 'snippet'
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderNumberOfResults(resultsNumber, perPageResults) {
    if (resultsNumber > 1) {
    return `
    <h3 aria-live="assertive">About ${resultsNumber} results total, displaying ${perPageResults} results.</h3>
    `;
  } else if (resultsNumber === 0) {
      return `
      <h2>We couldn't find that video!</h2>
      `;
  }
}

function renderResult(data) {
  const videoBaseUrl = 'https://www.youtube.com/watch?v=';
  const channelBaseUrl = 'https://www.youtube.com/channel/';
  const {title, thumbnailUrl, id, description, channelName, channelIdentity} = data;
  return `
  <div>
    <h2>
      <a href="${videoBaseUrl}${id}" videoId=${id} class="lightbox" aria-live="assertive">${title}</a>
    </h2>
    <a href="${videoBaseUrl}${id}" videoId=${id} class="lightbox">
      <img src = "${thumbnailUrl}" alt="Youtube thumbnail">
    </a>
    <h3>
      <a href="${channelBaseUrl}${channelIdentity}" >${channelName}</a>
    </h3>
      <p>${description}</p>
  </div>
  `;
}

function showLightBox() {
  $('.js-search-results').on('click', '.lightbox', function(event) {
  event.preventDefault();
  $('#ytplayer').remove();
  $('.page').addClass('blur');  
  let lightBoxVideo = $(event.currentTarget).attr('videoId');  
  $('.js-search-results').prop('hidden', true);
  $('.lightbox-video').append(`<iframe id="ytplayer" type="text/html" title="Youtube Video Lightbox" width="640" height="360" src="https://www.youtube.com/embed/${lightBoxVideo}" frameborder="0" class="iframe"></iframe>`);
  $('.exit-button').prop('hidden', false);
  }); 
}

function displayYouTubeSearchData(data) {
  // console.log(JSON.stringify(data, null, 2)); 
  let results = '';
  let items = data.items;
  let numberOfResults = data.pageInfo.totalResults;
  let resultsEachPage = data.pageInfo.resultsPerPage;

  // renders total results number and results per page to DOM
  let sum = renderNumberOfResults(numberOfResults, resultsEachPage);
  $('.search-results-number').html(sum).prop('hidden', false);

  // items is an array
  let current;
  for (let i = 0; i < items.length; i++) {
    current = items[i];
    const videoData = {
      title: current.snippet.title,
      thumbnailUrl: current.snippet.thumbnails.default.url,
      id: current.id.videoId,
      description: current.snippet.description,
      channelName: current.snippet.channelTitle,
      channelIdentity: current.snippet.channelId
    };
      results += renderResult(videoData);
  }
  $('.js-search-results').html(results).prop('hidden', false);
  showLightBox();
  handleExitVideoButton();
}

function handleExitVideoButton() {
  $('.exit-button').on('click', function(event) {
   event.preventDefault();
   $('.page').removeClass('blur');
   $('.exit-video').prop('hidden', true);
   $('#ytplayer').remove();
   $('.js-search-results').prop('hidden', false);
 });
}

function watchSubmit() {
  $('.page').removeClass('blur');
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(watchSubmit);