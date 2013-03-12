//GLOBAL FUNCTIONS
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//$("#loading").ajaxStart(function(){
////Quando a requisição começar, Exibe a DIV
//   $(this).popup("open");
//});
//$("#loading").ajaxStop(function(){
////Quando a requisição parar, Esconde a DIV
//   $(this).popup("close");
//});

$('input[name=valor_consulta]').keyup(function(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = '[0-9]'; /* Use |\. to include a decimal */
    if( !regex.test(key) ) {
     theEvent.returnValue = false;
     theEvent.preventDefault();
    }
});