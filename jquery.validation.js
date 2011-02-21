(function($) {
$.fn.aq = function(options){};

/**
  * Popup
  **/
$.fn.aq.alert = function(params){
	if ($('#aq-alert').size() == 0){
		$('<div id="aq-alert"></div>').appendTo('body');
	}
	$('#aq-alert').hide();
	if (params.title == undefined) params.title = 'Alert';
	$('#aq-alert').html(params.message);
	$('#aq-alert').attr('title',params.title);
	$("#aq-alert" ).dialog({
		modal: true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
	});
};


/**
  * Form validation
  **/
$.fn.aq.validate = function(params){
        err = new Array();

        //Area to show message
        $('body').prepend('<div id="aq-validate-message"></div>');
        $('#aq-validate-message').hide();


        //Show and hide error message
        function showError(container, msg, code){
            if ($(container).children('.aq-validate-message').size() != 0){
                $(container).children('.aq-validate-message').remove();
            }

            $(container).append('<div class="aq-validate-message">'+msg+'</div>');
            e = $(container).children('.aq-validate-message');
            e.hide();
            var pos = $(container).children('input').offset();
            var width = $(container).children('input').width()+15;
            e.css({"left": (pos.left+width) + 'px', "top": pos.top + "px", "position": "absolute"});
            e.fadeIn();

            $(container).children('input').addClass('aq-validate-error');
            $(container).data('aq-error-'+code, 1);
        }

        function hideError(container, code){
            var e = 0;
            $(container).data('aq-error-'+code, 0);

            for (er in $(container).data()){
                if ($(container).data(er) == 1){
                    e = 1;
                }
            }
            if (e == 0){
                $(container).children('.aq-validate-message').fadeOut(300,function(){$(this).remove()});
                $(container).children('input').removeClass('aq-validate-error');
            }
        }


        //Required
        $('*[required], .aq-validate-required').live('blur',function(){
            if ($(this).val() == ''){
                showError($(this).parent(), 'A value is required', 'required');
            } else {
                hideError($(this).parent(), 'required');
            }
        });


        //Max length
        $('*[maxlength]').live('blur',function(){
            if ($(this).val().length > $(this).attr('maxlength')){
                showError($(this).parent(), 'Value must be less than '+$(this).attr('maxlength')+' characters long', 'maxlength');
            } else {
                hideError($(this).parent(), 'maxlength');
            }
        });


        //http://xkcd.com/327/
        $('input[name=firstname]').live('blur',function(){
            if ($(this).val() == "Robert'); DROP TABLE Students;--"){
                showError($(this).parent(), 'Hi Bobby!');
            } else {
                hideError($(this).parent());
            }
        });


        //Check it's a number
        $('input[type=number], .aq-validate-number').live('blur',function(){
            if ($(this).val() != ''){
                if (isNaN($(this).val()) || ( $(this).attr('max') && $(this).val() > $(this).attr('max') ) || ( $(this).attr('min') && $(this).val() < $(this).attr('min') ) ){
                    var em = 'Value must be a valid number';
                    if ($(this).attr('min')) em += ' more than '+$(this).attr('min');
                    if ($(this).attr('max') && $(this).attr('min')) em += ' and';
                    if ($(this).attr('max')) em += ' less than '+$(this).attr('max');

                    showError($(this).parent(), em, 'number');
                } else {
                    hideError($(this).parent(), 'number');
                }
            }
        });


        //Email validation - regexp from http://www.regular-expressions.info/email.html
        $('input[type=email], .aq-validate-email').live('blur',function(){
            re = new RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,4}');
            if (!$(this).val().match(re)){
                showError($(this).parent(), 'Value must be a valid email address', 'email');
            } else {
                hideError($(this).parent(), 'email');
            }
        });


        //Website
        $('.aq-validate-website').live('blur',function(){
            if ($(this).val().substr(0,7) != 'http://' && $(this).val().substr(0,8) != 'https://'){
                showError($(this).parent(), 'Value must be a valid website address', 'website');
            } else {
                hideError($(this).parent(), 'website');
            }
        });

        //Pattern validation
        $('*[pattern]').live('blur',function(){
            re = new RegExp($(this).attr('pattern'));
            if (!$(this).val().match(re)){
                showError($(this).parent(), 'Value must match pattern provided', 'pattern');
            } else {
                hideError($(this).parent(), 'pattern');
            }
        });


        //Password matching
        $('.aq-validate-passwordmatch').live('blur',function(){
            if ($(this).attr('id').substr(-8) == '-confirm'){
                //Password confirm
                if ($(this).val() != $(this).parent().prev().children('input').val() && $(this).parent().prev().children('input').val() != '' && $(this).val() != ''){
                    showError($(this).parent(), 'Passwords must match', 'passwordmatch');
                    showError($(this).parent().prev(), 'Passwords must match', 'passwordmatch');
                } else {
                    hideError($(this).parent(), 'passwordmatch');
                    hideError($(this).parent().prev(), 'passwordmatch');
                }
            } else {
                //Password
                if ($(this).val() != $(this).parent().next().children('input').val() && $(this).parent().next().children('input').val() != '' && $(this).val() != ''){
                    showError($(this).parent(), 'Passwords must match', 'passwordmatch');
                    showError($(this).parent().next(), 'Passwords must match', 'passwordmatch');
                } else {
                    hideError($(this).parent(), 'passwordmatch');
                    hideError($(this).parent().next(), 'passwordmatch');
                }
            }
        });


        $('input[type=submit]').live('click', function(){
            $('input, select').blur();
            if ( $('.aq-validate-error').size() > 0) {
                $(document).aq.alert({'message':'There are errors that need to be corrected'});
                return false;
            }
        })
    };
})(jQuery);
