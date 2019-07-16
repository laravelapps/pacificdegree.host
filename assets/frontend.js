jQuery(document).ready(function($) {
    var post_url = '';
    var response = '';
    $('.helpful-block-content a').click(function(event) {
        event.preventDefault();
        post_url = $(this).data('post-url');
        var post_id = $(this).data('post');
        var post_title = $(this).data('post-title');
        response = $(this).data('response');
        var show_positive_message = false;
        var show_negative_message = false;
        var main = $(this).parent();
        main.find('.wth-title').remove();
        main.find('.wth-message').remove();
        main.find('.wth-submit').remove();

        var title_message = '';
        if (wth_js_lang.positive_feedback == 'true') {
            show_positive_message = true;
            title_message = wth_js_lang.wth_title_yesthank;
        }
        if (wth_js_lang.negative_feedback == 'true') {
            show_negative_message = true;
            title_message = wth_js_lang.wth_title_nothank;
        }

        if (response == '1') {
            title_message = wth_js_lang.wth_title_yesthank;
            main.find(".wth-red-btn").addClass('fc-disabled');
            wth_ga_event( wth_js_lang.wth_ga_positive, post_title );
        } else if (response == '0') {
            title_message = wth_js_lang.wth_title_nothank;
            main.find(".wth-green-btn").addClass('fc-disabled');
            wth_ga_event( wth_js_lang.wth_ga_negative, post_title );
        }
        if((show_positive_message == true && response == '1')){
            if (main.find(".wth-share-box").length > 0) { return; }
            if(wth_js_lang.positive_feedback_option == 'feedback_share'){
                var facebook_button = ' <a class="wth-fb-share-button wth-share" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u='+post_url+'">'+wth_js_lang.wth_fb_share+'</a> ';
                var tweeter_button = ' <a class="wth-tweeter-share-button wth-share" href="#">'+wth_js_lang.wth_twitter_share+'</a> ';
                var wth_share_title = '<span class="wth-share-title">'+wth_js_lang.wth_share_ask+' </span>';
                var wth_share_box = $('<div class="wth-share-box"> '+ wth_share_title + facebook_button + tweeter_button +'</div>');
                main.append(wth_share_box);
                wth_pre_send_feedback($(this), show_positive_message, show_negative_message);
            }else{
                var title_box = $('<div class="wth-title">' + title_message + '</div>');
                var mess_box = $('<textarea class="wth-message" rows="3" cols="30"></textarea>');
                var negative_btn = $('<input data-response="' + response + '" data-post="' + post_id + '" type="button" name="wth-submit" class="wth-submit" value="' + wth_js_lang.submit_text + '"/>');
                main.append(title_box);
                main.append(mess_box);
                main.append(negative_btn);
                if( wth_js_lang.positive_feedback_required != 'true'){
                    wth_pre_send_feedback($(this), show_positive_message, show_negative_message);
                }
            }
            
        }else if((show_negative_message == true && response == '0') ){
            var title_box = $('<div class="wth-title">' + title_message + '</div>');
            var mess_box = $('<textarea class="wth-message" rows="3" cols="30"></textarea>');
            var negative_btn = $('<input data-response="' + response + '" data-post="' + post_id + '" type="button" name="wth-submit" class="wth-submit" value="' + wth_js_lang.submit_text + '"/>');
            main.append(title_box);
            main.append(mess_box);
            main.append(negative_btn);
            if( wth_js_lang.negative_feedback_required != 'true'){
                wth_pre_send_feedback($(this), show_positive_message, show_negative_message);
            }
        } else {
            wth_send_feedback($(this));
        }

    });

    function wth_send_feedback(obj) {
		
        var post_id = $(obj).data('post');
        var response = $(obj).data('response');
        var wth_feedback_id = $('#wth_feedback_id').val();
        var message = $(obj).parent().find('.wth-message').val();
        var title = $(obj).parent().parent().parent().data('title');
        var ajax_url = wth_js_lang.ajax_url;
        var data = {
            post_id: post_id,
            response: response,
            wth_feedback_id:  wth_feedback_id,
            message: message,
            title: title,
            action: 'wth_ajax_call',
            operation: 'wthp_log_feedback',
            nonce: wth_js_lang.nonce
        };
        var main = $(obj).parent();

        $.ajax({
            url: ajax_url,
            data: data,
            dataType: 'json',
            type: 'POST',
            beforeSend: function() {
                main.append('<div class="wth-loader"></div>');
            },
            complete: function() {
                //main.find('.wth_loader').remove(); 
            },
            success: function(resp) {
				
                elem = $('<p>').hide();
                if (resp.success == true) {
                    elem.addClass('wth-success');
                } else if (resp.error == true) {
                    elem.addClass('wth-error');
                }
                main.parent().html(elem);
                elem.html(resp.message).fadeIn(500);
            },
        });
    }

    function wth_pre_send_feedback(obj){
        var post_id = $(obj).data('post');
        var response = $(obj).data('response');
        var wth_feedback_id = $('#wth_feedback_id').val();
        var message = $(obj).parent().find('.wth-message').val();
        var title = $(obj).parent().parent().parent().data('title');
        var ajax_url = wth_js_lang.ajax_url;

        // if ( (response == '1' && wth_js_lang.positive_feedback_required == 'true') 
        //     || (response == '0' && wth_js_lang.negative_feedback_required == 'true') ) {
        //     return;
        // };

        var data = {
            post_id: post_id,
            response: response,
            message: message,
            title: title,
            action: 'wth_ajax_call',
            operation: 'wthp_log_feedback',
            nonce: wth_js_lang.nonce
        };
        var main = $(obj).parent();
        if ( ! wth_feedback_id ){
            $.ajax({
                url: ajax_url,
                data: data,
                dataType: 'json',
                type: 'POST',
                success: function(resp) {
                    wth_feedback_element = $('<input type="hidden" id="wth_feedback_id" name="wth_feedback_id" value="' + resp.id + '" />');
                    $(".wth-submit").before(wth_feedback_element);
                },
            });
        }
    }
    $('body').on('click', '.wth-submit', function(event) {
       
        event.preventDefault();
        if (
            ((response == '1' && wth_js_lang.positive_feedback_required == 'true') || (response == '0' && wth_js_lang.negative_feedback_required == 'true'))
                && !$.trim($(".wth-message").val())
            ) 
        {
            $(".wth-message").addClass('wth-feedback-error') ;
        }else{
			wth_send_feedback($(this));
        }

        // if (wth_js_lang.positive_feedback_required == 'true' && !$.trim($(".wth-message").val())) {
           
        // }else{
        //     wth_send_feedback($(this));
        // }
    });
     $('body').on('click','.wth-fb-share-button', function(){

       window.open(this.href,'targetWindow','toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250');
        ///var fbpopup = window.open("https://www.facebook.com/sharer/sharer.php?u="+post_url+"&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer", "pop", "width=600, height=400, scrollbars=no");
        return false;
    });
    $('body').on('click','.wth-tweeter-share-button', function(){
        var fbpopup = window.open("https://twitter.com/intent/tweet?text="+post_url, "pop", "width=600, height=400, scrollbars=no");
        return false;
    });

    /**
     * Check wheather a number exist or not
     * @param  string func_name Name of the function
     * @return boolean          true/false
     */
    function function_exists(func_name) {
      if (typeof func_name === 'string') {
        func_name = this.window[func_name];
      }
      return typeof func_name === 'function';
    }

    function wth_ga_event( eventAction, eventLabel ){
        if(wth_js_lang.wth_ga_enable != true ) {
            return;
        }
        var eventCategory = wth_js_lang.wth_ga_category;
        if ( function_exists( 'ga' ) ){
            ga( 'send', 'event', eventCategory, eventAction, eventLabel );
        } else if ( function_exists( '_trackEvent' ) ){
            _trackEvent( eventCategory, eventAction, eventLabel );
        } else {
            return;
        }
    }


});
