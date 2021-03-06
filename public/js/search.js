const searchApi = new apiHandler(
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/search/api/'
    : `${window.location.protocol}//${window.location.hostname}/search/api`
)

const showFilterButton = document.querySelector('#show-filter-button')
const filterButton = document.querySelector('#filter-button')
const cancelFilterButton = document.querySelector('#cancel-filter-button')
const closeButton = document.querySelector('#close-button')
const filterCard = document.querySelector('#filter-card')
const occupationsContainer = document.querySelector('#occupations-container')
const typeInput = document.querySelector('#type-input')

const ratingInput = document.querySelector('#rating')

const hideCard = () => {
  filterCard.classList.remove('is-active')
}

showFilterButton.onclick = () => {
  filterCard.classList.add('is-active')
}

cancelFilterButton.onclick = hideCard
closeButton.onclick = hideCard

filterButton.onclick = async () => {
  const rating = ratingInput.value
  const type = typeInput.value

  let occupations

  const query = `?rating=${rating}&occupation=${type}`

  try {
    const { data } = await searchApi.getList(query)
    occupations = data
  } catch (e) {
    console.log(e)
  }

  let template = ''

  occupations.forEach(({ userId, type, content, rating }) => {
    template += `
    <div class="column is-6">
      <div class="box">
      <article class="media">
        <div class="media-left is-flex is-align-centered">
          <figure class="avatar is-64x64">
            <img src="${userId.avatar}" alt="${userId.name}">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>${userId.name}</strong>
              <br>
              ${type}
              <br>
              ${rating}
              <span class="icon is-medium">
                <i class="fas fa-star"></i>
              </span>
              <br>
              ${content}
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a href="/user/emp/${userId._id}" class="level-item button is-info">
                View profile
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
    </div>
  `
  })

  occupationsContainer.innerHTML = `<div class="columns is-multiline">${template}</div>`
  window.history.pushState(
    {
      rating
    },
    'Search'
  )
  hideCard()
}
