import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useExport } from "../hooks";
import { CSVDownload, CSVLink } from 'react-csv';

function ExportarPregunta({preguntas,id}){

  const [preguntasMarcadas, setPreguntasMarcadas] = useState([]);
  const [controlador, setControlador] = useState(false);
  const [controladorPreguntas, setControladorPreguntas] = useState(true);
  const [resultadoQuery, setResultadoQuery] = useState();
  const {obtenerCSV}  = useExport();

  const handleExportar = () => {
      let respuesta;

      console.log("entramos en el handle");
      try {
        console.log("entramos en el try");
        respuesta = obtenerCSV(id,preguntasMarcadas);
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



  const handleAnadirPregunta = () => {
    let valor = document.getElementById("selectPreguntas").value;

    if(preguntasMarcadas.filter(p => valor === p).length === 0){
      setPreguntasMarcadas([...preguntasMarcadas, valor]);
    }

    console.log(preguntasMarcadas);
  } 

  const handleEliminarPregunta = () => {
    let valor = document.getElementById("selectPreguntas").value;
    let index = -1;
    index = preguntasMarcadas.indexOf(valor);
    
    if(index !== -1 ){
      preguntasMarcadas.splice(index,1);
      setPreguntasMarcadas([...preguntasMarcadas]);
    }

    console.log(preguntasMarcadas);
  }



  return(
      <div className="mt-2 mb-4 flex flex-col justify-center">
      
        <div className="lg:flex lg:flex-row md:flex md:flex-row flex flex-col justify-center items-center w-full">

          <select className="cursor-pointer rounded-lg border-2 border-black " id="selectPreguntas">
            {preguntas.map((item) =><option key={item.id} value={item.id}>{ item.id } - {item.nombrepregunta}</option>)}
          </select>

          <button className="ml-3 text-sm lg:mt-0 md:mt-0 mt-2 bg-red-500 hover:bg-red-700 border border-slate-400 rounded-r-lg rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1" onClick={() => handleEliminarPregunta()}>
            <FontAwesomeIcon className="text-white" icon={faMinus}/>
          </button>

          <button className="ml-3 text-sm lg:mt-0 md:mt-0 mt-2 bg-emerald-500 hover:bg-emerald-700 border border-slate-400 rounded-r-lg rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1" onClick={() => handleAnadirPregunta()}>
            <FontAwesomeIcon className="text-white" icon={faPlus}/>
          </button>



        </div>


        <div className="mt-3 flex flex-row flex-1 justify-center items-center w-full">
  
          <h2>Preguntas marcadas: &nbsp; </h2>

          {preguntasMarcadas.map((element, index) => (
            <p key={index}> {element} &nbsp; </p> 
          ))}
        
        </div>

        {
          controlador === true
          ?
            <div className="mt-3 flex flex-row flex-1 justify-center items-center w-full">
              <CSVDownload data={resultadoQuery} filename='my-file' target="_blank" /> 
              <p className="text-emerald-500">Archivo descargado</p>
            </div>
          :
            <div className=" flex flex-row flex-1 justify-center items-center w-full">
              <button className=" w-1/2  mt-3 text-sm bg-blue-400 text-blue-50 hover:bg-blue-700 border border-slate-400 rounded-r-lg rounded-l-lg font-medium px-2 py-1 inline-flex space-x-1 justify-center items-center " onClick={() => handleExportar()}> Exportar </button>
            </div>
        }

      </div>

    )
}

export default ExportarPregunta;

