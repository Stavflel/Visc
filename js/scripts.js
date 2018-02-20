jQuery('[id^=infoModal-]').on('click',function(){
    var title = $(this).data('title');
    var info = $(this).data('info');
    var img = $(this).data('img');

    $("#title").html( title );
    $("#info").html( info );
    $(".modal-body #img").attr("src", img);
});

$(document).ready(function(){
    $(".links").click(function(){
        $("#sideBar").load($(this).attr("page")+".html");
    });
});

$(document).ready(function () {
    $(".item").click(function () {
        $("#totalPrice").fadeOut(function () {
            $("#totalPrice").text(
            	parseInt($("#totalPrice").text()) + parseInt($(".price").text())
            ).fadeIn();
        })
    })
});

$(document).ready(function () {
	var addclass = 'highlight';
	var $cols = $('.item').click(function(e) {
	    $cols.removeClass(addclass);
	    $(this).addClass(addclass);
	});
});

$(document).ready(function () {
	var addclass = 'highlight';
	var $cols = $('.colorItem').click(function(e) {
	    $cols.removeClass(addclass);
	    $(this).addClass(addclass);
	});
});

