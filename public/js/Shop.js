//========================= Fetch Asynchronous===========================


// thr fucntion it will Deleta Items it very good with me 
const Delete_Items_Cart = (btn) => {

    const proId = btn.parentNode.querySelector('[name = productId]').value;
    const Csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const ProductElement = btn.closest('li'); 
    fetch('Cart/'+ proId,{

        method : "DELETE",
        headers : {

            "csrf-token" : Csrf
        }
    })
    .then(Result =>{

        console.log(Result);
        return Result.json();
    })
    .then((Data) => {
        console.log(Data);
        ProductElement.parentNode.removeChild(ProductElement);

    })    
    .catch(err =>{

        console.log(err);

    })
        // .then(Result => {

        //     console.log(Result);
        //     return Result.json();

        // })
       
        // .catch(err => {

        //     console.log(err);

        // })

}
