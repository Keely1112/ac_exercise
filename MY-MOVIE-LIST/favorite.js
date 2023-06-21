// 這裡定義了三個常數，分別是基本的 URL、電影資料的索引 URL、以及海報圖片的 URL。
const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 這裡定義了一個空陣列 movies，用於存儲從 API 獲取的電影資料。
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

// 這些是選取 HTML 文件中特定元素的變數，分別是資料面板（用於顯示電影清單的區域）、搜尋表單和搜尋輸入框。
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// 這是一個函式 renderMovieList，用於根據電影資料呈現電影清單的 HTML 內容。

// 這個函式的目的是根據傳入的 movies 資料，生成對應的 HTML 內容來呈現電影清單。它使用 forEach 迴圈遍歷 movies 陣列中的每個元素，然後根據每個電影的屬性（例如 title 和 image）來動態生成相對應的 HTML。最後，將生成的 HTML 內容設定為 dataPanel 元素的內容。

function renderMovieList(movies) {
  let rawHTML = ''

  movies.forEach(item => {
    //title, image
    
    rawHTML += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
              </div>
            </div>
          </div>
        </div>`
  });
  dataPanel.innerHTML = rawHTML
}

// 這是一個函式 showMovieModal，用於顯示電影的詳細資訊（模態框）。
// 這個函式用於顯示電影的詳細資訊模態框。它接收一個 id 參數，該參數代表要顯示詳細資訊的電影的 ID。在函式內部，它使用 axios 來向 API 發送 GET 請求，獲取該電影的詳細資訊。在成功獲取資料後，它會將資料中的相關屬性（如 title、release_date、description 和 image）設定為模態框中對應的 HTML 元素的內容，以便顯示該電影的詳細資訊

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML =  `<img
                  src="${POSTER_URL + data.image}"
                  alt="movie-poster"
                  class="img-fluid"
                />`

  })
}

function removeFromFavorite(id) {
  if (!movies || !movies.length) return

  const movieIndex = movies.findIndex((movie) => movie.id === id) 
   if(movieIndex === -1) return

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  renderMovieList(movies)
}



dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(Number(event.target.dataset.id))
  }


})      

renderMovieList(movies)