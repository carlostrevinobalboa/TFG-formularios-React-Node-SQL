import { useParams,Link, useNavigate } from 'react-router-dom';
import { usePreguntas, useFormulario, useRespuesta } from "../hooks";
import { useState, useEffect } from "react";
import swal from 'sweetalert2'

function Respuesta(){
  
  let {id} = useParams();
  const navigate = useNavigate();

  const {create}  = useRespuesta();
  const {dataGetPreguntas}  = usePreguntas(id);
  const {dataGetFormulariosExacto}  = useFormulario(id);

  const [index, setIndex] = useState(0);
  const [preguntaContent, setPreguntaContent] = useState();
  const [formulario, setFormulario] = useState();

  const [numeroPreguntas, setNumeroPreguntas] = useState();
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [respuestaMultiple, setRespuestaMultiple] = useState([]);
  const [noRespondidas, setNoRespondidas] = useState([]);
  const [errorRespuestaMultiple, setErrorRespuestaMultiple] = useState([]);

  const [executed, setExecuted] = useState(true);
  const [executedForm, setExecutedForm] = useState(true);
  const [controladorAnterior, setControladorAnterior] = useState(true);
  const [controladorSiguiente, setControladorSiguiente] = useState(false);
  let a = 0;


  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    //SOLO si no existe la sesion vuelve a login
    if(loggedUser === null){
      navigate('/',{state: { idFormRespuesta: id } });
    }
  }, [navigate,id]);

  useEffect(() => {
    if(executed){
      setPreguntaContent(dataGetPreguntas);
      if(preguntaContent && preguntaContent.length > 0){
        setNumeroPreguntas(preguntaContent.length);
        setExecuted(false);
        console.log(preguntaContent);
      }
    }    
  }, [dataGetPreguntas,executed,preguntaContent]);

  useEffect(() => {
    if(executedForm){
        setFormulario(dataGetFormulariosExacto);
        if(formulario && formulario.length >= 0){
          setExecutedForm(false);
          if(formulario[0].colgado === false){
            swal.fire('ERROR: formulario no accesible, sesión terminada','','error');
            localStorage.clear();
            navigate('/');
          }
        }
    }
  }, [dataGetFormulariosExacto, formulario, executedForm]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //controlador del boton siguiente cuando hay una pregunta solo
  useEffect(() => {
    if(numeroPreguntas === 1){
      handleBotonesAux();
    }else{
      handleBotones();
      setControladorAnterior(true);
    }
  
  }, [numeroPreguntas]);

  function resetTimer() {
    clearInterval(intervalId);
    setTime(0);
  }

  const guardarTimer = () => {
    let camposFormulario = [...preguntaContent];
    //se suma al anterior para contar el tiempo acumulado por si vuelven atrás
    camposFormulario[index].tiempo = camposFormulario[index].tiempo + time;
    setPreguntaContent(camposFormulario);
  }

  function handleBotonesAux(){
    setControladorSiguiente(true);
    setControladorAnterior(true);
  }

  function handleBotones(a){

    if(a + 1 === numeroPreguntas){
      setControladorSiguiente(true);
    }else{
      setControladorSiguiente(false);
    } 

    if(a === 0){
      setControladorAnterior(true);
    }else{
      setControladorAnterior(false);
    }

  }

  function siguientePregunta ()  {
    resetTimer();
    let a = index + 1;
    setIndex(index + 1);
    
    if(preguntaContent[a].respuestamultiple[0] === undefined){
      preguntaContent[a].respuestamultiple[0] = '';
      if(preguntaContent[a].tipopregunta === "Respuesta unica" || preguntaContent[a].tipopregunta === "Escala" ){
        preguntaContent[a].respuestamultiple[0] = undefined;
      }
    }

    //comporbamos que exista una restriccion en la siguiente pregunta
    if(preguntaContent[a].anadirrestriccion === true){
      comprobarDisabled();
    }

    if(preguntaContent[a].anadirrespuestapregunta === true){
      añadirTextoAPregunta();
    }

    handleBotones(a);
  }
  
  const anteriorPregunta =() => {
    let a = index - 1;
    setIndex(index - 1);

    handleBotones(a);
  }

  const comprobarDisabled = () => {
    //hay que sumar uno a index por que no se actualiza a tiempo en la funcion siguientePregunta
    const idRestriccion = preguntaContent[index + 1].restriccionid;
    const respuestaRestriccion = preguntaContent[index + 1].restriccionrespuesta;

    const camposFormulario = [...preguntaContent];
    const indice = camposFormulario.findIndex(f => parseInt(f.id) === parseInt(idRestriccion));
    if(indice > -1){
      let respuestaFormulario = camposFormulario[indice].respuestamultiple[0];
      if(respuestaFormulario === respuestaRestriccion){
        camposFormulario[index+1].disabled = true;
        setPreguntaContent(camposFormulario);
      }else{
        camposFormulario[index+1].disabled = false;
        setPreguntaContent(camposFormulario);
      }
    } 
  }

  const añadirTextoAPregunta = () => {
    const idCompletar = preguntaContent[index + 1].anadirrespuestapreguntaid;
    const camposFormulario = [...preguntaContent];  
    const indice = camposFormulario.findIndex(f => parseInt(f.id) === parseInt(idCompletar));
    if(indice > -1){
      let respuestaFormulario = camposFormulario[indice].respuestamultiple[0];
      camposFormulario[index+1].nombrepregunta =  camposFormulario[index+1].nombrepregunta.replace('$',respuestaFormulario);
    }
    setPreguntaContent(camposFormulario);
  }

  const calcularIndiceMultiple = (valueMultiple, campos) => {
    let camposFormulario = [...preguntaContent];
    let index = camposFormulario.findIndex(f => f.id === campos);
    if(index > -1){
      for (let i = 0; i < 20; i++) {
        if(camposFormulario[index].list[i] === valueMultiple){
          let indiceMultiple = i;
          if(camposFormulario[index].listmultiple[indiceMultiple] === "false"){
            camposFormulario[index].listmultiple[indiceMultiple] = "true";

            camposFormulario[index].marcadasmultiple += 1;
            if(camposFormulario[index].marcadasmultiple < camposFormulario[index].maxmultiple){
              let a = Math.abs(camposFormulario[index].marcadasmultiple - camposFormulario[index].maxmultiple);
            }
            if(camposFormulario[index].marcadasmultiple > camposFormulario[index].maxmultiple){
              let a = Math.abs(camposFormulario[index].marcadasmultiple - camposFormulario[index].maxmultiple);
            }
            if(camposFormulario[index].marcadasmultiple === camposFormulario[index].maxmultiple){
            }                  

          }else{
            
            camposFormulario[index].listmultiple[indiceMultiple] = "false";

            camposFormulario[index].marcadasmultiple -= 1;
            if(camposFormulario[index].marcadasmultiple > camposFormulario[index].maxmultiple){
              let a = Math.abs(camposFormulario[index].marcadasmultiple - camposFormulario[index].maxmultiple);
            }
            if(camposFormulario[index].marcadasmultiple === camposFormulario[index].maxmultiple){
            }
            if(camposFormulario[index].marcadasmultiple < camposFormulario[index].maxmultiple){
              let a = Math.abs(camposFormulario[index].marcadasmultiple - camposFormulario[index].maxmultiple);
            }

          }

        }

      }

      setPreguntaContent(camposFormulario);
    }
  }

  //guarda la respeusta en la estructura de preguntas
  const   asignarRespuestaAux = (e) => {
      setRespuesta(e.target.value);
  }

  const asignarRespuestaAuxMultiple = (indice) => {
    setRespuestaMultiple();
    const camposFormulario = [...preguntaContent];
    let arrayAux = [];
    for(let i = 0; i < camposFormulario[index].listmultiple.length; i++){
      if(camposFormulario[index].listmultiple[i] === "true"){
        arrayAux.push(camposFormulario[index].list[i]);
      }
    }

    setRespuestaMultiple([...arrayAux]);
  }

  //guarda la respeusta en la estructura de preguntas
  const asignarRespuesta = (id) => {

      const camposFormulario = [...preguntaContent];
      const indice = camposFormulario.findIndex(f => f.id === id);
      if(indice > -1){
        if(camposFormulario[index].disabled === false){
          if(camposFormulario[index].tipopregunta === "Respuesta multiple"){
            console.log(respuestaMultiple);
            if(respuestaMultiple!==""){
              camposFormulario[indice].respuestamultiple.splice(0,camposFormulario[indice].respuestamultiple.length);
              camposFormulario[indice].respuestamultiple.push(respuestaMultiple);
              setPreguntaContent(camposFormulario);
            }
          }else{
            if(respuesta !== ""){
              camposFormulario[indice].respuestamultiple.splice(0,camposFormulario[indice].respuestamultiple.length);
              camposFormulario[indice].respuestamultiple.push(respuesta);
              setRespuesta("");
              setPreguntaContent(camposFormulario);
            }
            
          }
        }
      } 
  }
                                    
  const guardarRespuestaLocalAux = (pregunta,value) => {

    const camposFormulario = [...preguntaContent];  
    const index = camposFormulario.findIndex(f => f.id === pregunta.id);
    if(index > -1){
      //se asigna al campo respuestamultiple de la pregunta la respuesta recibida por parametro
      camposFormulario[index].respuestamultiple[0] = value;
      //se actualiza la variable de estado formContent
      setPreguntaContent(camposFormulario);
  }

  }

  const comprobarEtiqueta = (pregunta) => {
      const camposFormulario = [...preguntaContent];  
      const index = camposFormulario.findIndex(f => f.id === pregunta.id);
      if(index > -1){
        //se asigna al campo nombrePregunta de la pregunta el nombre recibido por parametro
        camposFormulario[index].etiqueta = pregunta.nombrepregunta;
        //se actualiza la variable de estado formContent
        setPreguntaContent(camposFormulario);
    }
  }

  const handleSubmit = async () => {
    //reiniciamos el array de preguntas obligatorias sin s
    setNoRespondidas([]);
    setErrorRespuestaMultiple([]);
    
    //comprobamos que todos las preguntas tengan una etiqueta, y si no tienen
    //se les pone la pregunta
    for(let i=0; i<preguntaContent.length; i++){
      if(preguntaContent[i].etiqueta === ""){
        comprobarEtiqueta(preguntaContent[i]);
      }
    }

    let comprobante = true;
    let comprobante2 = true;
    let comprobante3 = true;


    //MULTIPLE HAN MARCADO EL NUMERO CORRECTO
    for(let i=0; i<preguntaContent.length;i++){
      if(preguntaContent[i].tipopregunta === "Respuesta multiple"){
        if(preguntaContent[i].marcadasmultiple > preguntaContent[i].maxmultiple){
          errorRespuestaMultiple.push(i);
          comprobante3 = false;
        }
      }
    }


    //OBLIGATORIAS RESPONDIDAS
    for(let i=0; i<preguntaContent.length;i++){
    //comprobar que todas las preguntas obligatorias han sido respondidas
      if(preguntaContent[i].obligatorio === true){
        //comprobamos si hay alguna pregunta no respondida y la añadimos a un array de no respondidas
        if(preguntaContent[i].tipopregunta === "Respuesta multiple"){
          if(preguntaContent[i].respuestamultiple[0].length > 0){
          }else{
            noRespondidas.push(i);
            comprobante2 = false;
          }
        }else{
          if(preguntaContent[i].respuestamultiple.length > 0 && (preguntaContent[i].respuestamultiple[0] !== undefined && preguntaContent[i].respuestamultiple[0] !== "" )){
            console.log("------"+preguntaContent[i].respuestamultiple[0])
          }else{
            noRespondidas.push(i);
            comprobante2 = false;
          }
        }
      }

    }

    //HACER SOLO LA INSERCCION SI LO ANTERIOR SE CUMPLE
    //hace las insercciones si se cumplen las condiciones y comprueba que todos las inserciones hayan sido correctas 
    if(comprobante2 === true && comprobante3 ===true){
      for(let i=0; i<preguntaContent.length; i++){
        comprobante = submit(preguntaContent[i]);
      }
    }


    if(comprobante === false || comprobante2 === false || comprobante3 === false){
      if(comprobante === false){
        swal.fire({
          title: 'Error al guardar las respuestas',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
            localStorage.clear();
          }
        })
      }else if(comprobante2 === false){
        for(let i=0; i< noRespondidas.length; i++){
          swal.fire({
            title: 'ERROR, la pregunta '+noRespondidas[i]+' es obligatoria, vuelve a responderla' ,
            confirmButtonText: 'Ok',
          })
        }
      }else if(comprobante3 === false){
        for(let i=0; i< errorRespuestaMultiple.length; i++){
          swal.fire({
            title: 'ERROR, en la pregunta '+errorRespuestaMultiple[i]+' has marcado más opciones que el máximo permitido' ,
            confirmButtonText: 'Ok',
          })
        }
      }

    }else{

      swal.fire({
        title: 'Formulario guardado con éxito',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
          localStorage.clear();
        }
      }) 

    }
  }

  const submit = async (pregunta) => {
    let controller = null;
    let seguro = true;

    const sesionString = window.localStorage.getItem("loggedUser");
    const sesionJson = JSON.parse(sesionString);
    const usuarioSesion = sesionJson.usuario;

    try {
      
      controller = await create({
        usuario: usuarioSesion,
        formulario: id,
        etiqueta: pregunta.etiqueta,
        respuesta: pregunta.respuestamultiple,
        tiempo: pregunta.tiempo,
        idPregunta: pregunta.id,
      })

      if(controller === false){
        seguro = false;
      }

    } catch (err) {
        alert(err);
    }

    return seguro;    

  }

