import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePreguntas, useExport } from '../hooks';
import ExportarPregunta from './ExportarPregunta';
import { CSVDownload, CSVLink } from 'react-csv';
import swal from 'sweetalert2'


function ExportarDatos(){

  let {id} = useParams();
  const navigate = useNavigate();
  const {dataGetPreguntas}  = usePreguntas(id);
  const [preguntaContent, setPreguntaContent] = useState();
  const [executed, setExecuted] = useState(true);
  const [seleccionExportar, setSeleccionExportar] = useState(0);
  const [estadoBotones, setEstadoBotones] = useState(false);
  
  const {obtenerFormularioCSV}  = useExport();
  const [controlador, setControlador] = useState(false);
  const [resultadoQuery, setResultadoQuery] = useState();

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
    if(executed){
      setPreguntaContent(dataGetPreguntas);
      if(preguntaContent && preguntaContent.length > 0){
        setExecuted(false);
      }
    }    

  }, [dataGetPreguntas,executed,preguntaContent]);



  const handleExportarFormulario = () => {
    let respuesta;

    try {
      respuesta = obtenerFormularioCSV(id);
      console.log(respuesta);
    } catch (err) {
      alert(err);
    }

    
    respuesta.then(function(value) {
      setResultadoQuery(value);
      setControlador(true);
    }, function(reason) {
      console.log(reason); // Error!
    });

  }
  

  return(
    <div className="bg-indigo-300 ">
      <div className="flex justify-center h-screen w-screen items-center ">
        <div className="w-full sm:w-2/3 md:w-3/4 lg:w-1/3 flex flex-col items-center justify-center border-2 bg-white" >
          
          <h3 className="text-xl font-bold leading-none text-black mt-6">EXPORTAR DATOS DEL FORMULARIO {id}</h3>
          
          <div className='mt-4 mb-2'>
            <button className="inline-flex bg-gray-800 hover:bg-gray-700 items-center p-2 lg:p-3 md:p-3 text-sm text-white rounded-md mr-2" disabled={estadoBotones} onClick={() => {handleExportarFormulario(); setSeleccionExportar(1); setEstadoBotones(true)}} >Exportar formulario</button>
            <button className="inline-flex bg-gray-800 hover:bg-gray-700 items-center p-2 lg:p-3 md:p-3 text-sm text-white rounded-md" disabled={estadoBotones} onClick={() => {setSeleccionExportar(2); setEstadoBotones(true)}}>Exportar preguntas</button>
          </div>

          {
            seleccionExportar === 0 && <p className='mb-2'> Debes seleccionar una opción</p>
          }
          {
             controlador === true && 
              <div className="mt-3 flex flex-row flex-1 justify-center items-center w-full">
                <CSVDownload data={resultadoQuery} filename='my-file' target="_blank" />
                <p className="text-emerald-500">Archivo descargado</p>
              </div>
          }
          {
            seleccionExportar === 2 && <ExportarPregunta preguntas={preguntaContent} id={id}></ExportarPregunta>
          }

          <div className='flex w-full items-center justify-end '>
            <Link className='bg-gray-800 text-blue-50 hover:bg-gray-800 text-sm border border-slate-200 rounded-lg font-medium px-4 py-2 inline-flex space-x-1 items-center' to={'/formularios'}>Volver</Link>
          </div>
        </div>      
      </div>
    </div>
    )
    

}
export default ExportarDatos;