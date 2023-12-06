import React, { useState, useEffect } from "react";

function Previsualizacion ({formPrev, setFormPrev, titulo, descripcion, numeroPreguntas}) {

  const [index, setIndex] = useState(0);

  const [controladorAnterior, setControladorAnterior] = useState(true);
  const [controladorSiguiente, setControladorSiguiente] = useState(false);


  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(numeroPreguntas === 1){
      console.log("Entramos en la funcion");
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
    let camposFormulario = [...formPrev];
    //se suma al anterior para contar el tiempo acumulado por si vuelven atrás
    camposFormulario[index].tiempo = camposFormulario[index].tiempo + time;
    setFormPrev(camposFormulario);
    console.log(formPrev);
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

  function handleBotonesAux(){
    setControladorSiguiente(true);
    setControladorAnterior(true);
  }

  function siguientePregunta ()  {
    resetTimer();
    let a = index + 1;
    setIndex(index + 1);

    //comporbamos que exista una restriccion en la siguiente pregunta
    if(formPrev[a].anadirRestriccion === true){
      comprobarDisabled();
    }

    if(formPrev[a].anadirRespuestaPregunta === true){
      añadirTextoAPregunta();
    }

    handleBotones(a);

  }
  
  const anteriorPregunta =() => {
    console.log(formPrev);
    let a = index - 1;
    setIndex(index - 1);

    handleBotones(a);
  }

  //guarda la respeusta en la estructura de preguntas
  const asignarRespuestaSimple = (e,id) => {
    const camposFormulario = [...formPrev];
    const indice = camposFormulario.findIndex(f => f.id === id);
    if(indice > -1){
      camposFormulario[indice].respuesta = e.target.value;
      setFormPrev(camposFormulario);
    } 
  }

  const comprobarDisabled = () => {

      //hay que sumar uno a index por que no se actualiza a tiempo en la funcion siguientePregunta
      const idRestriccion = formPrev[index + 1].restriccionId;
      const respuestaRestriccion = formPrev[index + 1].restriccionRespuesta;

      const camposFormulario = [...formPrev];
      const indice = camposFormulario.findIndex(f => f.id === idRestriccion);
      if(indice > -1){
        let respuestaFormulario = camposFormulario[indice].respuesta;

        if(respuestaFormulario === respuestaRestriccion){
          camposFormulario[index+1].disabled = true;
          setFormPrev(camposFormulario);
        }else{
          camposFormulario[index+1].disabled = false;
          setFormPrev(camposFormulario);
        }
      } 
  }

  const añadirTextoAPregunta = () => {
    const idCompletar = formPrev[index + 1].anadirRespuestaPreguntaId;
    const camposFormulario = [...formPrev];  
    const indice = camposFormulario.findIndex(f => f.id === idCompletar);
    if(indice > -1){
      let respuestaFormulario = camposFormulario[indice].respuesta;
      //camposFormulario[index+1].nombrePregunta =  camposFormulario[index+1].nombrePregunta.replace('$',respuestaFormulario);
    }
    setFormPrev(camposFormulario);
  }

  const calcularIndiceMultiple = (valueMultiple, campos) => {
    let camposFormulario = [...formPrev];
    let index = camposFormulario.findIndex(f => f.id === campos);
    if(index > -1){
      for (let i = 0; i < 20; i++) {
        if(camposFormulario[index].list[i] === valueMultiple){
          let indiceMultiple = i;

          if(camposFormulario[index].listMultiple[indiceMultiple] === "false"){
            camposFormulario[index].listMultiple[indiceMultiple] = "true";

            camposFormulario[index].MarcadasMultiple += 1;
            if(camposFormulario[index].MarcadasMultiple < camposFormulario[index].maxMultiple){
              let a = Math.abs(camposFormulario[index].MarcadasMultiple - camposFormulario[index].maxMultiple);
              alert("Te quedan por marcar " + a + " opcion/es");
            }
            if(camposFormulario[index].MarcadasMultiple > camposFormulario[index].maxMultiple){
              let a = Math.abs(camposFormulario[index].MarcadasMultiple - camposFormulario[index].maxMultiple);
              alert("No puedes marcar mas casillas, debes eliminar " + a + " opcion/es");
            }
            if(camposFormulario[index].MarcadasMultiple === camposFormulario[index].maxMultiple){
              alert("Aún puedes marcar más opciones");
            }                  

          }else{
            
            camposFormulario[index].listMultiple[indiceMultiple] = "false";

            camposFormulario[index].MarcadasMultiple -= 1;
            if(camposFormulario[index].MarcadasMultiple > camposFormulario[index].maxMultiple){
              let a = Math.abs(camposFormulario[index].MarcadasMultiple - camposFormulario[index].maxMultiple);
              alert("No puedes marcar mas casillas, debes eliminar " + a + " opcion/es");
            }
            if(camposFormulario[index].MarcadasMultiple === camposFormulario[index].maxMultiple){
              alert("No puedes marcar más opciones");
            }
            if(camposFormulario[index].MarcadasMultiple < camposFormulario[index].maxMultiple){
              let a = Math.abs(camposFormulario[index].MarcadasMultiple - camposFormulario[index].maxMultiple);
              alert("Aún puedes marcar " + a + " opcion/es");
            }

            console.log("restamos" + camposFormulario[index].MarcadasMultiple);
          }

        }

      }

      setFormPrev(camposFormulario);
    } 
  }

  return (
    <div>

      <div className="mb-2">
        <p className="text-2xl md:text-4xl lg:text-4xl text-center w-full mb-2 rounded-lg font-bold ">{titulo}</p>
        <p className="text-lg md:text-2xl lg:text-2xl text-black text-center font-semibold">{descripcion}</p>
      </div>
      
      <div className="border-2 border-black rounded-lg ml-6 mr-6 mt-6 mb-1 p-2 bg-slate-300 ">

        <div className="ml-1 text-left">
          <p className="text-sm md:text-xl lg:text-xl "> tiempo: {time}</p>
          <p className="text-sm md:text-xl lg:text-xl ">tiempo anterior: {formPrev[index].tiempo}</p>
        </div>

        <div>
          <p className="text-sm md:text-xl lg:text-xl " value={formPrev[index].nombrePregunta} ></p>
          {
          formPrev[index].obligatorio ? <span className="text-red-900 ml-2 text-sm md:text-xl lg:text-xl">* obligatoria</span> : <span> </span>
          }
        </div>

        <div>
          {
            //si se pulsa el boton de añadir imagen, el atributo anadirImagen se cambia a true y muestra el menu de añadir imagen
            formPrev[index].anadirImagen
            ?
              <div className="mt-2 flex flex-row text-center">
                {/* se muestra el archivo seleccionado*/}
                {formPrev[index].imagenPreview.map((item) =><img src={item} className="w-40 h-40 border-2 border-black mr-2"></img>)}  
              </div>
            :
              //en caso de ser false anadirImagen no se muestra nada
              null
          }
        </div>

        
        <div>
          {
            formPrev[index].tipoPregunta === 'Respuesta corta' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} type="text" onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)} placeholder={formPrev[index].respuesta}/>
          }
          {
            formPrev[index].tipoPregunta === 'Respuesta larga' && <textarea  className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} rows={3} onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)} placeholder={formPrev[index].respuesta}/>
          } 
          {
            formPrev[index].tipoPregunta === 'Fecha' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="date" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)}/> 
          }
          {
            formPrev[index].tipoPregunta === 'Hora' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="time" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)}/> 
          }
          {
            formPrev[index].tipoPregunta === 'Respuesta numerica' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} type="number" onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)} placeholder={formPrev[index].respuesta}/>
          }
          {
            formPrev[index].tipoPregunta === 'Respuesta unica' && 
            <div className="mt-2 text-center ">

              <div>
                <select required={formPrev[index].obligatorio} disabled={formPrev[index].disabled} className="cursor-pointer rounded-lg border-2 border-black" onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)}>
                  <option value="none" defaultValue></option>
                  {formPrev[index].list.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="mt-2">
                {
                  formPrev[index].anadirOtro
                  ?
                  <div>
                    <label className='text-xs md:text-base lg:text-base mt-2 rounded-md '> {formPrev[index].contenidoOtro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  border-2 border-black" type="text" placeholder="introduce tu otra respuesta" />                            
                  </div>
                  :
                    null
                }
              </div>

            </div>
          }
          {
            formPrev[index].tipoPregunta === 'Escala' && 
            <div className="mt-2 flex flex-row flex-wrap justify-start ml-5">
              {formPrev[index].list.map((item) => <label className="mr-7" ><input disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} type="radio" name={formPrev[index].contadorEscalaTextual} value={item} onChange={(e) => asignarRespuestaSimple(e, formPrev[index].id)  } label={item}/> {item} </label>)}
            </div>
          }
          {
            formPrev[index].tipoPregunta === 'Respuesta multiple' && 
            <div className="mt-4 flex-1 justify-center ml-5 flex-wrap">
              {formPrev[index].list.map((item) => <label className="mr-7"><input disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} id={item} className="rounded-xl form-checkbox h-4 w-4 cursor-pointer" onChange={(e) => calcularIndiceMultiple(e.target.value, formPrev[index].id)} type="checkbox" name="respuestaMultiple" value={item} label={item}/> {item} </label>)}
              {
                formPrev[index].anadirOtro
                ?
                <div>
                  <label className='text-xs md:text-base lg:text-base mt-2 rounded-md'> {formPrev[index].contenidoOtro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  " type="text" placeholder="introduce tu otra respuesta" />                            
                </div>                            
                :
                  null
              }
            </div>
          }
        </div>

      </div>

      <div className="ml-6 text-center">

          <button className={!controladorAnterior ? "bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md mt-2" : "bg-gray-400 hover:bg-gray-300 items-center p-1 text-sm text-white rounded-md mt-2"} disabled={controladorAnterior} onClick={() => {anteriorPregunta(); resetTimer()}}> Anterior</button>
          <button className={!controladorSiguiente ? "bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md mt-2 ml-6" : "bg-gray-400 hover:bg-gray-300 items-center p-1 text-sm text-white rounded-md mt-2 ml-6"} disabled={controladorSiguiente} onClick={() => {siguientePregunta(); guardarTimer()}}> Siguiente</button>
          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md ml-6 mt-2" onClick={() => {guardarTimer();resetTimer()}}> submit</button>

      </div>
  </div>
  
  );

}

export default Previsualizacion;