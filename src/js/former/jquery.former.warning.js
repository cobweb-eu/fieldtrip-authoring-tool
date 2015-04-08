var WarningImplementation = function(target, title, type, elements){
  this.target = target;
  this.title = title;
  this.type = type;
  this.elements = elements;
}

WarningImplementation.prototype.implement = function(){
  var warning = new Warning(this.title, 'required', 'Warning message goes here');
  var i = findIForFieldcontain("#"+this.target, '.fieldcontain', this.type);
  $("#"+this.target).append(warning.render(i).join(""));
  appendEditButtons("fieldcontain-warning-"+i);
  
  var form = new OptionsForm (this.type, this.title, 'Warning message goes here', 'required', null, this.elements);
  makeAlertWindow(form.create().join(""), 'Options', 260, 400, 'options-dialog', 1000, "right", makeDialogButtons('options-dialog', this.target));
  form.enableEvents[this.type](i, this.target);
}

var Warning = function(name, required, placeholder){
  this.name = name;
  this.required = required;
  this.placeholder = placeholder;
}

Warning.prototype.render = function(i){
  var text = new Array();
  text.push('\n<div class="fieldcontain" id="fieldcontain-warning-'+i+'" data-fieldtrip-type="warning" style="height: auto;">');
  text.push('\n<label for="form-warning-'+i+'">'+this.name+'</label>');
  text.push('\n<textarea name="form-warning-'+i+'" id="form-warning-'+i+'" placeholder="'+this.placeholder+'" '+this.required+' readonly="true"></textarea>');
  text.push("\n</div>\n");
  return text;
}