    const Sum = ( a ,b )=>{
        if(a > 10){

            throw new Error('Invalid Value');

        }
        let total = a + b ;
        return total ;  

    }
    




    try {

        Sum(23,2);
        
    } catch (error) {
        
        console.log("OK ");


    }
    
