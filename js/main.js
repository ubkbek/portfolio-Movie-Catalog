// Select elements from DOM
var elList = document.querySelector("#movie_list");
var elBookmarkedList = document.querySelector("#bookmarks-wrapper");
var elMovieModal = document.querySelector(".movie-modal");
var elAlert = document.querySelector("#alert");
var elForm = document.querySelector("#form");
var elInputValue = document.querySelector("#input");
var elRating = document.querySelector("#movie-rating");
var elSort = document.querySelector("#rating_sort");
var elCategorySelect = document.querySelector("#category-select");
var elTempaleCard = document.querySelector("#template-card").content;
var elTempaleCard = document.querySelector("#template-card").content;
var elBookmarkTemplate = document.querySelector("#bookmarkTemplate").content;



// Get sliced movies
let slicedMovies = movies.slice();    //movies arraydan bir qismini kesib ol



// get Normolized movies - arrayni biz xohlagan chiroyli, qulay ko'rinishga olib keladi.
var normolizedMovieList = slicedMovies.map((movieItem, index) => {
    return {
        id: ++index,
        title: movieItem.Title.toString(),
        summary: movieItem.summary,
        categories: movieItem.Categories,
        rating: movieItem.imdb_rating,
        year: movieItem.movie_year,
        imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`,
        info: movieItem.summary
    }
})


//boshida bitta rneder qiladi shunda hali search qilinmasdan avval bitta render bolib kesilgan hamma kinola chiqib turadi.
renderMovies(normolizedMovieList, elList);




// generate categories - kesilgan kinoni icidan bor categoriyalarni hammasini categories selectga render qilib beradi.
function generateCategories(movieArray){
    let categoryList = [];

    movieArray.forEach(item => {
        var splittedCategories = item.categories.split("|");
        splittedCategories.forEach(item => {
            if(!categoryList.includes(item)) categoryList.push(item)
        })
    })

    categoryList.sort();

    let categoryFragment = document.createDocumentFragment();

    categoryList.forEach(function(item){
        let categoryOption = document.createElement("option");
        categoryOption.value = item;
        categoryOption.textContent = item;
        categoryFragment.appendChild(categoryOption)
    })

    elCategorySelect.appendChild(categoryFragment)
}

generateCategories(normolizedMovieList)   //generateCategories() ni ishga tushuradi.




// create render function
function renderMovies(array, place){
    place.innerHTML = null;

    let elFragment = document.createDocumentFragment()

    array.forEach(item => {
        let newDiv = elTempaleCard.cloneNode(true);

        newDiv.querySelector("#card-img").src = item.imageLink;
        newDiv.querySelector(".card-title").textContent = item.title;
        newDiv.querySelector(".movie-category").textContent = item.categories.split("|").join(", ");
        newDiv.querySelector(".movie-year").textContent = item.year;
        newDiv.querySelector(".movie-rating").textContent = item.rating;
        newDiv.querySelector(".movie-youtube-link").href = item.youtubeLink;
        newDiv.querySelector(".movie-youtube-linkk").href = item.youtubeLink;
        newDiv.querySelector(".modal-open-btn").dataset.movieIdForModal = item.id;
        newDiv.querySelector(".bookmark-btn").dataset.movieItemId = item.id;

        elFragment.appendChild(newDiv);
    });

    place.appendChild(elFragment)
    let lengthOfMovies = array.length
    // elSearchResultNum.textContent = lengthOfMovies

    if(lengthOfMovies === 0){
        elAlert.textContent = "Not Found"
        elAlert.classList.add("alert-danger");
    }
    else{
        elAlert.textContent = `Search result: ${lengthOfMovies}`
        elAlert.classList.remove("alert-danger");
    }
}



// event submit
elForm.addEventListener("input", function(evt){
    evt.preventDefault();

    let searchInput = elInputValue.value.trim();
    let ratingInput = elRating.value.trim();
    let selectOption = elCategorySelect.value;
    let sortingType = elSort.value;

    let pattern = new RegExp(searchInput, "gi")

    let resultArray = findMovies(pattern, ratingInput, selectOption)

    if(sortingType === "heigh"){
        resultArray.sort(function(b, a){
            return a.rating - b.rating
        })
    }

    if(sortingType === "low"){
        resultArray.sort(function(a, b){
            return a.rating - b.rating
        })
    }

    renderMovies(resultArray, elList)
})





// find movies function
var findMovies = function(movie_title, minRating, genre){

    return normolizedMovieList.filter(function(movie){
        var doesMatchCategory = genre === "All" || movie.categories.split("|").includes(genre);

        return movie.title.match(movie_title) && movie.rating >= minRating && doesMatchCategory;
    })
}


// local storage

let storage = window.localStorage;

let bookmarkedMovies = JSON.parse(storage.getItem("movieArray")) || []





// add bookmarks
elList.addEventListener("click", function(evt){
    let movieID = evt.target.dataset.movieItemId;

    if(movieID){
        let foundMovie = normolizedMovieList.find(item => item.id == movieID)

        let doesInclude = bookmarkedMovies.findIndex(item => item.id === foundMovie.id)

        if(doesInclude === -1){
            bookmarkedMovies.push(foundMovie)

            storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))

            renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
        }
    }
})





// render bookMarked movies
function renderBookmarkedMovies(array, wrapper){
    wrapper.innerHTML = null //clear wrapper

    let elFragment = document.createDocumentFragment();

    array.forEach(function(item){
        let templateBookmark = elBookmarkTemplate.cloneNode(true)

        templateBookmark.querySelector(".movie-title").textContent = item.title;
        templateBookmark.querySelector(".btn-remove").dataset.markedId = item.id;

        elFragment.appendChild(templateBookmark)
    })

    wrapper.appendChild(elFragment)

}

renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)




// remove bookmarks
elBookmarkedList.addEventListener("click", function(evt){
    let removedMovieId = evt.target.dataset.markedId;

    indexOfMovie = bookmarkedMovies.findIndex(function(item){
        return item.id == removedMovieId
    })

    bookmarkedMovies.splice(indexOfMovie, 1)

    storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))

    renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
})




elList.addEventListener("click", function(evt){
    let moreInfoBtn = evt.target.dataset.movieIdForModal
    console.log(moreInfoBtn);

    if(moreInfoBtn){
        let findMovie = normolizedMovieList.find(item => item.id == moreInfoBtn)
        console.log(findMovie);
         elMovieModal.querySelector(".movie-modal-heading").textContent = findMovie.title
         elMovieModal.querySelector(".movie-modal-text").textContent = findMovie.summary
    }


})