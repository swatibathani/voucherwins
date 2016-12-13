$(window).scroll(function() {
if ($(this).scrollTop() > 1){  
    $('.nav_main').addClass("sticky");
  }
  else{
    $('.nav_main').removeClass("sticky");
  }
});
$.material.init();

$(document).ready(function(){
  $(".navbar-nav li").click(function(){
    $(".navbar-nav li").removeClass("active");
    $(this).addClass("active");
  });
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}
    $("#imgInp").change(function(){
        readURL(this);
    });
    $('#user_img').click(function(){
    	$("#imgInp").trigger('click');
    });


    