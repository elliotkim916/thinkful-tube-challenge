const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  const query = {
    q: `${searchTerm}`,
    key: 'AIzaSyCM2MiOxeqWQySwERnltjfwC6NJc7p8gDU',
    part: 'snippet'
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderNumberOfResults(resultsNumber) {
    return `
    <h3>About ${resultsNumber} results</h3>
    `;
  }

function renderResult(title, thumbnailUrl, id, vidDescription, channel, channelId) {
  const videoBaseUrl = 'https://www.youtube.com/watch?v=';
  const channelBaseUrl = 'https://www.youtube.com/channel/';
  return `
  <div>
    <h2>
      <a href="${videoBaseUrl}${id}" >${title}</a>
    </h2>
    <h3>
      <a href="${channelBaseUrl}${channelId}" >${channel}</a>
    </h3>
      <a href="${videoBaseUrl}${id}">
        <img src = "${thumbnailUrl}" alt="Youtube thumbnail" class="youtube-thumbnail">
      </a>
      <p>${vidDescription}</p>
  </div>
  `;
}

function displayYouTubeSearchData(data) {
  console.log(JSON.stringify(data, null, 2)); 
  let results = '';
  let items = data.items;
  let numberOfResults = data.pageInfo.totalResults;
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
  $('.js-search-results').html(results);

  let sum = renderNumberOfResults(numberOfResults);
  $('.search-results-number').html(sum);
}

function watchSubmit() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(watchSubmit);