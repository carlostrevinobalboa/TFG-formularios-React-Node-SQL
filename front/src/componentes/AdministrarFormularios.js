import { Link, useNavigate } from "react-router-dom";
import { useFormulario } from "../hooks";
import { useState, useEffect } from "react";
import swal from 'sweetalert2'




function AdministrarFormularios(){

  
  const navigate = useNavigate();
  const {dataGetFormulario,dataGetFormularioMaxId, create, deleteFormulario, updateEstadoFormulario}  = useFormulario(0);
  const fechaAux = new Date();
  const fecha = formatoFecha(fechaAux,'dd-mm-yyyy');
  const [formContent, setFormContent] = useState();


  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    //SOLO si no existe la sesion vuelve a login
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
      if(dataGetFormulario.length > 0){
        setFormContent(dataGetFormulario);
    }
  }, [dataGetFormulario]);



  const crearFormulario = async () => {
    let controller;
    
    if(dataGetFormularioMaxId[0].max === null){
        try {
            controller  = await create({
                id: 0,
                fecha: fecha,
                //administrador: sesionUser,
                colgado: "false",
            })
          } catch (err) {
            alert(err);
          }
    }else{
        try {
            controller = await create({
                id: dataGetFormularioMaxId[0].max + 1,
                fecha: fecha,
                //administrador: sesionUser,
                colgado: "false",
            })
          } catch (err) {
            alert(err);
          }
    }

    if(controller === false){
      navigate("/");
    }
  }

  const crearFormularioDuplicado = async () => {
    let controller;
    try {
      controller = await create({
        id: dataGetFormularioMaxId[0].max + 1,
        fecha: fecha,
        //administrador: sesionUser,
      })
      if(controller === false){
        navigate("/");
      }
    } catch (err) {
      alert(err);
    }
  }

  const eliminarFormulario = async (id) => {
    let controller;
    try {
      controller = await deleteFormulario({
          id: id,
      })
      if(controller === true){
        setFormContent(formContent.filter(item => item.id !== id))
      }else{
        navigate("/");
      }
    } catch (err) {
      alert("error: " + err);
    }
  }

  function formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yyyy: fecha.getFullYear()
    }
    return formato.replace(/dd|mm|yyyy/gi, matched => map[matched])
  }

  function handleEstadoFormularioColgar(formulario){
    for(let i=0; i<formContent.length; i++){
      if(formContent[i].id === formulario.id){
        updateFormColgar(formulario);
      }
    }
  }

  function handleEstadoFormularioDescolgar(formulario){
    for(let i=0; i<formContent.length; i++){
      if(formContent[i].id === formulario.id){
        updateFormDescolgar(formulario);
      }
    }
  }

  const updateFormColgar = async (formulario) => { 
    let controller;

      try {
        controller = await updateEstadoFormulario({
          id: formulario.id,
          colgado: true,
        })

        if(controller === false){
          swal.fire('ERROR al colgar el formulario','','error');
        }else{
          
          swal.fire('Formulario colgado con exico','','success');

          const camposFormulario = [...formContent];  
          const index = camposFormulario.findIndex(f => f.id === formulario.id);
          if(index > -1){
            camposFormulario[index].colgado = true;
          }
          setFormContent(camposFormulario); 

        }

      } catch (err) {
        alert("error: " + err);
      }

  }

  const updateFormDescolgar = async (formulario) => { 
    let controller;

      try {
        controller = await updateEstadoFormulario({
          id: formulario.id,
          colgado: false,
        })

        if(controller === false){
          swal.fire('ERROR al descolgar el formulario','','error');
        }else{
          
          swal.fire('Formulario descolgado con exico','','success');

          const camposFormulario = [...formContent];  
          const index = camposFormulario.findIndex(f => f.id === formulario.id);
          if(index > -1){
            camposFormulario[index].colgado = false;
          }
          setFormContent(camposFormulario); 

        }

      } catch (err) {
        alert("error: " + err);
      }

  }

  const handleEditarFormulario = (formulario) => {
    navigate('/formularios/'+formulario);
  }

  const handleExportarDatos = (idFormulario) => {
    navigate('/ExportarDatos/'+idFormulario)
  }

  const handleVisualizarFormulario = (idFormulario) => {
    navigate('/visualizarFormulario/'+idFormulario)
  }

  const handleCerrarSesion = () => {
    localStorage.clear();
  }


  return(

    

    <div className="bg-indigo-300 ">

      <div className="flex flex-col justify-center h-screen w-screen items-center ">

        <div className="bg-slate-400 flex items-end justify-end">
          <Link className="bg-black text-white hover:bg-gray-600 text-sm border rounded-lg font-medium px-4 py-2 space-x-1 " onClick={handleCerrarSesion} to={'/'}  > Cerrar sesión </Link>
        </div>

        <div className="w-full lg:w-2/4 md:w-4/5 sm:w-11/12 mx-auto flex flex-col items-center border-2 bg-white" >
          
          <h3 className="text-xl font-bold leading-none text-black mt-6">TUS FORMULARIOS</h3>

            <div className="flow-root  mt-6 mb-6 w-full">
              <ul className="divide-y divide-gray-200">
                  
                {
                  (formContent && formContent.length > 0) && formContent.map((formularios) => 

                    <li className="py-2 ">
                      <div className="flex flex-col items-center justify-center">

                        <div className="flex flex-col items-center justify-center w-auto">
                          
                          <p className="text-sm sm:text-sm truncate font-medium text-black">
                            Título: {formularios.titulo}  
                          </p>
                          <p className="text-sm  sm:text-sm truncate text-black">
                            Id: {formularios.id}
                          </p>
                        </div>

                        <div className="rounded-md shadow-sm">

                          <button className="text-black text-sm sm:text-sm bg-white hover:bg-slate-200 border border-slate-400 rounded-l-lg font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0  inline-flex space-x-1 items-center" onClick={() => handleVisualizarFormulario(formularios.id)}>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </span>
                            <span>Visualizar</span>
                          </button>

                          <button className={formularios.colgado ? "text-orange-300 text-sm sm:text-sm bg-white hover:bg-slate-200 border border-slate-400 font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center" : "text-orange-500 text-sm bg-white hover:bg-slate-200 border border-slate-400  font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center"} disabled={formularios.colgado} onClick={() => handleEditarFormulario(formularios.id)}>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </span>
                            <span>Editar</span>
                          </button>
                          {
                            dataGetFormularioMaxId && dataGetFormularioMaxId.length > 0  && dataGetFormularioMaxId[0].max !== null
                            ?
                              <Link className="text-black  text-sm sm:text-sm bg-white hover:bg-slate-200 border-y border-slate-400 font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center" onClick={crearFormularioDuplicado} to={"/duplicarFormulario/"+ formularios.id  +"/" + (dataGetFormularioMaxId[0].max + 1) }>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 130 130" strokeWidth="6" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" />
                                </svg>                      
                              </span>
                              <span>Duplicar</span>
                            </Link>
                            :
                            <Link className="text-black  text-sm sm:text-sm bg-white hover:bg-slate-200 border-y border-slate-400 font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center">
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 130 130" strokeWidth="6" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" />
                                </svg>                      
                              </span>
                              <span>Duplicar desabled</span>
                            </Link>
                          }
                          <button className="mr-3 text-red-600 text-sm sm:text-sm bg-white hover:bg-slate-200 border border-slate-400 rounded-r-lg font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center" onClick={() => eliminarFormulario(formularios.id)}>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </span>
                            <span>Borrar</span> 
                          </button>
                          {
                            formularios.colgado === false
                            ?
                            <button className="mr-3 text-sm sm:text-sm bg-white hover:bg-slate-200 border border-slate-400 rounded-r-lg rounded-l-lg font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center" onClick={() => handleEstadoFormularioColgar(formularios)}>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 520 520" strokeWidth="40" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M24.983 197.869h16.918v-39.203c0-43.387 17.107-82.959 44.667-111.698C114.365 18 152.726 0 194.998 0c42.259 0 80.652 17.981 108.41 46.968 27.58 28.739 44.692 68.292 44.692 111.698v39.203h16.917c13.738 0 24.983 11.245 24.983 24.984v263.978c0 13.739-11.245 24.984-24.983 24.984H24.983C11.226 511.815 0 500.57 0 486.831V222.853c-.013-13.739 11.226-24.984 24.983-24.984zm149.509 173.905l-26.968 70.594h94.923l-24.966-71.573c15.852-8.15 26.688-24.67 26.688-43.719 0-27.169-22.015-49.169-49.184-49.169-27.153 0-49.153 22-49.153 49.169-.016 19.826 11.737 36.905 28.66 44.698zM89.187 197.869h211.602v-39.203c0-30.858-12.024-58.823-31.376-79.005-19.147-19.964-45.49-32.368-74.428-32.368-28.925 0-55.288 12.404-74.422 32.368-19.37 20.182-31.376 48.147-31.376 79.005v39.203z" />
                                </svg>
                              </span>
                              <span>Privado</span> 
                            </button>
                            :
                            <button className="mr-3 text-sm sm:text-sm bg-white hover:bg-slate-200 border border-slate-400 rounded-r-lg rounded-l-lg font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center" onClick={() => handleEstadoFormularioDescolgar(formularios)}>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 130 130" strokeWidth="10" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.89,56h9V37.12a37,37,0,0,1,10.9-26.21h0a37,37,0,0,1,52.42,0h0a37,37,0,0,1,10.9,26.21V38H71.66V36.91a22.68,22.68,0,0,0-6.66-16h0a22.69,22.69,0,0,0-38.72,16V56h67a2.9,2.9,0,0,1,2.89,2.89V120a2.9,2.9,0,0,1-2.89,2.89H2.89A2.9,2.9,0,0,1,0,120V58.93A2.9,2.9,0,0,1,2.89,56ZM49.15,89.45l4.58,21.14-12.56,0,3.69-21.42a8.51,8.51,0,1,1,4.29.23Z" />
                                </svg>
                              </span>
                              <span>Publico</span> 
                            </button>
                          }
                            <button className="mr-3 text-blue-500 text-sm sm:text-sm bg-white hover:bg-slate-200 border border-slate-400 rounded-r-lg rounded-l-lg font-medium lg:px-4 lg:py-2 md:px-4 md:py-2 sm:py-0 sm:px-0 inline-flex space-x-1 items-center" onClick={() => handleExportarDatos(formularios.id)}>
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="250 0 200 400" strokeWidth="23" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M176 272l80 80 80-80M256 48v288" />
                                </svg>
                              </span>
                              <span>Exportar</span> 
                            </button>

                        </div>
                      </div>
                    </li>
                  )
                }
              </ul>
            </div>

            {
              dataGetFormularioMaxId && dataGetFormularioMaxId.length > 0  && dataGetFormularioMaxId[0].max !== null  
              ?
              <div className="mb-6 rounded-md shadow-sm">
                <Link className="bg-blue-400 text-blue-50 hover:bg-blue-700 text-sm border border-slate-200 rounded-lg font-medium px-4 py-2 inline-flex space-x-1 items-center" onClick={crearFormulario} to={'/crearFormulario/'+ (dataGetFormularioMaxId[0].max + 1)} > Nuevo formulario </Link>
              </div>
              :
              <div className="mb-6 rounded-md shadow-sm">
                <Link className="bg-blue-400 text-blue-50 hover:bg-blue-700 text-sm border border-slate-200 rounded-lg font-medium px-4 py-2 inline-flex space-x-1 items-center" onClick={crearFormulario} to={'/crearFormulario/'+ 0} > Nuevo formulario </Link>
              </div>
            }

        </div>
      </div>


    
    </div>
  )
}

export default AdministrarFormularios;