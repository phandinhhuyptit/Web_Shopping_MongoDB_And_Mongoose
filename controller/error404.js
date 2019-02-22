exports.GetError404 = (req,res,next)=>{
    res.status(404).render('404',{
        
        
        TitlePage :'Page Not Found',
        Path:'/404'    
    
    });

}