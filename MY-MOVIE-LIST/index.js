// 這裡定義了三個常數，分別是基本的 URL、電影資料的索引 URL、以及海報圖片的 URL。
const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 這裡定義了一個空陣列 movies，用於存儲從 API 獲取的電影資料。
const movies = []
let filteredMovies = []


const MOVIES_PER_PAGE = 12

// 這些是選取 HTML 文件中特定元素的變數，分別是資料面板（用於顯示電影清單的區域）、搜尋表單和搜尋輸入框。
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


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
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>`
  });
  dataPanel.innerHTML = rawHTML
}


function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies

  //計算起始index
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作template
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML +=   `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回html
paginator.innerHTML = rawHTML
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

// 這是一個函式 addToFavorite，用於將電影加入到收藏清單中。
// addToFavorite 函式用於將電影加入到收藏清單中。它接收一個 id 參數，代表要加入收藏的電影的 ID。在函式內部，首先定義了一個內部函式 isMovieIdMatches，該函式用於比較傳入的 movie 物件的 ID 是否與傳入的 id 參數相匹配。
// 然後，它使用 localStorage 來獲取之前儲存在瀏覽器中的收藏清單（如果有的話），並將其解析為陣列 list。接著，使用 movies.find 方法來找到與傳入的 id 參數相匹配的電影，並將其賦值給變數 movie。
// 接下來，它使用 list.some 方法來檢查 list 陣列中是否已經存在與傳入的 id 相同的電影。如果是，則顯示警告訊息並返回。如果不是，則將 movie 加入到 list 陣列中，並使用 localStorage 將更新後的收藏清單儲存回瀏覽器。

function addToFavorite(id) {
  function isMovieIdMatches(movie) {
    return movie.id === id
  }
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
 
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  console.log(list);
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 這是一個事件監聽器，監聽資料面板的點擊事件。當點擊事件發生時，首先使用 event.target.matches 方法檢查點擊的元素是否符合特定的 CSS 選擇器。如果點擊的元素具有 .btn-show-movie 類別，則調用 showMovieModal 函式並傳遞相應的電影 ID。
// 如果點擊的元素具有 .btn-add-favorite 類別，則調用 addToFavorite 函式並傳遞相應的電影 ID。
// 這樣，當點擊的元素是「More」按鈕時，會調用 showMovieModal 函式來顯示相應電影的詳細資訊模態框。
// 如果點擊的元素是「+」按鈕，則調用 addToFavorite 函式來將相應的電影加入到收藏清單中。
// 這個事件監聽器使得當使用者點擊「More」或「+」按鈕時，能夠觸發對應的操作。

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
      showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }


})      

// 這是一個事件監聽器，當搜尋表單提交時，會執行對應的函式。
// event.preventDefault()：這行程式碼用於阻止表單的預設提交行為，即阻止頁面重新載入。
// const keyword = searchInput.value.trim().toLowerCase()：這行程式碼將取得搜尋輸入框（searchInput）的值並進行修整。它會移除前後空格並將值轉換為小寫，以便進行比對。
// let filteredMovies = []：這行程式碼宣告一個空陣列 filteredMovies，用於儲存符合搜尋關鍵字的電影。
// filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))：這行程式碼使用 filter 方法來過濾 movies 陣列中的電影。它會檢查每個電影的標題（title）是否包含搜尋關鍵字，並將符合條件的電影放入 filteredMovies 陣列中。
// if (filteredMovies.length === 0) { ... }：這個條件判斷式檢查 filteredMovies 陣列的長度是否為 0。如果是，表示找不到符合搜尋關鍵字的電影，會顯示警告訊息並終止函式執行。
// renderMovieList(filteredMovies)：這行程式碼呼叫 renderMovieList 函式並傳遞 filteredMovies 陣列作為參數。這將會根據過濾後的電影資料重新渲染電影清單。
// 這個事件監聽器使得當使用者提交搜尋表單時，會根據輸入的關鍵字過濾電影資料並重新渲染電影清單。

paginator.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
 
  // if (!keyword.length) {
  //   return alert('Please enter a valid string')
  // }

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword:  ' , keyword)
  }

  // 迴圈方式
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

// 這是使用 Axios 庫發送 GET 請求來獲取電影資料，並根據回應執行對應的回調函式。
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))