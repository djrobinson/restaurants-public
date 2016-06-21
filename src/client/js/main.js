// add scripts

$(document).on('ready', function() {
  console.log('sanity check!');
  $('.limitLength').each(function(item, i){
    var review = $(this);
    console.log(review.text());
    var fullReview = review.text();
    review.text(review.text().substring(0, 25));
    review.append("<a id='"+i+"'>...</a>");
    $(i).on("click", function(){
      review.text(fullReview);
    })
  });
});


$('.radios > option').each(function(){
  if ($('select').attr('id') === $(this).val()){
    console.log($(this).val());
    $(this).attr('selected', 'selected');
  }
})
