const jwt = require('jsonwebtoken')
const tokenExtractor = require('./middleware/tokenExtractor')
const express = require('express')
const app = express()
const port = 3001
const api = require('./API')
app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});
  

app.post('/login', (req, res) => {
  api.confirmUsuarios(req.body)
  .then(response => {
    console.log(response);
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(401).send(error);
  })
})

app.post('/registro', (req, res) => {
  api.insertUsuarios(req.body)
  .then(response => {
    console.log(response)
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(401).send(error);
  })
})

app.get('/recuperarContrasena/:username', (req, res) => {

    api.getPreguntaConfirmacion(req.params.username)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

})


app.put('/recuperarContrasena', (req, res) => {
    api.updateContrasena(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  
})

app.get('/preguntasFormulario/:id', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{

    api.getPreguntas(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  }

})

app.put('/preguntasFormulario', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    api.updatePreguntas(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  }
})

app.get('/preguntasFormularioMaxId/:id', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    api.getPreguntaMaxId(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  }
})

app.get('/preguntasFormulario/:id', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    api.getPreguntasIds(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  }
})

app.post('/preguntasFormulario', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    console.log("index error 401")
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    api.insertPreguntas(req.body)
    .then(response => {
      console.log("index  200")
      res.status(200).send(response);
    })
    .catch(error => {
      console.log("index error 500")
      res.status(500).send(error);
    })
  }
})

app.delete('/preguntasFormulario/:id/:form', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    
    api.deletePreguntas(req.params.id, req.params.form)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }
})

app.get('/formulario/:usuario', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    api.getFormularios(req.params.usuario)  
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }

})

app.get('/formularioExacto/:id', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{

    api.getFormulariosExacto(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
    
  }

})

app.post('/formulario', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    console.log("entramos en index");
    api.insertFormularios(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }

})

app.put('/formulario',tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{

    api.updateFormularios(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  }
})

app.put('/formularioColgado',tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    
    api.updateEstadoFormulario(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  }
})

app.delete('/formulario/:id',tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{

    api.deleteFormularios(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
    
  }
})

app.get('/formularioMaxId',tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{

    api.getFormulariosMaxId()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }


})

app.post('/respuesta', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{

    api.insertRespuesta(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }

})

app.get('/export/:ids/:id', tokenExtractor, (req, res) => {
  console.log("entramos en index: " + req.params.id);

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    let arr = req.params.ids.split(','); 
    console.log(arr);
    api.obtenerCSV(req.params.id,arr)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }

})


app.get('/exportFormulario/:id', tokenExtractor, (req, res) => {

  const {token} = req;
  const {decodedToken} = req;

  if(!token || !decodedToken.user){
    return res.status(401).json({error: "token missing or invalid"})
  }else{
    api.obtenerFormularioCSV(req.params.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

  }

})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

