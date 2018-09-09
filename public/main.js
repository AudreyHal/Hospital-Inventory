var update= document.getElementById('update');
var del= document.getElementById('delete');

update.addEventListener('click', function(){
    fetch('quotes',{
        method:'put',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({
            'name':'tats',
            'quote':'ihhjhjkk'
        })
    })
})

del.addEventListener('click', function(){
    fetch('quotes',{
        method:'delete',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({
            'name':'tats',
            
        })
    })
    .then(res=>{
        if(res.ok)return res.json()
    })
}).
then(data=>{
    console.log(data)
    window.location.reload()
})

