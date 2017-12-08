const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  const query = {
    q: `${searchTerm}`,
    key: 'AIzaSyCM2MiOxeqWQySwERnltjfwC6NJc7p8gDU',
    part: 'snippet'
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
    // .fail(showError);
}

// function showError(err) {
//     const outputElem = $('.js-search-results');
//     // const {status} = err;
//     // console.log(err);

//     let errMsg = `We couldn't find that video!`;
    
//     const errorMessage = `<p>${errMsg}</p>`;

//     outputElem
//         .empty()
//         .append(errorMessage);
// }

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
      <a href="${videoBaseUrl}${id}" aria-live="assertive">${title}</a>
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
  let resultsEachPage = data.pageInfo.resultsPerPage;
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

  let sum = renderNumberOfResults(numberOfResults, resultsEachPage);
  $('.search-results-number').html(sum).prop('hidden', false);
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