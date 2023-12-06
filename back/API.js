const Pool = require('pg').Pool
const jwt = require('jsonwebtoken')
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("datos.csv");
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prueba',
  password: 'hola',
  port: 5432,
});

const confirmUsuarios = (body) => {
  return new Promise(function(resolve, reject) {
    const { usuario, contrasena } = body  
    pool.query('SELECT * FROM usuarios where nombre = $1', [usuario], (error, results) => {
      if (results.rowCount === 0) {  
        reject(["Credenciales no registradas"]);
      }else{  // else if recuperando la contraseña (que será un hash) y compruebe que sea correcta 
        
        const userForToken = {
          user: usuario
        }

        const token = jwt.sign(userForToken, '123');
        let rol;
        let hash;

        const jsonResults = JSON.stringify(results.rows);
        const jsonArray = JSON.parse(jsonResults);
        
        jsonArray.map((element) => {
          rol = element.rol;
          hash = element.contraseña;
        });
        
        
        bcrypt.compare(contrasena, hash, (err, result) => {
          if (err) {
            reject(["contraseña incorrecta", err]);
          } else {
            if(result === true){
              console.log("contraseña valida:", result);
              resolve({usuario: usuario, token: token, rol: rol});
            }else{
              reject(["Contraseña incorrecta"]);
            }
          }
        });
        
      }
    })
  }) 
}

const insertUsuarios = (body) => {
  return new Promise(function(resolve, reject) {
    const { usuario, contrasena, fecha } = body  
    //creamos el hash de la contraseña y lo insertamos en la base de datos
    let contrasenaHash;
    bcrypt.hash(contrasena, 10, (err, hash) => {
      if (err) {
        console.error(err);
      } else {
        contrasenaHash = hash;
        console.log("-----------------",contrasenaHash);
      }
    });

    let rol = "encuestado";
    pool.query('SELECT * FROM usuarios where nombre = $1', [usuario], (error, results) => {
      if (results.rowCount !== 0) {
        reject(["usuario no disponible"])
      }else{
        pool.query('INSERT INTO usuarios (nombre, contraseña, rol, verificacion) VALUES ($1, $2, $3, $4)', [usuario, contrasenaHash, rol, fecha], (error, results) => {
          if (error) {        
            console.log(error)
            reject(error)
          }else{
            resolve(["Usuario añadido"])
          }
        })
      }
    })
  }) 
}

