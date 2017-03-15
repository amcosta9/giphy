// array of buttons already set on page load
var categories = ["Big Bang Theory", "Modern Family", "SNL", "Scrubs", "How I Met Your Mother", "Superstore", "That 70s Show", "Fresh Prince of Bel Air", "Surprise Me"];
// public Giphy API key
var key = "dc6zaTOxFJmzC";
var queryUrl;
var surpriseClicked = false;
// function triggered on button click
function displayGif() {
    // variable (search term) set by name of button pushed
    var category = $(this).attr("data-name");
    var plusCategory = category.split(' ').join('+');
    //random number
    var rando = Math.floor(Math.random() * (100 - 2)) + 2;
    if (plusCategory == "Surprise+Me") {
        surpriseClicked = true;
        $("#gif-view").empty();
            queryUrl = "https://api.giphy.com/v1/gifs/random?api_key=" + key;
            console.log(queryUrl);
            pushGifs();
    } else {
        // building query url using category var and key
        queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + plusCategory + "&limit=10&api_key=" + key + "&offset=" + rando;
        console.log(queryUrl);
        $("#gif-view").empty();
        pushGifs();
    };
}; // end displayGif function

function pushGifs(){

    // ajax call
    $.ajax({
        url: queryUrl,
        method: "GET"
        // waits for response to load
    }).done(function (response) {
        // variable results holds beginning of object path
        var results = response.data;
        console.log(results);
        var rating,
            stillImage,
            gifImage,
            displayDiv;
        if (surpriseClicked) {
            // creates new div for each result
            displayDiv = $("<div>");
                // variable to hold rating
                rating = results.rating;
                // variable to hold still image
                stillImage = results.fixed_height_small_still_url;
                // variable to hold gif
                gifImage = results.image_url;
                displayDiv.attr("id", "display").addClass("well");
                turtle();
        } else {
            // creates new div for each result
                displayDiv = $("<div>");
            // loops through results
            for (var i = 0; i < results.length; i++) {
                // variable to hold rating
                rating = results[i].rating;
                // variable to hold still image
                stillImage = results[i].images.fixed_height_still.url;
                // variable to hold gif
                gifImage = results[i].images.fixed_height.url;
                displayDiv.attr("id", "display" + i).addClass("well");
                turtle();
            }; // end for loop
        }; // end else statement
        // function to append results to page
        function turtle() {
            // creates image tag
            var img = $("<img>");
            // assigns still image as img src
            img.attr("src", stillImage);
            img.data("state", {still: stillImage, gif: gifImage});
            img.addClass("img-rounded img-responsive");

            if (typeof(rating) != "undefined") {
            // displays rating to div
            $(displayDiv).append("<p>Rating: " + rating + "</p>");
            };
            // adds image
            $(displayDiv).append(img);
            // puts each new result above the one previous (appends to the top of the page)
            $("#gif-view").append(displayDiv);
        };

            surpriseClicked = false;

        // if user clicks gif, switch img.attr("src", stillImage); to img.attr("src", gifImage);
        $("img").on("click", function () {
            // var holds the src of button clicked
            var type = $(this).attr('src');
            // var holds still state data attr of button clicked
            var stillState = $(this).data("state").still;
            // var holds gif state data attr of button clicked
            var gifState = $(this).data("state").gif;
            if (type == stillState) {
                $(this).attr("src", gifState);
                }
                else {
                $(this).attr("src", stillState);
            }// end if statement
            }); // end img on click function

    }); // end .done function

} // end pushGifs()




// function to render buttons to page
function renderButtons() {
    // empty #buttons-view div each time and re-add all items in categories array
    $("#buttons-view").empty();
    // for loop through each string in categories array
    for (var i = 0; i < categories.length; i++) {
        // assigns var a to button element
        var a = $("<button>");
        // adds class .category
        a.addClass("category btn btn-default");
        // adds data-name as attribute to match each category
        a.attr("data-name", categories[i]);
        // adds text to the button
        a.text(categories[i]);
        // adds button to the #buttons-view div
        $("#buttons-view").append(a);
    } // end for loop
} // end renderButtons function

// function runs when submit button is clicked
$("#add-category").on("click", function(event){
    // prevents page reload on button click
    event.preventDefault();
    // assigns user input to var input
    var input = $("#category-input").val().trim();
    // if nothing input, alert user to type something
    if (input == ""){
        alert("Type something! Anything!");
        // return;
    } else {
    // pushes user input to categories array
    categories.push(input);
    $("#category-input").val(" ");
    // call renderButtons function
    renderButtons();
    }

}); // end click function









// event listener to document for click on buttons to displayGif function
$(document).on("click", ".category", displayGif);

// initial function call on page load to render buttons from categories array
renderButtons();
