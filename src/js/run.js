//var map, oTable;
    var provider;
    var versions = config.versions.split(",");

    function init(){
      //resize a map
      $("#map_canvas").width(0.8*$(".span9").width());
      $("#map_canvas").height(0.45*$(window).height());

      //pop up window for map
      $( "#dialog-map" ).dialog({
        autoOpen: false,
        height: 0.90*$(window).height(),
        width: 0.90*$(window).width(),
        modal: false
      });

      //dialog window for login
      $("#dialog-login").dialog({
        autoOpen: false,
        modal: false
      });

      $("#dialog-upload").dialog({
        autoOpen: false,
        modal: false
      });

      $("#dialog-local-login").dialog({
        autoOpen: false,
        modal: false
      });

      $(document).on('click', '#open-login', function(){
        $("#dialog-login").dialog("open");
      });


      //get params of the url
      var params = utils.getParams();

      //do the redirect after login
      $(document).on('click', '.redirect-me', function(){
        console.log($(this).attr("id"));
          provider = $(this).attr("id");
          localStorage.setItem("provider", provider);
          if(provider === 'local'){
            var url = config.baseurl+versions[versions.length - 1]+"/pcapi/auth/"+provider;
            $("#dialog-local-login").dialog("open");
            $("#loginbutton").click(function(){
              var $location = $(location);
              $location.attr('href', $location.attr("href")+"?uid=123&oauth_token="+$('#user-email').val());
            });
          }else{
            var url = config.baseurl+versions[versions.length - 1]+"/pcapi/auth/"+provider+"?callback="+$(location).attr('href');
            console.log(url);
            $.getJSON(url, function(data) {
              $(location).attr('href',data.url);
            });
          }
      });

      //if ("oauth_token" in params && params["oauth_token"] !== undefined) {
      //  initialize_app(params["oauth_token"], localStorage.getItem("provider"), params);
      //}else if ("group" in params && params["group"] !== undefined) {
        initialize_app('d6d0177e-0f8e-75d1-6052-2ab59d96a6cd', localStorage.getItem("provider"), params);
      //}
      //else{
        loadHomePage();
      //}

      if(screen.width < 768){
        $("#fat-menu").hide();
        $("#size-screen").hide();
        $("#edit-buttons").hide();
        $(".btn").removeClass('btn-large').addClass('btn-small');
      }else if(screen.width <= 1200){
        $(".btn").removeClass('btn-large');
      }
    }

    function initialize_app(oauth, provider, params){
      var options = {
        version: "1.3",
        provider: provider,
        mainmenu_id: "mainmenu",
        editmenu_id: "editmenu",
        sizes: ["240x320", "320x480", "480x800", "600x1024"],
        form_elements_id: "elements",
        oauth: oauth,
        choices: {
          "textAction": ["text", "Text"],
          "rangeAction": ["range", "Range"],
          "textareaAction": ["textarea", "Text Area"],
          "checkboxAction": ["checkbox", "Multiple Choice Selector"],
          "radioAction": ["radio", "Single Choice Selector"],
          "selectAction": ["select", "Drop down Selector"],
          "photoAction": ["image", "Image Capture"],
          "photoPointAction": ["image", "Image with Point"],
          "audioAction": ["audio", "Audio Capture"],
          "warningAction": ["warning", "Warning Message"],
          "dtreeAction": ["dtree", "Decision Tree"]
        }
      };

      if ("survey" in params) {
        options["editor"] = params["survey"];
      }
      $("#form-content").buildformer(options);
    }

    function loadHomePage (){
        $.ajax({
            url: "home.html",
            dataType: "html",
            success: function(data){
                $("#home-content").append(data);
          
                //if(uid != 0){
                //  $("#login-paragraph").hide("fast");
                //}
            }
        });
    }