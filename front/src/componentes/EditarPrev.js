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
    let camposFormulario = [...formPrev];
    //se suma al anterior para contar el tiempo acumulado por si vuelven atrás
    camposFormulario[index].tiempo = camposFormulario[index].tiempo + time;
    setFormPrev(camposFormulario);
    console.log(formPrev);
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

    //comporbamos que exista una restriccion en la siguiente pregunta
    if(formPrev[a].anadirrestriccion === true){
      comprobarDisabled();
    }

    if(formPrev[a].anadirrespuestapregunta === true){
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

  const comprobarDisabled = () => {
    //hay que sumar uno a index por que no se actualiza a tiempo en la funcion siguientePregunta
    const idRestriccion = formPrev[index + 1].restriccionid;
    const respuestaRestriccion = formPrev[index + 1].restriccionrespuesta;

    const camposFormulario = [...formPrev];
    const indice = camposFormulario.findIndex(f => parseInt(f.id) === parseInt(idRestriccion));
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
    const idCompletar = formPrev[index + 1].anadirrespuestapreguntaid;
    const camposFormulario = [...formPrev];  
    const indice = camposFormulario.findIndex(f => parseInt(f.id) === parseInt(idCompletar));
    console.log("indice: " + indice)
    if(indice > -1){
      let respuestaFormulario = camposFormulario[indice].respuesta;
      //camposFormulario[index+1].nombrepregunta =  camposFormulario[index+1].nombrepregunta.replace('$',respuestaFormulario);
    }
    setFormPrev(camposFormulario);
  }



  return (
    <div>

      <div className="mb-2">
        <p className="text-2xl md:text-4xl lg:text-4xl text-center w-full mb-2 rounded-lg font-bold ">{titulo}</p>
        <p className="text-lg md:text-2xl lg:text-2xl text-black text-center font-semibold">{descripcion}</p>
      </div>
      
      <div className="border-2 border-black rounded-lg ml-6 mr-6 mt-6 mb-1 p-2 bg-slate-300">
        <div className="ml-1 text-left">
          <p className="text-sm md:text-xl lg:text-xl ">tiempo: {time}</p>
          <p className="text-sm md:text-xl lg:text-xl ">tiempo anterior: {formPrev[index].tiempo}</p>
        </div>

        <div>
          <p className="text-sm md:text-xl lg:text-xl ">{formPrev[index].nombrepregunta}</p>
          {
          formPrev[index].obligatorio ? <span className="text-red-900 ml-2">* obligatoria</span> : <span className="text-red-900"> </span>
          }
        </div>
        {/******************************************** */}

        <div >
          {
            //si se pulsa el boton de añadir imagen, el atributo anadirimagen se cambia a true y muestra el menu de añadir imagen
            formPrev[index].anadirimagen
            ?
              <div className="mt-2 flex flex-row text-center">
                {/* se muestra el archivo seleccionado*/}
                {formPrev[index].imagenpreview.map((item) =><img src={item} className="w-40 h-40 border-2 border-black mr-2"></img>)}  
              </div>
            :
              //en caso de ser false anadirimagen no se muestra nada
              null
          }
        </div>

        <div>
          {
            formPrev[index].tipopregunta === 'Respuesta corta' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} type="text"  placeholder={formPrev[index].respuesta}/>
          }
          {
            formPrev[index].tipopregunta === 'Respuesta larga' && <textarea  className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} rows={3}  placeholder={formPrev[index].respuesta}/>
          } 
          {
            formPrev[index].tipopregunta === 'Fecha' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="date" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} /> 
          }
          {
            formPrev[index].tipopregunta === 'Hora' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="time" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} /> 
          }
          {
            formPrev[index].tipopregunta === 'Respuesta numerica' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} type="number"  placeholder={formPrev[index].respuesta}/>
          }
          {
            formPrev[index].tipopregunta === 'Respuesta unica' && 
            <div className="mt-2 text-center">
            
              <div>
                <select required={formPrev[index].obligatorio} disabled={formPrev[index].disabled} className="cursor-pointer rounded-lg border-2 border-black" >
                  <option value="none" defaultValue></option>
                  {formPrev[index].list.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
          
              <div className="mt-2">
                {
                  formPrev[index].anadirotro
                  ?
                  <div>
                    <label className='text-xs md:text-base lg:text-base mt-2 rounded-md'> {formPrev[index].contenidootro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  border-2 border-black" type="text" placeholder="introduce tu otra respuesta" />                            
                  </div>
                  :
                    null
                }
              </div>
              
            </div>
          }
          {
            formPrev[index].tipopregunta === 'Escala' && 
            <div className="mt-2 flex flex-row flex-wrap flex-1 justify-center ml-5">
              {formPrev[index].list.map((item) => <label className="mr-7" ><input disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} type="radio" name={formPrev[index].contadorescalatextual} value={item} label={item}/> {item} </label>)}
            </div>
          }
          {
            formPrev[index].tipopregunta === 'Respuesta multiple' && 
            <div className="mt-4 flex-1 justify-center ml-5 flex-wrap">
              {formPrev[index].list.map((item) => <label className="mr-7"><input disabled={formPrev[index].disabled} required={formPrev[index].obligatorio} id={item} className="rounded-xl form-checkbox h-4 w-4 cursor-pointer"  type="checkbox" name="respuestamultiple" value={item} label={item}/> {item} </label>)}
              {
                formPrev[index].anadirotro
                ?
                <div>
                  <label className='text-xs md:text-base lg:text-base mt-2 rounded-md'> {formPrev[index].contenidootro} </label>  <input className="text-xs md:text-base lg:text-base mt-2 rounded-md  " type="text" placeholder="introduce tu otra respuesta" />                            
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