const getPreguntaConfirmacion = (username) => {
  return new Promise(function(resolve, reject) {
    pool.query('select verificacion from usuarios where nombre = $1',[username], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const updateContrasena = (body) => {
  console.log("entramos en API");
  let contrasenaHash;
  return new Promise(function(resolve, reject) {
    const { contrasena, username } = body ;
    console.log(contrasena + " " + username)


    bcrypt.hash(contrasena, 10, (err, hash) => {
      if (err) {
        console.error(err);
      } else {
        contrasenaHash = hash;

        pool.query('UPDATE usuarios SET contraseña = $1 where nombre = $2', [contrasenaHash, username], (error, results) => {
          if (error) {        
            reject("errorApiServidor" + error)
          }
          resolve(["todo ha salido bien"])
        })

      }
    });

  })
}

const getPreguntas = (id) => {
  return new Promise(function(resolve, reject) {
    pool.query('select * from pregunta where formulario = $1 order by id asc',[id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getPreguntaMaxId = (id) => {
  return new Promise(function(resolve, reject) {
    pool.query('select max(id) FROM pregunta WHERE formulario = $1',[id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getPreguntasIds = (id) => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT id FROM pregunta WHERE formulario = $1',[id], (error, results) => {
      if (error) {
        reject(error)
      }else{
        resolve(results.rows);
      }
    })
  }) 
}

const insertPreguntas = (body) => {

  return new Promise(function(resolve, reject) {
    const {id, nombrePregunta, etiqueta, tipoPregunta, respuesta, respuestaMultiple, list, listMultiple, maxMultiple, MarcadasMultiple, obligatorio, contadorEscalaTextual, anadirImagen, imagen, imagenPreview, anadirOtro, contenidoOtro, anadirRestriccion, restriccionId, restriccionRespuesta, anadirRespuestaPregunta, anadirRespuestaPreguntaId, disabled, tiempo, idForm} = body  
    pool.query('INSERT INTO pregunta (id, nombrepregunta, etiqueta, tipopregunta, respuesta, respuestamultiple, list, listmultiple, maxmultiple, marcadasmultiple, obligatorio, contadorescalatextual, anadirimagen, imagen, imagenpreview, anadirotro, contenidootro, anadirrestriccion, restriccionid, restriccionrespuesta, anadirrespuestapregunta, anadirrespuestapreguntaid, disabled, tiempo, formulario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25 )', [id, nombrePregunta, etiqueta, tipoPregunta, respuesta, respuestaMultiple, list, listMultiple, maxMultiple, MarcadasMultiple, obligatorio, contadorEscalaTextual, anadirImagen, imagen, imagenPreview, anadirOtro, contenidoOtro, anadirRestriccion, restriccionId, restriccionRespuesta, anadirRespuestaPregunta, anadirRespuestaPreguntaId, disabled, tiempo, idForm], (error, results) => {
      if (error) {        
        reject(error)
      }else{
        resolve(["todo ha salido correctamente"])
      }
    })
  })
}

const updatePreguntas = (body) => {
  return new Promise(function(resolve, reject) {
    const { id, nombrePregunta, etiqueta, tipoPregunta, respuesta, respuestaMultiple, list, listMultiple, maxMultiple, MarcadasMultiple, obligatorio, contadorEscalaTextual, anadirImagen, imagen, imagenPreview, anadirOtro, contenidoOtro, anadirRestriccion, restriccionId, restriccionRespuesta, anadirRespuestaPregunta, anadirRespuestaPreguntaId, disabled, tiempo, idForm } = body  
    pool.query('UPDATE pregunta SET nombrepregunta = $2, etiqueta = $3, tipopregunta = $4, respuesta = $5, respuestamultiple = $6, list = $7, listmultiple = $8, maxmultiple = $9, marcadasmultiple = $10, obligatorio = $11, contadorescalatextual = $12, anadirimagen = $13, imagen = $14, imagenpreview = $15, anadirotro = $16, contenidootro = $17, anadirrestriccion = $18, restriccionid = $19, restriccionrespuesta = $20, anadirrespuestapregunta = $21, anadirrespuestapreguntaid = $22, disabled = $23, tiempo = $24 WHERE id = $1 AND formulario = $25', [id, nombrePregunta, etiqueta, tipoPregunta, respuesta, respuestaMultiple, list, listMultiple, maxMultiple, MarcadasMultiple, obligatorio, contadorEscalaTextual, anadirImagen, imagen, imagenPreview, anadirOtro, contenidoOtro, anadirRestriccion, restriccionId, restriccionRespuesta, anadirRespuestaPregunta, anadirRespuestaPreguntaId, disabled, tiempo, idForm], (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }
      resolve(["todo ha salido bien"])
    })
  })
}

const deletePreguntas = (id, formulario) => {
  return new Promise(function(resolve, reject) {
    pool.query('DELETE FROM pregunta WHERE id = $1 and formulario = $2', [id, formulario], (error, results) => {
      if (error) {        
        reject(error)
      }
      resolve(["todo ha salido bien"])
    })
  })
}

//select * from formulario where administrador === sesion
const getFormularios = (usuario) => {
  return new Promise(function(resolve, reject) {
    pool.query('select * from formulario where administrador = $1 order by id asc',[usuario] , (error, results) => {
      if (error) {
        reject(error)
      }else{
        resolve(results.rows);
      }
      
    })
  }) 
}

const getFormulariosExacto = (idFormulario) => {
  return new Promise(function(resolve, reject) {
    pool.query('select * from formulario where id = $1',[idFormulario], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getFormulariosMaxId = () => {
  return new Promise(function(resolve, reject) {
    pool.query('select max(id) from formulario', (error, results) => {
      if (error) {
        reject(error)
      }else{
        resolve(results.rows);
      }
      
    })
  }) 
}

//insert formulario where adminisitrador  === sesion.user
const insertFormularios = (body) => {
  return new Promise(function(resolve, reject) {
    const { id, fecha, administrador, colgado } = body  
    pool.query('INSERT INTO formulario (id,fecha, administrador, colgado) VALUES ($1, $2, $3, $4)', [id,fecha, administrador, colgado], (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }
      resolve(["todo ha salido bien"])
    })
  })
}

const updateFormularios = (body) => {
  return new Promise(function(resolve, reject) {
    const { titulo, descripcion, id } = body  
    pool.query('UPDATE formulario SET titulo = $1, descripcion = $2 WHERE id = $3', [titulo, descripcion, id], (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }
      resolve(["todo ha salido bien"])
    })
  })
}

const updateEstadoFormulario = (body) => {
  return new Promise(function(resolve, reject) {
    const { id, colgado } = body  
    pool.query('UPDATE formulario SET colgado = $1 WHERE id = $2', [colgado, id], (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }
      resolve(["todo ha salido bien"])
    })
  })
}

const deleteFormularios = (id) => {
  return new Promise(function(resolve, reject) {
    pool.query('DELETE FROM formulario WHERE id = $1', [id], (error, results) => {
      if (error) {        
        reject(error)
      }else{
        resolve(["todo ha salido bien"])
      }
    })
  })
}

const insertRespuesta = (body) => {
  return new Promise(function(resolve, reject) {

    const { etiqueta, respuesta, tiempo,formulario,usuario, idPregunta } = body
    pool.query('INSERT INTO responder (etiqueta,respuesta,tiempo,formulario,usuario, idpregunta) VALUES ($1, $2, $3, $4, $5, $6)', [etiqueta, respuesta, tiempo,formulario,usuario, idPregunta], (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }
      resolve(["todo ha salido bien"])
    })
  })
}

const obtenerCSV = (id,ids) => {
  return new Promise(function(resolve, reject) {
    let sql = "select * from responder where formulario = $1 AND idpregunta in (";
    let i = 0;

    for(i; i < ids.length; i++) {
      sql += String(ids[i]);
      if(i<ids.length-1)
        sql += ',';
    }
    sql += ")"; 
    pool.query(sql,[id] , (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }else{
        resolve(results.rows);
      }
    })
  })
}


const obtenerFormularioCSV = (id) => {
  return new Promise(function(resolve, reject) {
        
    pool.query('select * from responder where formulario = $1',[id] , (error, results) => {
      if (error) {        
        reject("errorApiServidor" + error)
      }else{
        resolve(results.rows);        
      }
    })
  })
}

module.exports = {
  confirmUsuarios,
  insertUsuarios,
  getPreguntaConfirmacion,
  updateContrasena,
  getPreguntas,
  getPreguntasIds,
  getPreguntaMaxId,
  insertPreguntas,
  updatePreguntas,
  deletePreguntas,
  getFormularios,
  getFormulariosExacto,
  insertFormularios,
  updateFormularios,
  updateEstadoFormulario,
  deleteFormularios,
  getFormulariosMaxId,
  insertRespuesta,
  obtenerCSV,
  obtenerFormularioCSV,
}