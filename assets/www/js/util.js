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
////Quando a requisi��o come�ar, Exibe a DIV
//   $(this).popup("open");
//});
//$("#loading").ajaxStop(function(){
////Quando a requisi��o parar, Esconde a DIV
//   $(this).popup("close");
//});