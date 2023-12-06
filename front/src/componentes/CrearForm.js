import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Previsualizacion from "./Previsualizacion";
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { usePreguntas, useFormulario } from "../hooks";
import swal from 'sweetalert2'


function CrearFormulario(){

    const navigate = useNavigate();
    
    const [tituloForm, setTituloForm] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [ocultar, setOcultar] = useState(false);

    const [numeroPreguntas,setNumeroPreguntas] = useState(0);

    const [contIdPregunta, setContIdPregunta] = useState(0);
    const [contRadioTextual, setContRadioTextual] = useState(0);

    const [valorSelect, setValorSelect] = useState("");
    const [valorEscalaTextual, setValorEsacalaTextual] = useState("");
    const [valorMultipleSeleccionado, setValorMultipleSeleccionado] = useState("");
    
    const [formContent, setFormContent] = useState([]);  //unoica escala multiple

    const [textFieldUnica, setTextFieldUnica] = useState("");
    const [textFieldEscala, setTextFieldEscala] = useState("");
    const [textFieldMultiple, setTextFieldMultiple] = useState("");
    const [textFieldMaxMultiple, setTextFieldMaxMultiple] = useState("");

    const [idPreguntas, setIdPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);

    const {id} = useParams();
    
    const { create}  = usePreguntas(id);
    const { updateFormulario}  = useFormulario(id);

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

    
    //--------------------------------------- BASE DE DATOS ----------------------------------------------------------

    const guardarDatos = () =>{

      let preguntaSinTitulo = false;
      //comprobamos que todas tengan un titulo
      for(let i=0; i<formContent.length; i++){
        if(formContent[i].nombrePregunta === ""){
          preguntaSinTitulo = true;
        }
      }

      if(preguntaSinTitulo === true){

        swal.fire('Error. Todas las preguntas deben tener un titulo', '', 'error');

      }else{

        for(let i=0; i<formContent.length; i++){
          insertPreguntas(formContent[i]);
        }
  
        updateForm();

        navigate("/formularios")
        swal.fire('Formulario guardado!', '', 'success');
      }
    }

    const updateForm = async () => { 
      try {
        await updateFormulario({
          titulo: tituloForm,
          descripcion: descripcion,
          id: id,
        })
      } catch (err) {
        alert("error: " + err);
      }
    }

    const insertPreguntas = async (campos) => {
      try {
        await create({
          id: campos.id,
          nombrePregunta: campos.nombrePregunta,
          etiqueta: campos.etiqueta,
          tipoPregunta: campos.tipoPregunta,
          respuesta: campos.respuesta,
          respuestaMultiple: campos.respuestaMultiple,
          list: campos.list,
          listMultiple: campos.listMultiple,
          maxMultiple: campos.maxMultiple,
          MarcadasMultiple: campos.MarcadasMultiple,
          obligatorio: campos.obligatorio,
          contadorEscalaTextual: campos.contadorEscalaTextual,
          anadirImagen: campos.anadirImagen,
          imagen: campos.imagen,
          imagenPreview: campos.imagenPreview,
          anadirOtro: campos.anadirOtro,
          contenidoOtro: campos.contenidoOtro,
          anadirRestriccion: campos.anadirRestriccion,
          restriccionId: campos.restriccionId,
          restriccionRespuesta: campos.restriccionRespuesta,
          anadirRespuestaPregunta: campos.anadirRespuestaPregunta,
          anadirRespuestaPreguntaId: campos.anadirRespuestaPreguntaId,
          disabled: campos.disabled,
          tiempo: campos.tiempo,
          formulario: id,
        })
      } catch (err) {
        alert("error: " + err);
      }
    }

    //---------------------------------PREGUNTAS----------------------------------------------------------------------------------------------------------------


    //estructura de cada pregunta que almacena todos sus valores (si cuenta con ellos)
    const anadirPregunta = () => {

      setNumeroPreguntas(numeroPreguntas + 1);
      //funcion que aumenta en uno el valor del state "contIdPregunta" para asignarlo como id de la pregunta
      contadorIdPregunta();
      //idem anterior pero en esta ocasion para las preguntas de radio button de tipo texto
      contadorRadioTextual();

      //estructura de las preguntas que se almacena en la variable de estado "formContent". Esta variable contiene todas las preguntas del formulario
      const campos = {
        "id": `${contIdPregunta}`,
        "nombrePregunta": "",
        //etiqueta qeu va a servir para presentar las preguntas en cvs
        "etiqueta": "",
        "tipoPregunta": "", // "respuestaLarga", "numerico", "escala", "respuestaUnica", "multiple", "escala numerica", "fecha", hora
        "respuesta": "",
        respuestaMultiple: [],
        //lista con las opciones añadidas
        list: [],
        //lista para comprobar que opciones han sido marcadas cuando son preguntas de tipo checkbox, es una lista de booleanos
        listMultiple: [],
        //campo que indica el numero máximo de checkbox que pueden ser marcadas
        "maxMultiple": 0,
        //numero de checkbox que lleva marcado. Debe ser <= a maxMultiple
        "MarcadasMultiple": 0,
        //pregutna obligatoria (booleano)
        "obligatorio": false,
        //iden para las opciones de radio buton textuales
        "contadorEscalaTextual": `${contRadioTextual}`,
        //booleano para indicar si se quiere añadir imagen
        "anadirImagen": false,
        //array para almacenar las imágenes
        imagen:[],
        //array para mostrar la previsualizacion de la imagen
        imagenPreview: [],
        //booleano para indicar si se quiere añadir opcion otro
        "anadirOtro": false,
        //valor otro
        "contenidoOtro": "",
        //booleano para indicar si se quiere añadir restriccion
        "anadirRestriccion": false,
        //id y respuesta que genera restricciones
        "restriccionId": "",
        "restriccionRespuesta": "",
        //campo para habilitar completar titulos de preguntas con respuestas de otras
        "anadirRespuestaPregunta" : false,
        "anadirRespuestaPreguntaId": "",
        "disabled": false,
        "tiempo": 0
      };
      setFormContent([...formContent, campos]);
    };
      
    //funcion que recibe el nombre, el tipo y la lista de opciones para realizar una replica de la pregunta deseada
    //el funcionamiento de las funciones es el mismo que el explicado en anadirPregunta()
    const duplicarPregunta = (nombrePregunta,tipoPregunta,lista,listaMultilpe,multipleMax) => {

      setNumeroPreguntas(numeroPreguntas + 1);
      //funcion que aumenta en uno el valor del state "contIdPregunta" para asignarlo como id de la pregunta
      contadorIdPregunta();
      //idem anterior pero en esta ocasion para las preguntas de radio button de tipo texto
      contadorRadioTextual();

      let listaAux = [];
      listaAux = lista.slice();  
      let max = 0;
      let listMultipleAux = [];

      if(tipoPregunta === "Respuesta multiple"){
        max = multipleMax;
        listMultipleAux = listaMultilpe.slice();
      }

      const campos = {
        "id": contIdPregunta,
        "nombrePregunta": nombrePregunta,
        //etiqueta qeu va a servir para presentar las preguntas en cvs
        "etiqueta": "",
        "tipoPregunta": tipoPregunta, // "respuestaLarga", "numerico", "escala", "respuestaUnica", "multiple", "escala numerica", "fecha", ahora
        "respuesta": "",
        respuestaMultiple: [],
        //lista con las opciones añadidas
        list: listaAux,
        //lista para comprobar que opciones han sido marcadas cuando son preguntas de tipo checkbox, es una lista de booleanos
        listMultiple: listMultipleAux,
        //campo que indica el numero máximo de checkbox que pueden ser marcadas
        "maxMultiple": max,
        //numero de checkbox que lleva marcado. Debe ser <= a maxMultiple
        "MarcadasMultiple": 0,
        //pregutna obligatoria (booleano)
        "obligatorio": false,
        //iden para las opciones de radio buton textuales
        "contadorEscalaTextual": `${contRadioTextual}`,
        //booleano para indicar si se quiere añadir imagen
        "anadirImagen": false,
        //array para almacenar las imágenes
        imagen:[],
        //array para mostrar la previsualizacion de la imagen
        imagenPreview: [],
        //booleano para indicar si se quiere añadir opcion otro
        "anadirOtro": false,
        //valor otro
        "contenidoOtro": "",
        //booleano para indicar si se quiere añadir restriccion
        "anadirRestriccion": false,
        //id y respuesta que genera restricciones
        "restriccionId": "",
        "restriccionRespuesta": "",
        //campo para habilitar completar titulos de preguntas con respuestas de otras
        "anadirRespuestaPregunta" : false,
        "anadirRespuestaPreguntaId": "",
        "disabled": false,
        "tiempo": 0
      };
      setFormContent([...formContent, campos]);
    };


    //--------------------------------------ELIMINAR--------------------------------------------------------------------------------------------

    //recibiendo el id de la pregunta, esta es es eliminada de la variable de estado "formContent"
    const eliminarPregunta = (id) => {
      setNumeroPreguntas(numeroPreguntas - 1);
      setFormContent(formContent.filter((item) => item.id !== id));

      //se elimina el select de respuestas re restriccion
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === id);
      if(index > -1){
        setRespuestas([]);
      } 
    }

    //recibe la opcion seleccionada y la estructura de la pregunta actual para modificarla
    const eliminarOpcion = (campoSeleccionado, campos) => {
      //se selecciona el indice de la opcion seleccionada
      var index = campos.list.indexOf(campoSeleccionado);
      console.log(campos);
      console.log(campoSeleccionado);
      //se elimina el elemento de la lista
      campos.list.splice(index,1);
      //se añade el cambio a la variable estate formContent
      const aux = [...formContent];
      setFormContent(aux);
    }

    //idem que la anterior pero para las preguntas de opcion multiple
    const eliminarOpcionMultiple = (campoSeleccionado, campos) => {
      var index = campos.list.indexOf(campoSeleccionado);
      campos.list.splice(index,1);
      //además se elimina de la lista que comprueba que ceckbox se encuentran marcados
      campos.listMultiple.splice(index,1);
      const aux = [...formContent];
      setFormContent(aux);
    }


    //---------------------------------------AÑADIR-----------------------------------------------------------------------------

    //recibe el id de la pregunta, la y el valor del state y su correspondiente set
    const anadirOpcion = (campo, option, setOption) => {
      //siempre que no sea algo en blanco
      if(option !== ""){
        //se selecciona la pregunta actual
        const camposFormulario = [...formContent];
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //se añade la opcion a la lista de opciones
          camposFormulario[index].list.push(option);
          //se actualiza la variable de estado formContentw
          setFormContent(camposFormulario);
        } 
        setOption("");
      }
    }

    //se añade un checkbox a la pregunta y un campo de comprobacion de selecion a false (para comprobar el numero de marcadas)
    const anadirOpcionMultiple = (campo, option, setOption) => {
      if(option !== ""){
        const camposFormulario = [...formContent];
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          camposFormulario[index].list.push(option);
          camposFormulario[index].listMultiple.push("false");
          setFormContent(camposFormulario);
        } 
        setOption("");
      }
    }

    //recibe el id de la pregunta sobre la que se está trabajando y el valor de opciones marcadas a desear
    const anadirMaximoMultiple = (campos, valueMax) => {
      //se seleciona mediante el id la pregunta que se desea
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campos);
      if(index > -1){
        //se accede al campo maxMultiple y se le asigan el valor deseado
        camposFormulario[index].maxMultiple = valueMax;
        //se actualiza la variable de estado formContent
        setFormContent(camposFormulario);
      } 
      setTextFieldMaxMultiple("");
    }

    //se añade a la lista de imagenes la imagen seleccionada por el usuario y tambien a la lista de previsualización
    const anadirArchivoImagen = (campo,e) =>{
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        camposFormulario[index].imagen.push(e.target.files[0]);
        camposFormulario[index].imagenPreview.push(URL.createObjectURL(e.target.files[0]));
      }
      setFormContent(camposFormulario);

    }


    //---------------------------------------CONTADORES-----------------------------------------------------------------

    //funcion que aumenta en uno el valor del state "contIdPregunta" para asignarlo como id de la pregunta
    function contadorIdPregunta(){
      setContIdPregunta(contIdPregunta+1);  
    }

    //idem anterior pero en esta ocasion para las preguntas de radio button de tipo texto
    function contadorRadioTextual(){
      setContRadioTextual(contRadioTextual+1);  
    }


    //-------------------------------------EDITAR-----------------------------------------------------------------------



    //recibe el id de la pregunta y el nombre de la pregunta
    const editarCampoPregunta = (campo, contenidoCampo) => {
      //se selecciona la pregunta sobre la que se quiere trabajar
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //se asigna al campo nombrePregunta de la pregunta el nombre recibido por parametro
        camposFormulario[index].nombrePregunta = contenidoCampo;
        //se actualiza la variable de estado formContent
        setFormContent(camposFormulario);
      } 
    }

    //recibe el id de la pregunta y el nombre de la pregunta
    const editarEtiqueta = (campo, contenidoCampo) => {
      //se selecciona la pregunta sobre la que se quiere trabajar
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //se asigna al campo nombrePregunta de la pregunta el nombre recibido por parametro
        camposFormulario[index].etiqueta = contenidoCampo;
        //se actualiza la variable de estado formContent
        setFormContent(camposFormulario);
      } 
    }

    //recibe el id d ela pregunta y el tipo de pregunta seleccionado
    const editarTipoPregunta = (campo, contenidoCampo) => {
      const camposFormulario = [...formContent];
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        camposFormulario[index].tipoPregunta = contenidoCampo;
        setFormContent(camposFormulario);
      } 
    }

    //recibe el id de la pregunta y el nombre de la pregunta
    const editarOtro = (campo, contenidoCampo) => {
      //se selecciona la pregunta sobre la que se quiere trabajar
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //se asigna al campo nombrePregunta de la pregunta el nombre recibido por parametro
        camposFormulario[index].contenidoOtro = contenidoCampo;
        //se actualiza la variable de estado formContent
        setFormContent(camposFormulario);
      } 
    }


    //-----------------------------------SELECCIONAR OPCION-------------------------------------------------------------------

    //todas ellas asignan a la variable de estado correspodiente el valor seleccionado de cada pregunta (principalmente para eliminar la opcion posteriormente)

    function seleccionarRadioEscalaTextual(e){
      setValorEsacalaTextual(e);
    }

    function seleccionarOpcionMultiple(e){
      setValorMultipleSeleccionado(e);
    }
    
    const seleccionSelect = (e) => {
      console.log("-----:" + e.target.value);
      setValorSelect(e.target.value);
    }


    //---------------------------------------------CAMBIAR OCULTOS-----------------------------------------------------------------

    //cambia el valor de  la variable de estado Ocultar para mostrar la previsualización o la edición
    function cambiarOculto(){
    if(ocultar === true){
      setOcultar(false);
      }else{
        setOcultar(true);
      }
    }

    //se muestra o no el menu de imagenes en funcion del controlador anadirImagen
    const cambiarOcultoAnadirOtro = (campo) => {
      const camposFormulario = [...formContent];
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //si no se quieren añadir imagenes, estas se borran en caso de existir y se pone el controlador a false
        if(camposFormulario[index].anadirOtro === true){
          camposFormulario[index].anadirOtro = false;
        //si se quieren añadir imagenes, se pone a true el controlador para mostrar el input que
        //permite seleccionar el archivo
        }else{
          camposFormulario[index].anadirOtro = true;
        }
        setFormContent(camposFormulario);
      }
    }

    //se muestra o no el menu de imagenes en funcion del controlador anadirImagen
    const cambiarOcultoAnadirImagen = (campo) => {
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //si no se quieren añadir imagenes, estas se borran en caso de existir y se pone el controlador a false
        if(camposFormulario[index].anadirImagen === true){
          camposFormulario[index].imagen = [];
          camposFormulario[index].imagenPreview = [];
          camposFormulario[index].anadirImagen = false;
        //si se quieren añadir imagenes, se pone a true el controlador para mostrar el input que 
        //permite seleccionar el archivo
        }else{
          camposFormulario[index].anadirImagen = true;
        }
        setFormContent(camposFormulario);
      } 
    }

    //se muestra o no el menu de restricciones en funcion del controlador anadirRestriccion
    const cambiarOcultoAnadirRestriccion = (campo) => {
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //si se desea no añadir restricciones, estas se borran y se pone el controlador a false
        if(camposFormulario[index].anadirRestriccion === true){
          camposFormulario[index].restriccionId = "";
          camposFormulario[index].restriccionRespuesta = "";
          camposFormulario[index].anadirRestriccion = false;
          //en caso de querer añadir iamgenes 
        }else{
          camposFormulario[index].anadirRestriccion = true;
          setIdPreguntas(guardarIdPreguntas());
        }
        setFormContent(camposFormulario);
      } 
    }
    const respuestasId = (id) => {
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === id);
      if(index > -1){
        setRespuestas(camposFormulario[index].list);
      } 
    }

    //se muestra o no el menu de completar pregunta en funcion del controlador AnadirRespuestaPregunta
    const cambiarOcultoAnadirRespuestaPregunta = (campo) => {
      const camposFormulario = [...formContent];  
      const index = camposFormulario.findIndex(f => f.id === campo);
      if(index > -1){
        //si se desea no añadir restricciones, estas se borran y se pone el controlador a false
        if(camposFormulario[index].anadirRespuestaPregunta === true){
          camposFormulario[index].anadirRespuestaPreguntaId = "";
          camposFormulario[index].anadirRespuestaPregunta = false;
          //en caso de querer añadir iamgenes 
        }else{
          camposFormulario[index].anadirRespuestaPregunta = true;
          setIdPreguntas(guardarIdPreguntas());
        }
        setFormContent(camposFormulario);
      } 
    }

    //--------------------------------------FUNCIONALIDAD---------------------------------------------------------------------------------------

    //almacena todos los id de pregunta en ids para añadirlos al desplegable de restricciones
    function guardarIdPreguntas(){
      let ids = [];
      formContent.map((campos) =>
        { 
          ids.push(campos.id);
        }
      );
      return ids;
    }
    
    //cambia el valor de pregunta.obligatorio para indicar si esta es obligatoria o no
    const hacerObligatoria = (campos) => {
      //si el campo es true cambiamos el campo obligatorio a false para que no sea obligatoria
      if(campos.obligatorio){
        campos.obligatorio = false;
        const aux = [...formContent];
        setFormContent(aux);
        //idem al reves
      }else{  
        campos.obligatorio = true;
        const aux = [...formContent];
        setFormContent(aux);
      }
    }

    const confirmarSalir = () =>{
      swal.fire({
        title: '¿Deseas salir sin guardar?',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Salir`,
      }).then((result) => {
        if (result.isConfirmed) {
          guardarDatos()
          swal.fire('Formulario guardado!', '', 'success')
        }
      })
    }

    return(

      <div className="w-full bg-indigo-300 h-full">

        <div className='justify-center items-center'>

        <div className="flex flex-col items-center">

          {
          //camprueba  si se pulsa el boton de previsualizacion. Si está a true este boton no está pulsado por lo que se muestra la edicion
            !ocultar
            ?

            <div className="mt-0 w-full md:w-5/6 md:mt-12 lg:w-4/6 lg:mt-12 border-4 border-black  p-2 text-start">

              <div className="mb-4">

                {
                  numeroPreguntas > 0
                  ?
                    <button className="inline-flex bg-gray-800 hover:bg-gray-700 items-center p-2 lg:p-3 md:p-3 text-sm text-white rounded-md" onClick={cambiarOculto}  > { !ocultar ? "Previsualizar" : "Editar" } </button>
                  :
                    null
                }
                { 
                  numeroPreguntas > 0
                  ?
                    <button className=" bg-green-400 hover:bg-green-300 items-center p-2 lg:p-3 md:p-3 text-sm text-white rounded-md ml-2" onClick={guardarDatos}  > Guardar </button>
                  :
                    <p> debes añadir una pregunta para <span className='underline'>guardar</span> y <span className='underline'>previsualizar</span> </p>
                }
                { 
                  numeroPreguntas > 0
                  ?
                  <Link className=" bg-gray-800 hover:bg-gray-700 p-2 lg:p-3 md:p-3 text-sm text-white rounded-md ml-2 float-right" to={'/formularios'} onClick={() => confirmarSalir()}> Volver </Link>
                  :
                  null
                }

              </div>
             
              <div className="text-center mb-2">
                  {/* titulo del formulario que se almacena en la variable global tituloForm cuando se edita */}
                  {/* se usa la libreria EditText para editar el titulo haciendo click en el titulo del formm*/}
                  <EditText onSave={(value) => setTituloForm(value.value)}  id="titulo" placeholder="Introduce el título del formulario" className="text-2xl md:text-4xl lg:text-4xl text-center w-full mb-2 rounded-lg font-bold"/>
                  <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" rows={3} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descipción del formulario"/>
                  <p>numero de preguntas: {numeroPreguntas}</p>
              </div>

                
                {/* recorremos cada una de las preguntas --> desde campos accedemos a los atributos de las preguntas */}
                {
                  formContent.map((campos) => {
                  return (


                    /* cada uno de estos div es una pregunta */
                    <div className="border-4 border-gray-600 p-2 rounded-lg mt-5" >
                      {/* se muestra el id de la pregunta para que el usuario sepa de que pregunta se trata*/}
                      <p>{campos.id}</p>

                      <div className="flex flex-col-reverse lg:flex-row md:flex-row flex-wrap text-start">
                  
                        {/* nombre de pregunta */}
                        <div className=" flex-1" key={campos.id}>
                          {
                            //en caso de ser obligatoria la pregunta, se muestra como obligatoria y en caso de no serlo no se muestra nada
                            campos.obligatorio ? <p className="text-red-900 ml-4 text-sm md:text-xl lg:text-xl">* obligatoria</p> : null
                          }
                          {/* se introduce el titulo de la pregunta que cuando cambia se almacena en el atributo campoPregunta */}
                          <textarea className="p-2.5 w-full text-sm md:text-base lg:text-base  text-gray-900 bg-gray-50 rounded-lg border border-gray-300"  rows={2} type="text" value={campos.nombrePregunta} placeholder="Título de la pregunta" onChange={(e) => editarCampoPregunta(campos.id, e.target.value)}/> 
 
                        </div>
                        
                        {/* TIPO de pregunta */}
                        <div className=" mb-2 lg:mb-0 md:mb-0">
                          {/* select con todos los tipos de preguntas disponibles, por defecto no hay ninguna seleccionada */}
                          {/* cuando se selecciona un tipo de pregunta esta se almacena en el atributo tipoPregunta*/}
                          <select className="block text-sm lg:text-base md:text-base rounded-xl cursor-pointer pl-1 pr-1" onChange={(e) => editarTipoPregunta(campos.id, e.target.value) }>
                            <option value={campos.tipoPregunta} defaultValue>{campos.tipoPregunta}</option>
                            <option value="Respuesta corta">Repuesta corta</option>
                            <option value="Respuesta larga">Repuesta larga</option>
                            <option value="Fecha">Fecha</option>
                            <option value="Hora">Hora</option>
                            <option value="Respuesta numerica">Respuesta numérica</option>
                            <option value="Respuesta unica">Respuesta única</option>
                            <option value="Escala">Escala</option> 
                            <option value="Respuesta multiple">Respuesta múltiple</option>
                          </select>
                          
                        </div>


                      </div>

                      <div className=" flex-1 mt-2">
                        {/* etiqueta que va a servir para mostrar resultados al usuario. Se almacena en el atributo etiqueta*/}
                        <input className="p-2.5 w-full text-sm md:text-base lg:text-base  text-gray-900 bg-gray-50 rounded-lg border border-gray-300" rows={2} type="text" placeholder="Etiqueta de la pregunta" onChange={(e) => editarEtiqueta(campos.id, e.target.value)}/>
                      </div>

                      <div key={campos.id}>
                        
                        {
                          //si se pulsa el boton de añadir imagen, el atributo anadirImagen se cambia a true y muestra el menu de añadir imagen
                          campos.anadirImagen
                          ?
                          <div className="mt-2 flex flex-col">
                            {/* se seelcciona el archivo */}
                            <input type="file" onChange={(e) => anadirArchivoImagen(campos.id,e)}></input>
                            <div className="mt-2 flex flex-row content-start">
                              {/* se muestra el archivo seleccionado*/}
                              {campos.imagenPreview.map((item) =><img src={item} className="w-40 h-40 border-2 border-black mr-2" alt=""></img>)}
                            </div>
                          </div>
                          :
                          //en caso de ser false anadirImagen no se muestra nada
                          null
                        }

                      </div>
                        
                      <div>
                        {/* Respuesta en funcion del tipo de pregunta*/}
                        
                        {
                          campos.tipoPregunta === 'Respuesta corta' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md block w-full " type="text" placeholder="Introduce aqui la respuesta"/> 
                        }

                        {
                          campos.tipoPregunta === 'Respuesta larga' && <textarea className="mt-2 text-sm md:text-base lg:text-base rounded-md block w-full" rows={3} placeholder="Introduce aqui la respuesta"/>
                        }
                        {
                          campos.tipoPregunta === 'Fecha' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md  block w-full" type="date" placeholder="dd/mm/yyyy"/> 
                        }
                        {
                          campos.tipoPregunta === 'Hora' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md  block w-full" type="time" placeholder="HH/MM"/> 
                        }
                        {
                          campos.tipoPregunta === 'Respuesta numerica' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md  block w-full" type="number" placeholder="Introduce aqui la respuesta"/>
                        }

                        {
                          //desplegable de respuesta unica
                          campos.tipoPregunta === 'Respuesta unica' && 
                          <div className="flex flex-col">

                            <div className="mt-2">
                              <select className="text-sm lg:text-lg md:text-lg border-2 border-black rounded-lg cursor-pointer" onChange={(e) => seleccionSelect(e)}>
                                <option value="none" defaultValue></option>
                                {campos.list.map((item) =><option key={item} value={item}>{item}</option>)}
                              </select>
                              <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 text-sm text-white rounded-md ml-2" onClick={() => eliminarOpcion(valorSelect, campos)}> eliminar opción </button>
                            </div>

                            <div className="mt-2">
                              {
                                campos.anadirOtro
                                ?
                                <div className="flex flex-row">
                                  <input className="text-sm md:text-base lg:text-base rounded-lg block" size={campos.contenidoOtro.length} onChange={(e) => editarOtro(campos.id, e.target.value)} placeholder="Otro"/>
                                  <input className="text-sm md:text-base lg:text-base rounded-lg border-2 border-black ml-2" type="text" placeholder="introduce tu otra respuesta" />
                                </div>
                                :
                                  null
                              }
                            </div>

                            <div className="mt-2">
                                                                                                                            {/* se añade el valor escrito a value */}
                              <input id="opcion" className="text-sm lg:text-lg md:text-lg rounded-lg border-2 border-black" value={textFieldUnica} type="text" onChange={(e) => setTextFieldUnica(e.target.value)} placeholder="Añade una opción" />
                                                                                                                                                        {/*se añade la opcion y textFieldUnica es ""*/}
                              <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => anadirOpcion(campos.id, textFieldUnica,setTextFieldUnica)}>Añadir opción</button>
                              <button className= "bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => cambiarOcultoAnadirOtro(campos.id)}  > { !campos.anadirOtro ? "Añadir otro" : "Quitar otro" } </button>
                            </div>

                          </div>
                        }

                        {
                          //escala de radio buttons
                          campos.tipoPregunta === 'Escala' && 
                          <div className="mt-2 ">
                              <div className="flex flex-row flex-1 justify-start ml-5 flex-wrap">                                                             {/* cada vez qye se crea una pregunta se incrementa en 1 la variable name para diferenciar grupos de radio buttons */}
                                  {campos.list.map((item) => <label className="mr-7 text-sm lg:text-lg md:text-lg"><input id={item} className="rounded-3xl h-4 w-4 cursor-pointer " type="radio" name={campos.contadorEscalaTextual} onChange={(e) => seleccionarRadioEscalaTextual(e.target.value)} value={item} label={item}/> {item} </label>)}
                              </div>                                                                                                                  {/* se elimina el radio button seleccionado. el valor esta almacenado en valorEscalaTextual*/}
                              <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => eliminarOpcion(valorEscalaTextual, campos)}> eliminar opción </button>
                            <div className="mt-2">
                              <input className="text-sm lg:text-lg md:text-lg rounded-lg border-2 border-black" type="text" value={textFieldEscala} onChange={(e) => setTextFieldEscala(e.target.value)} placeholder="Añade un valor" />
                              <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 ml-2" onClick={() => anadirOpcion(campos.id, textFieldEscala,setTextFieldEscala)}>Añadir valor</button>
                            </div>
                          </div>
                        }

                        {
                          campos.tipoPregunta === 'Respuesta multiple' && 
                          <div className="mt-2"> 

                            <div> 
                              <ul className="flex flex-col  ">                                                                                                                            {/* la funcion es la de asignar valormultiple para poder eliminar*/}
                                {campos.list.map((item) => <label className="mr-7"><input id={item} className="rounded-3xl h-4 w-4 cursor-pointer" onChange={(e) => seleccionarOpcionMultiple(e.target.value)} type="checkbox" name="respuestaMultiple" value={item} label={item}/> {item} </label>)}
                                {
                                  campos.anadirOtro
                                  ?
                                  <div className="flex flex-col flex-nowrap lg:flex-row md:flex-row">
                                    <input className=" mt-2 text-sm lg:text-lg md:text-lg rounded-lg block" size={campos.contenidoOtro.length} onChange={(e) => editarOtro(campos.id, e.target.value)} placeholder="Otro"/>
                                    <input className=" mt-2 text-sm lg:text-lg md:text-lg rounded-lg border-2 border-black ml-0 lg:ml-2 md:ml-2" type="text" placeholder="introduce tu otra respuesta" />
                                  </div>                                  
                                  :
                                    null
                                }
                              </ul> 
                            </div>
                            
                            <div className="mt-2"> 
                              <input className=" text-sm lg:text-base md:text-base rounded-lg border-2 border-black" type="text" value={textFieldMultiple} onChange={(e) => setTextFieldMultiple(e.target.value)} placeholder="Añade un valor" />
                              <button className= "bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2" onClick={() => anadirOpcionMultiple(campos.id, textFieldMultiple,setTextFieldMultiple)}>Añadir opción</button>
                              <button className= "bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm lg:mr-2 md:mr-2 text-white rounded-md ml-2 mt-2" onClick={() => cambiarOcultoAnadirOtro(campos.id)}  > { !campos.anadirOtro ? "Añadir otro" : "Quitar otro" } </button>
                            </div>

                            <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2" onClick={() => eliminarOpcionMultiple(valorMultipleSeleccionado, campos)}> eliminar opción </button>

                            <div className="flex flex-col lg:flex-row md:flex-row justify-start  mt-2 w-auto ">
                              {/* SE INDICA EL MAXIMO DE CHEXBOXES A MARCAR */}
                              <input className=" lg:mr-2 md:mr-2 text-sm lg:text-base md:text-base rounded-lg border-2 border-black" type="number" value={textFieldMaxMultiple} onChange={(e) => setTextFieldMaxMultiple(e.target.value)} placeholder="Selección máxima" />
                              <button className= "mt-2 lg:mr-2 md:mr-2 lg:text-sm md:text-sm bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md " onClick={() => anadirMaximoMultiple(campos.id, textFieldMaxMultiple,setTextFieldMaxMultiple)}>Añadir máximo selección</button>
                              <p className="lg:mr-2 md:mr-2 text-sm lg:text-base md:text-base">valor actual: {campos.maxMultiple}</p>

                            </div> 
                            

                          </div>
                        }

                      </div>

                      <div className="flex flex-col flex-nowrap ">
                        <div className="flex flex-col">

                          <div>
                            <button className="  bg-red-400 hover:bg-red-300 items-end p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 " onClick={() => eliminarPregunta(campos.id)}> Eliminar pregunta </button>
                            <button className=" bg-gray-800 hover:bg-gray-700 items-end p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 ml-2 " onClick={() => duplicarPregunta(campos.nombrePregunta,campos.tipoPregunta,campos.list,campos.listMultiple, campos.maxMultiple)}> Duplicar pregunta </button>
                          </div>

                          <div className="flex justify-end">
                            <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2 " onClick={() => cambiarOcultoAnadirImagen(campos.id)}  > { !campos.anadirImagen ? "Añadir imagenes" : "Eliminar imágenes" } </button>
                            <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2 " onClick={() => cambiarOcultoAnadirRestriccion(campos.id)} > { !campos.anadirRestriccion ? "Añadir restriccion" : "Eliminar restriccion" } </button>
                            <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2 " onClick={() => cambiarOcultoAnadirRespuestaPregunta(campos.id)} > { !campos.anadirRespuestaPregunta ? "Completar pregunta" : "Elininar completar pregunta" } </button>
                            <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2 " onClick={() => hacerObligatoria(campos)}> Obligatoria </button>
                          </div>

                        </div>

                        {/* RESTRICCIONES */}
                        <div className="float-right">
                          {
                            
                            campos.anadirRestriccion
                            ?

                            <div className="flex flex-col float-right text-center">

                              <div className="mt-2 ">
                                <p>Menú restricciones</p>  
                              </div>

                              <div className="mt-2 flex flex-row float-right">

                                <div  className="mr-2">
                                  <label className="mr-2">Id:</label>
                                  <select onChange={(e) => {respuestasId(e.target.value); campos.restriccionId = e.target.value; campos.restriccionRespuesta = ""} }>
                                    <option value={campos.restriccionId} defaultValue>{campos.restriccionId}</option>
                                    {idPreguntas.map((id) =><option value={id}>{id}</option>)}
                                  </select>
                                </div>

                                <div className="mr-2">
                                  <label className="mr-2">Respuesta:</label>
                                  <select onChange={(e) => campos.restriccionRespuesta = e.target.value}> {/* HACER UNA FUNCION DONDE SE PONGA A TRUE*/}
                                    <option value={campos.restriccionRespuesta} >{campos.restriccionRespuesta}</option>
                                    {respuestas.map((respuesta) =><option value={respuesta}>{respuesta}</option>)}
                                  </select>
                                </div>

                              </div>
                              <hr className="mt-1"/>
                            </div>
                            :
                            null
                          }
                        </div>

                        {/* COMPLETAR PREGUNTA */}
                        <div className="float-right mr-2">
                          {
                            
                            campos.anadirRespuestaPregunta
                            ?
                            
                            <div className="flex flex-col float-right text-center">
                              
                              <div className="mt-1 ">
                                <p>Menú completar pregunta</p>  
                              </div>

                              <div className="mt-2 flex flex-row float-right self-center">

                                <div  className="mr-2">
                                  <label className="mr-2 ">Id:</label>
                                  <select onChange={(e) => {campos.anadirRespuestaPreguntaId = e.target.value} }>
                                  <option value={campos.anadirRespuestaPreguntaId} defaultValue>{campos.anadirRespuestaPreguntaId}</option>
                                    {idPreguntas.map((id) =><option value={id}>{id}</option>)}
                                  </select>
                                </div>
                                

                              </div>
                            </div>
                            :
                            null
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="relative w-full p-5 mt-4">
                  <div className="absolute inset-x-0 bottom-0 h-12 flex justify-center">
                    <button className="inline-flex bg-gray-800 hover:bg-gray-700 items-center p-3 text-sm text-white rounded-md" onClick={() => anadirPregunta()}> Añadir pregunta </button>
                  </div>
                </div>
              
              </div>

            
            :
            <div className='w-full bg-indigo-300 h-screen text-center'>
            <div className="justify-center items-center">
              <div className="flex flex-col items-center ">
                <div className="mt-0 w-full md:w-5/6 md:mt-12 lg:w-4/6 lg:mt-12 border-4 border-black  p-2 text-start">

                {
                  numeroPreguntas > 0
                  ?
                    <button className="inline-flex bg-gray-800 hover:bg-gray-700  p-2 lg:p-3 md:p-3 text-sm text-white rounded-md" onClick={cambiarOculto}  > { !ocultar ? "Previsualizar" : "Editar" } </button>
                  :
                    null
                }
                { 
                  numeroPreguntas > 0
                  ?
                    <button className="inline-flex bg-gray-800 hover:bg-gray-700 ml-2 p-2 lg:p-3 md:p-3 text-sm text-white rounded-md" onClick={guardarDatos}  > Guardar </button>
                  :
                    <p> debes añadir una pregunta para <span className='underline'>guardar</span> y <span className='underline'>previsualizar</span> </p>
                }

              

              <Previsualizacion formPrev={formContent} setformPrev={setFormContent} titulo={tituloForm} descripcion={descripcion} numeroPreguntas={numeroPreguntas} />
              </div>
              </div>
            </div>
            </div>
        }
      </div>
      </div>
    </div>

    )



}

export default CrearFormulario;