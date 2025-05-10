const jwt=require('jsonwebtoken')

const secret_key = '123456789'
const authenticate =(req,res,next)=>{
    const data =req.query;
    console.log('data',data)
    const{token}=data;
    console.log('token:',token)
    if(!token){
        return res.status(500).send('missing token')
    }
    const verified =jwt.verify(token,secret_key)
    console.log('verified',verified)
    if(verified){
        next();
    }else{
        return res.status(403).send('Invalid token or unathoried')
    }
}



module.exports=authenticate