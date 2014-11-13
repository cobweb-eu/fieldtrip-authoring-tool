//var map, oTable;

    function init(){

      $("#dialog-upload").dialog({
        autoOpen: false,
        modal: false
      });


      //get params of the url
      var params = utils.getParams();

      if ("sid" in params && params["sid"] !== undefined) {
        initialize_app(config.userid, 'local', params);
      }

      loadHomePage();

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
        version: config.version,
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
          "dtreeAction": ["dtree", "Decision Tree"],
          "layersAction": ["layers", "Layers"]
        }
      };

      if ("survey" in params) {
        options.editor = params.survey;
      }

      if ("sid" in params) {
        options.sid = params.sid;
      }

      if (params['public'] === 'true') {
        options.publicEditor = true;
      }

      $("#form-content").buildformer(options);
    }

    function loadHomePage (){
        $.ajax({
            url: "home.html",
            dataType: "html",
            success: function(data){
                $("#home-content").append(data);
            }
        });
    }