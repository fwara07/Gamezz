"use strict";

import { ITEMS } from "../../constants/items.js";

/* ====================================================================
   SECTION: CONTANTS
==================================================================== */

// image lazy load threshold
const IMG_THRESHOLD = 0.1;
const INFO_THRESHOLD = 0.6;
const INFO_THRESHOLD_MIN = 0;
const INFO_THRESHOLDS_MAX = 1;
// star rating constants
const MIN_STARS = 0;
const MAX_STARS = 5;

/* ====================================================================
   SECTION: MAIN LOGIC
==================================================================== */

// the shop element that everything will be inside
const $myShop = $("#shop");

ITEMS.forEach((item) => {
  // Section for the item
  const $section = $("<section>").addClass("item").attr("id", item.id);
  // Grid div to hold the left (title + desc), middle (image), right (price + stars + button)
  const $grid = $("<div>").addClass("product-grid");

  // left side
  const $left = $("<div>").addClass("info-left");
  // title
  const $title = $("<h2>").addClass("item-title").text(item.title);
  // description
  const $desc = $("<p>").addClass("item-desc").text(item.description);
  // add the title and description to the left side
  $left.append($title, $desc)

  // middle side
  const $mid = $("<div>").addClass("item-image-wrap");
  // create the image element
  const $img = $("<img>").addClass("item-image").attr("alt", item.title).attr("data-src", item.image);
  // add the image to the middle side
  $mid.append($img);

  // right side
  const $right = $("<div>").addClass("info-right");
  // price
  const $price = $("<p>").addClass("item-price").text("$" + formatPrice(item.price));
  // row for the rating stars and count
  const $ratingRow = $("<div>").addClass("rating-row");
  // create the star element
  const $stars = $("<span>").addClass("stars").text(makeStars(item.rating.rate));
  // create the count element
  const $count = $("<span>").addClass("count").text("(" + (item.rating.count || 0) + ")");
  // add stars and count to the rating row
  $ratingRow.append($stars).append($count);
  // purchase button
  const $btn = $("<button>").addClass("purchase-btn").text("Purchase");
  // event handler for purchase button
  $btn.on("click", () => purchase(item));
  // add price, rating row, and button to the right side
  $right.append($price, $ratingRow, $btn)

  // Add the left, middle, and right sides to the grid
  $grid.append($left, $mid, $right)
  // add the grid to the section
  $section.append($grid);
  // add the section to the shop
  $myShop.append($section);
});

const imgObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      // check if the image is time to load
      if (entry.isIntersecting) {
        const img = entry.target;
        // the goal is to only set the src attribute
        // if it is time to lazy load it
        const $imgEl = $(img);
        // we store the actual src in a data-src attribute
        // since data-src does not make the image load
        const src = $imgEl.attr("data-src");
        // only set the src if it is not already set
        if (src && !$imgEl.attr("src")) {
          $imgEl.attr("src", src);
        }
        // we don't need to observe this image anymore
        obs.unobserve(img);
      }
    });
  },
  { threshold: IMG_THRESHOLD }
);

// observe all images for lazy loading
$(".item-image").each((_, img) => {
  imgObserver.observe(img);
});

// observe all item sections for info display
const infoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // check if the image is time to load
      if (entry.isIntersecting) {
        // get the section
        const section = $(entry.target);
        // if the info div exists
        if (section) {
          // if it is time to show the info div
          // AND the intersection ratio is above the threshold
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= INFO_THRESHOLD
          ) {
            //show the info div
            section.addClass("visible");
          } else {
            // hide the info div
            section.removeClass("visisble");
          }
        }
      }
    });
  },
  { threshold: [INFO_THRESHOLD_MIN, INFO_THRESHOLD, INFO_THRESHOLDS_MAX] }
);

// observe all item sections for lazy loading
$(".item").each((_, section) => {
  infoObserver.observe(section);
});

/* ====================================================================
   SECTION: HELPER FUNCTIONS
==================================================================== */

function formatPrice(value) {
  // convert the string to a number
  const priceNum = Number(value);
  // if the string was not a valid number
  if (Number.isNaN(priceNum)) {
    // just return 0.00
    return "0.00";
  }
  // return the number formatted to 2 decimal places
  return priceNum.toFixed(2);
}

function makeStars(rating) {
  // Return a 5-star string like "★★★★☆"
  console.log(rating)
  // Convert rating to number
  let ratingNum = Number(rating);
  // if the rating is not a valid number
  if (Number.isNaN(ratingNum)) {
    // return 0 stars
    ratingNum = 0;
  }
  // if the rating is smaller than 0
  if (ratingNum < 0) {
    // set it to 0
    ratingNum = 0;
  }
  // if the rating is larger than 5
  if (ratingNum > 5) {
    // set it to 5
    ratingNum = 5;
  }

  // Since I don't qite want to deal with half stars,
  // round to the nearest integer
  const filledStars = Math.round(ratingNum);
  // build the star string
  let stars = "";
  console.log(filledStars);

  // for each star position
  for (let i = MIN_STARS; i < MAX_STARS; i++) {
    // if this star should be filled
    if (i < filledStars) {
      // add a filled star emoji
      stars += "★";
    } else {
      // add an empty star emoji
      stars += "☆";
    }
  }
  // return the star string
  return stars;
}

function purchase(item) {
    // just alert the user what they purchased for now
    alert("Purchased: " + item.title + " for $" + formatPrice(item.price));
}
