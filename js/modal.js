var modalBtn = $('a.open-modal'),
    modal = $('.modal'),
    close = $('.md-close'),
    overlay = $('.md-overlay');

modalBtn.on('click', function(){
    modal.addClass('md-show');
    overlay.addClass('show');
});

close.on('click', function(){
    modal.removeClass('md-show');
    overlay.removeClass('show');
});

overlay.on('click', function(){
    modal.removeClass('md-show');
    overlay.removeClass('show');
});