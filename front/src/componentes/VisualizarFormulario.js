import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePreguntas, useFormulario } from "../hooks";
import { useState, useEffect } from "react";
import swal from 'sweetalert2'

function VisualizarFormulario(){

    const navigate = useNavigate();
    let {id} = useParams();

    console.log(id)

    const [executed, setExecuted] = useState(true);
    const [executedForm, setExecutedForm] = useState(true);
    const [preguntaContent, setPreguntaContent] = useState();
    const [formulario, setFormulario] = useState();

    const {dataGetPreguntas}  = usePreguntas(id);
    const { dataGetFormulariosExacto}  = useFormulario(id);

    console.log(id);

    useEffect(() => {
        const loggedUser = window.localStorage.getItem("loggedUser");
        //SOLO si no existe la sesion vuelve a casa 
        if(loggedUser === null){
          navigate("/");
        }else{
          const sesionJson = JSON.parse(loggedUser);
          if(sesionJson.rol !== "administrador"){
            navigate("/");
            swal.fire("No tienes formularios para responder","","info");
          }
        }
      }, [navigate]);
    
    useEffect(() => {
      if(executed){
        setPreguntaContent(dataGetPreguntas);
        if(preguntaContent && preguntaContent.length > 0){
          setExecuted(false);
        }
      }    
    }, [dataGetPreguntas,executed,preguntaContent]);

    useEffect(() => {
      if(executedForm){
          setFormulario(dataGetFormulariosExacto);
          if(formulario && formulario.length >= 0){
            setExecutedForm(false);
          }
      }
    }, [dataGetFormulariosExacto, formulario, executedForm]);
    

    return(
        <div className='w-full bg-indigo-300 h-full text-center'>
            <div className="justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="mt-0 w-full md:w-5/6 md:mt-12 lg:w-4/6 lg:mt-12 border-4 border-black  p-2 text-start">
                      
                    <Link className=" bg-gray-800 hover:bg-gray-700 p-2 lg:p-3 md:p-3 text-sm text-white rounded-md ml-2 float-right" to={'/formularios'}> Volver </Link>

                    {
                        (formulario && formulario.length > 0) && formulario.map((campos) => {
                            return (
                                <div className="mb-2">
                                    <p className="text-2xl md:text-3xl lg:text-4xl text-center w-full mb-2 rounded-lg font-bold">{campos.titulo}</p>
                                    <p className="text-lg md:text-2xl lg:text-2xl text-black text-center font-semibold">{campos.descripcion}</p>
                                </div>
                            )
                        })
                    }

                    {
                        (preguntaContent && preguntaContent.length > 0) && preguntaContent.map((campos) => {
                            return (

                                <div className="border-2 border-black rounded-lg ml-6 mr-6 mt-6 mb-1 p-2 bg-slate-300">
                                    <div className="flex flex-row justify-start text-left">
                                        <p className="text-sm md:text-xl lg:text-xl ">{campos.nombrepregunta}</p>
                                        {
                                          campos.obligatorio ? <span className="text-red-900 ml-2 text-sm md:text-xl lg:text-xl">* obligatoria</span> : <span> </span>
                                        }
                                    </div>

                                    <div>
                                        {
                                        //si se pulsa el boton de añadir imagen, el atributo anadirimagen se cambia a true y muestra el menu de añadir imagen
                                          campos.anadirimagen
                                          ?
                                            <div className="mt-2 flex flex-row text-center">
                                              {/* se muestra el archivo seleccionado*/}
                                              {campos.imagenpreview.map((item) =><img src={item} className="w-40 h-40 border-2 border-black mr-2" alt='imagen'></img>)}  
                                            </div>
                                          :
                                            //en caso de ser false anadirimagen no se muestra nada
                                            null
                                        }
                                    </div>



                                    <div>
                                        {
                                          campos.tipopregunta === 'Respuesta corta' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md  block w-full" disabled={campos.disabled} required={campos.obligatorio} type="text"  value={campos.respuestamultiple[0]}/>
                                        }
                                        {
                                          campos.tipopregunta === 'Respuesta larga' && <textarea  className="text-xs md:text-base lg:text-base mt-2 w-full" disabled={campos.disabled} required={campos.obligatorio} rows={3} value={campos.respuestamultiple[0]}/>
                                        } 
                                        {
                                          campos.tipopregunta === 'Fecha' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="date" disabled={campos.disabled} required={campos.obligatorio} /> 
                                        }
                                        {
                                          campos.tipopregunta === 'Hora' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" type="time" disabled={campos.disabled} required={campos.obligatorio} /> 
                                        }
                                        {
                                          campos.tipopregunta === 'Respuesta numerica' && <input className="text-xs md:text-base lg:text-base mt-2 rounded-md block w-full" disabled={campos.disabled} required={campos.obligatorio} type="number"  value={campos.respuestamultiple[0]}/>
                                        }
                                        {
                                          campos.tipopregunta === 'Respuesta unica' && 
                                          <div className="mt-2 text-center">
                                            <div>
                                              <select required={campos.obligatorio} disabled={campos.disabled} className="cursor-pointer rounded-lg border-2 border-black" >
                                                <option value={campos.respuestamultiple[0]} defaultValue>{campos.respuestamultiple[0]}</option>
                                                {campos.list.map((item) => <option key={item} value={item}>{item}</option>)}
                                              </select>
                                            </div>          
                                            <div className="mt-2">
                                              {
                                                campos.anadirotro
                                                ?
                                                  <div>
                                                    <label className='text-xs md:text-base lg:text-base mt-2 rounded-md '> {campos.contenidootro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  border-2 border-black" type="text" placeholder="introduce tu otra respuesta" />                            
                                                  </div>
                                                :
                                                  null
                                              }
                                            </div>
                                          
                                          </div>
                                        }
                                        {
                                          campos.tipopregunta === 'Escala' && 
                                          <div className="mt-2 flex flex-row flex-wrap flex-1 justify-center ml-5">
                                            {campos.list.map((item) =>
                                            <label className="mr-7" >
                                              {
                                                //al darle a volver atras que marque la marcada antes
                                                item === campos.respuestamultiple[0]
                                                ?
                                                  <input className='text-xs md:text-base lg:text-base' disabled={campos.disabled} checked required={campos.obligatorio} type="radio" name={campos.contadorescalatextual} value={item}  label={item}/>
                                                :
                                                  <input className='text-xs md:text-base lg:text-base' disabled={campos.disabled}  required={campos.obligatorio} type="radio" name={campos.contadorescalatextual} value={item} label={item}/>
                                              }
                                              {item} 
                                            </label>)}
                                          </div>
                                        }
                                        {
                                          campos.tipopregunta === 'Respuesta multiple' &&
                                          <div className="mt-4 flex-1 justify-center ml-5">
                                            {campos.list.map((item, indice) =>

                                              <label className="mr-7">
                                                <input disabled={campos.disabled} checked={campos.listmultiple[indice] === "false" ? false : true }  required={campos.obligatorio} id={item} className="text-xs md:text-base lg:text-base rounded-xl form-checkbox h-4 w-4 cursor-pointer"  type="checkbox" name="respuestamultiple" value={item} label={item}/>
                                                {item} 
                                              </label>

                                            )}

                                            {
                                              campos.anadirotro
                                              ?
                                                <div className='flex flex-row'>
                                                  <div>
                                                    <label className='text-xs md:text-base lg:text-base mt-2 rounded-md'> {campos.contenidootro} </label>  <input className=" text-xs md:text-base lg:text-base mt-2 rounded-md  " type="text" placeholder="introduce tu otra respuesta" />                            
                                                  </div>
                                                </div>           
                                              : 
                                                null
                                            }

                                            <div className='flex flex-col mt-2' >
                                              {
                                                (-1*(campos.marcadasmultiple - campos.maxmultiple)) >= 0
                                                ?
                                                <p>Aún puedes marcar {-1*(campos.marcadasmultiple - campos.maxmultiple)} opción/es</p>
                                                :
                                                <p className='text-xs md:text-base lg:text-base text text-red-600'>Debes desmarcar {-1*(campos.marcadasmultiple - campos.maxmultiple) } opción/es </p>
                                              }

                                            </div>
                                          </div>
                                        }
                                    </div>
                                    
                                </div>
                                
                            )
                        })
                    }

                    

                    </div>
                </div>
            </div>
        </div>
    )

}

export default VisualizarFormulario;