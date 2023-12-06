const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get("authorization");
  let token = "";
  if(authorization && authorization.toLocaleLowerCase().startsWith("bearer")){
    token = authorization.substring(7);
  } 

  let decodedToken = {}
  try{
    decodedToken = jwt.verify(token, "123");
  }catch(e){
    console.log(e) 
  }

  request.token = token;
  request.decodedToken = decodedToken;

  next();
}