return(
  <>
  
      <div className='w-full bg-indigo-300 h-screen text-center'>
        <div className="justify-center items-center">
          <div className="flex flex-col items-center ">
            <div className="mt-0 w-full md:w-5/6 md:mt-12 lg:w-4/6 lg:mt-12 border-4 border-black  p-2 text-start">

              {
                (formulario && formulario.length > 0) && formulario.map((campos) => {
                  return (
                    <div className="mb-2">
                      <p className="text-2xl md:text-4xl lg:text-4xl text-center w-full mb-2 rounded-lg font-bold ">{campos.titulo}</p>
                      <p className="text-lg md:text-2xl lg:text-2xl text-black text-center font-semibold">{campos.descripcion}</p>
                    </div>
                  )
                })
              }
            
              {     
                (preguntaContent && preguntaContent.length > 0)
                ?

                <div className="border-2 border-black rounded-lg ml-6 mr-6 mt-6 mb-1 p-2 bg-slate-300">

                  <div className="flex flex-row justify-start text-left">
                    <p className="text-sm md:text-xl lg:text-xl  ">{preguntaContent[index].nombrepregunta}</p>
                    {
                      preguntaContent[index].obligatorio ? <span className="text-red-900 ml-2 text-sm md:text-xl lg:text-xl">*obligatoria</span> : <span > </span>
                    }
                  </div>
                  {/******************************************** */}
                  
                  <div>
                    {
                    //si se pulsa el boton de añadir imagen, el atributo anadirimagen se cambia a true y muestra el menu de añadir imagen
                      preguntaContent[index].anadirimagen
                      ?
                        <div className="mt-2 flex flex-row text-center">
                          {/* se muestra el archivo seleccionado*/}
                          {preguntaContent[index].imagenpreview.map((item) =><img src={item} className="w-40 h-40 border-2 border-black mr-2" alt='imagen'></img>)}  
                        </div>
                      :
                        //en caso de ser false anadirimagen no se muestra nada
                        null
                    }
                  </div>
                  
                  <div>
                    {console.log(index, preguntaContent[index].respuestamultiple[0])}
                    {
                      preguntaContent[index].tipopregunta === 'Respuesta corta' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={preguntaContent[index].disabled} required={preguntaContent[index].obligatorio} type="text" onChange={(e) => {asignarRespuestaAux(e); guardarRespuestaLocalAux(preguntaContent[index], e.target.value)}} value={preguntaContent[index].respuestamultiple[0]}/>
                    }
                    {
                      preguntaContent[index].tipopregunta === 'Respuesta larga' && <textarea  className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={preguntaContent[index].disabled} required={preguntaContent[index].obligatorio} rows={3} onChange={(e) => {asignarRespuestaAux(e); guardarRespuestaLocalAux(preguntaContent[index], e.target.value)}} value={preguntaContent[index].respuestamultiple[0]}/>
                    } 
                    {
                      preguntaContent[index].tipopregunta === 'Fecha' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="date" disabled={preguntaContent[index].disabled} required={preguntaContent[index].obligatorio} onChange={(e) => {asignarRespuestaAux(e); guardarRespuestaLocalAux(preguntaContent[index], e.target.value)}} value={preguntaContent[index].respuestamultiple[0]}/> 
                    }
                    {
                      preguntaContent[index].tipopregunta === 'Hora' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="time" disabled={preguntaContent[index].disabled} required={preguntaContent[index].obligatorio} onChange={(e) => {asignarRespuestaAux(e); guardarRespuestaLocalAux(preguntaContent[index], e.target.value)}} value={preguntaContent[index].respuestamultiple[0]}/> 
                    }
                    {
                      preguntaContent[index].tipopregunta === 'Respuesta numerica' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={preguntaContent[index].disabled} required={preguntaContent[index].obligatorio} type="number" onChange={(e) => {asignarRespuestaAux(e); guardarRespuestaLocalAux(preguntaContent[index], e.target.value)}} value={preguntaContent[index].respuestamultiple[0]}/>
                    }
                    {
                      preguntaContent[index].tipopregunta === 'Respuesta unica' && 
                      <div className="mt-2 text-center">
                        <div>
                          <select required={preguntaContent[index].obligatorio} disabled={preguntaContent[index].disabled} className="cursor-pointer rounded-lg border-2 border-black" onChange={(e) => asignarRespuestaAux(e)}>
                            <option value={preguntaContent[index].respuestamultiple[0]} defaultValue>{preguntaContent[index].respuestamultiple[0]}</option>
                            {preguntaContent[index].list.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                        </div>          
                        <div className="mt-2">
                          {
                            preguntaContent[index].anadirotro
                            ?
                              <div>
                                <label className='text-xs md:text-base lg:text-base mt-2 rounded-md '> {preguntaContent[index].contenidootro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  border-2 border-black" type="text" placeholder="introduce tu otra respuesta" />                            
                              </div>
                            :
                              null
                          }
                        </div>

                      </div>
                    }
                    {
                      preguntaContent[index].tipopregunta === 'Escala' && 
                      <div className="mt-2 flex flex-row flex-wrap flex-1 justify-center ml-5">
                        {preguntaContent[index].list.map((item) =>
                        <label className="mr-7" >
                          {
                            //al darle a volver atras que marque la marcada antes
                            item === preguntaContent[index].respuestamultiple[0]
                            ?
                              <input className='text-xs md:text-base lg:text-base' disabled={preguntaContent[index].disabled} checked required={preguntaContent[index].obligatorio} type="radio" name={preguntaContent[index].contadorescalatextual} value={item} onChange={(e) => asignarRespuestaAux(e)  } label={item}/>
                            :
                              <input className='text-xs md:text-base lg:text-base' disabled={preguntaContent[index].disabled}  required={preguntaContent[index].obligatorio} type="radio" name={preguntaContent[index].contadorescalatextual} value={item} onChange={(e) => asignarRespuestaAux(e)  } label={item}/>
                          }
                          {item} 
                        </label>)}
                      </div>
                    }
                    {
                      preguntaContent[index].tipopregunta === 'Respuesta multiple' &&
                      <div className="mt-4 flex-1 justify-center ml-5">
                        {preguntaContent[index].list.map((item, indice) =>
                          
                          <label className="mr-7">
                            <input disabled={preguntaContent[index].disabled} checked={preguntaContent[index].listmultiple[indice] === "false" ? false : true }  required={preguntaContent[index].obligatorio} id={item} className="rounded-xl form-checkbox h-4 w-4 cursor-pointer" onChange={(e) => {calcularIndiceMultiple(e.target.value, preguntaContent[index].id); asignarRespuestaAuxMultiple()}} type="checkbox" name="respuestamultiple" value={item} label={item}/>
                            {item} 
                          </label>

                        )}
                        
                        {
                          preguntaContent[index].anadirotro
                          ? 
                            <div className='flex flex-row'>
                              <div>
                                <label className='text-xs md:text-base lg:text-base mt-2 rounded-md'> {preguntaContent[index].contenidootro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  " type="text" placeholder="introduce tu otra respuesta" />                            
                              </div>
                            </div>           
                          : 
                            null
                        }

                        <div className='flex flex-col mt-2' >
                          {
                            (-1*(preguntaContent[index].marcadasmultiple - preguntaContent[index].maxmultiple)) >= 0
                            ?
                            <p>Aún puedes marcar {-1*(preguntaContent[index].marcadasmultiple - preguntaContent[index].maxmultiple)} opción/es</p>
                            :
                            <p className='text-xs md:text-base lg:text-base text text-red-600'>Debes desmarcar {-1*(preguntaContent[index].marcadasmultiple - preguntaContent[index].maxmultiple) } opción/es </p>
                          }
                          
                        </div>
                      </div>
                    }
                  </div>

                  <div className="ml-6 text-center">
                    <button className={!controladorAnterior ? "bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md mt-2" : "bg-gray-400 hover:bg-gray-300 items-center p-1 text-sm text-white rounded-md mt-2"} disabled={controladorAnterior} onClick={() => {asignarRespuesta(preguntaContent[index].id); anteriorPregunta(); resetTimer()}}> Anterior</button>
                    <button className={!controladorSiguiente ? "bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md mt-2 ml-6" : "bg-gray-400 hover:bg-gray-300 items-center p-1 text-sm text-white rounded-md mt-2 ml-6"} disabled={controladorSiguiente} onClick={() => {asignarRespuesta(preguntaContent[index].id); siguientePregunta(); guardarTimer()}}> Siguiente</button>
                    <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md ml-6 mt-2" onClick={() => {asignarRespuesta(preguntaContent[index].id); guardarTimer(); handleSubmit()}}> guardar </button>
                  </div>
                  
                </div>
                :
                null
              }


            </div>
          </div>
        </div>
      </div>
  </>
)

}

export default Respuesta;