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

function renderResult(title, thumbnailUrl, id, vidDescription, channel, channelId) {
  const videoBaseUrl = 'https://www.youtube.com/watch?v=';
  const channelBaseUrl = 'https://www.youtube.com/channel/';
  return `
  <div>
    <h2>
      <a href="${videoBaseUrl}${id}" videoId=${id} class="lightbox" aria-live="assertive">${title}</a>
    </h2>
    <h3>
      <a href="${channelBaseUrl}${channelId}" >${channel}</a>
    </h3>
      <a href="${videoBaseUrl}${id}" videoId=${id} class="lightbox">
        <img src = "${thumbnailUrl}" alt="Youtube thumbnail">
      </a>
      <p>${vidDescription}</p>
  </div>
  `;
}

function showLightBox() {
  $('.js-search-results').on('click', '.lightbox', function(event) {
  $('#ytplayer').remove();
  $('.page').addClass('blur');  
  let lightBoxVideo = $(event.currentTarget).attr('videoId');  
  $('.js-search-results').prop('hidden', true);
  $('.lightbox-video').append(`<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/${lightBoxVideo}" frameborder="0" class="iframe"></iframe>`);
  $('.exit-video').prop('hidden', false);
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
  for (let i = 0; i < items.length; i++) {
    let videoTitle = items[i].snippet.title;
    let videoThumbnail = items[i].snippet.thumbnails.default.url;
    let videoId = items[i].id.videoId;
    let videoDescription = items[i].snippet.description;
    let channelName = items[i].snippet.channelTitle;
    let channelIdentity = items[i].snippet.channelId;
    results += renderResult(videoTitle, videoThumbnail, videoId, videoDescription, channelName, channelIdentity);
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