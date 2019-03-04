
///========================= Fetch Asynchronous===========================

const deleteProduct = (btn) =>{

    const ProId = btn.parentNode.querySelector('[name = productId]').value;
    const Csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    // ?
    const ProductElement = btn.closest('article');

    //Fetch Asynchronous
    fetch('product/'+ ProId,{

        method : "DELETE",
        headers : {

            "csrf-token" : Csrf
        }

    })
    // ? 
    .then(Result =>{
        return Result.json();
    })
    .then(Data =>{
        // ?
       console.log(Data); 
       ProductElement.parentNode.removeChild(ProductElement);
    //    res.status(200).json({message : 'Remove Product Sucessful'})

    })
    .catch(err =>{
        console.log(err);
        //  res.status(404).json({message : 'Remove Product Fail'}) 

    })

} 


