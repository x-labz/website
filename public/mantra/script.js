window.onload = function() { 
     ;
    document.getElementById('zs').innerHTML = Math.floor(( new Date() -new Date ('2019-11-23') ) / (1000*60*60*24)) ;
    document.getElementById('sz').innerHTML = Math.floor(( new Date() -new Date ('2019-11-29') ) / (1000*60*60*24));
 } ;