import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePreguntas, useFormulario } from "../hooks";
import { useState, useEffect } from "react";
import EditarPrev from "./EditarPrev";
import swal from 'sweetalert2'


function EditarFormulario(){

  const navigate = useNavigate();

  let {id} = useParams();
  const [preguntaContent, setPreguntaContent] = useState();

  const [formulario, setFormulario] = useState();
  const [nombrePreguntas, setNombrePreguntas] = useState([]);
  const [etiquetaPreguntas, setEtiquetaPreguntas] = useState([]);
  let a = -1;
  const [executed, setExecuted] = useState(true);
  const [executedForm, setExecutedForm] = useState(true);
  const [executedState, setExecutedState] = useState(true);
    
  const {dataGetPreguntas, dataGetPreguntaMaxId, updatePreguntas, deletePreguntas, create}  = usePreguntas(id);
  const { dataGetFormulariosExacto, updateFormulario}  = useFormulario(id);


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

  const guardarDatos = () =>{

    let preguntaSinTitulo = false;
    //comprobamos que todas tengan un titulo
    for(let i=0; i<preguntaContent.length; i++){
      if(preguntaContent[i].nombrepregunta === ""){
        preguntaSinTitulo = true;
      }
    }

    if(preguntaSinTitulo === true){

      swal.fire('Error. Todas las preguntas deben tener un titulo', '', 'error');

      }else{
        let idInsertar = auxObtenerIds().idsInsertar;
        let idActualizar = auxObtenerIds().idsActualizar;
        let idEliminar = auxObtenerIds().idsEliminar;
  
        if(idInsertar.length > 0){
          for(let i=0; i<idInsertar.length; i++){
            for(let a=0; a<preguntaContent.length; a++){
              if(idInsertar[i] === preguntaContent[a].id){
                insertPreguntas(preguntaContent[a]);
              }
            }
          }
        }
  
        if(idActualizar.length > 0){
          for(let i=0; i<idActualizar.length; i++){
            for(let a=0; a<preguntaContent.length; a++){
              if(idActualizar[i] === preguntaContent[a].id){
                updatePregunta(preguntaContent[a]);
              }
            }
          }
        }
  
        if(idEliminar.length > 0){
          for(let i=0; i<idEliminar.length; i++){
            deletePregunta(idEliminar[i], id);
          }
        }
  
        updateForm();
        navigate("/formularios")
        swal.fire('Formulario guardado!', '', 'success')
      }  
        
  }

  const deletePregunta = async (id, formulario) => {
    let controller;
    try {
      controller = await deletePreguntas({
          id: id,
          formulario: formulario,
      })

      if(controller === false){
        navigate("/");
      }

    } catch (err) {
      alert("error: " + err);
    }
  }

  const insertPreguntas = async (campos) => {
    let controller;
    try {
      controller = await create({
        id: campos.id,
        nombrePregunta: campos.nombrepregunta,
        etiqueta: campos.etiqueta,
        tipoPregunta: campos.tipopregunta,
        respuesta: campos.respuesta,
        respuestaMultiple: campos.respuestamultiple,
        list: campos.list,
        listMultiple: campos.listmultiple,
        maxMultiple: campos.maxmultiple,
        MarcadasMultiple: campos.marcadasmultiple,
        obligatorio: campos.obligatorio,
        contadorEscalaTextual: campos.contadorescalatextual,
        anadirImagen: campos.anadirimagen,
        imagen: campos.imagen,
        imagenPreview: campos.imagenpreview,
        anadirOtro: campos.anadirotro,
        contenidoOtro: campos.contenidootro,
        anadirRestriccion: campos.anadirrestriccion,
        restriccionId: campos.restriccionid,
        restriccionRespuesta: campos.restriccionrespuesta,
        anadirRespuestaPregunta: campos.anadirrespuestapregunta,
        anadirRespuestaPreguntaId: campos.anadirrespuestapreguntaid,
        disabled: campos.disabled,
        tiempo: campos.tiempo,
        formulario: id,
      })

      

      if(controller === false){
        navigate("/")
      }

    } catch (err) {
      alert("error: " + err);
    }
  }

  const updatePregunta = async (campos) => {
    let controller;
    try {
      controller = await updatePreguntas({
        id: campos.id,
        nombrePregunta: campos.nombrepregunta,
        etiqueta: campos.etiqueta,
        tipoPregunta: campos.tipopregunta,
        respuesta: campos.respuesta,
        respuestaMultiple: campos.respuestamultiple,
        list: campos.list,
        listMultiple: campos.listmultiple,
        maxMultiple: campos.maxmultiple,
        MarcadasMultiple: campos.marcadasmultiple,
        obligatorio: campos.obligatorio,
        contadorEscalaTextual: campos.contadorescalatextual,
        anadirImagen: campos.anadirimagen,
        imagen: campos.imagen,
        imagenPreview: campos.imagenpreview,
        anadirOtro: campos.anadirotro,
        contenidoOtro: campos.contenidootro,
        anadirRestriccion: campos.anadirrestriccion,
        restriccionId: campos.restriccionid,
        restriccionRespuesta: campos.restriccionrespuesta,
        anadirRespuestaPregunta: campos.anadirrespuestapregunta,
        anadirRespuestaPreguntaId: campos.anadirrespuestapreguntaid,
        disabled: campos.disabled,
        tiempo: campos.tiempo,
        formulario: id,
      })

      if(controller === false){
        navigate("/")
      }

    } catch (err) {
      alert("error: " + err);
    }
  }

  const updateForm = async () => { 
    let controller;
    try {
      controller = await updateFormulario({
        titulo: tituloForm,
        descripcion: descripcion,
        id: id,
      })

      if(controller === false){
        navigate("/");
      }

    } catch (err) {
      alert("error: " + err);
    }
  }

  const auxObtenerIds = () => {
    let idsBD = [];
    let idsForm = [];
    let idsInsertar = [];
    let idsActualizar = [];
    let idsEliminar = [];

    if(dataGetPreguntas && dataGetPreguntas.length > 0){
      for(let i=0; i<dataGetPreguntas.length; i++){
        idsBD.push(dataGetPreguntas[i].id);
      }
    }
    if(preguntaContent && preguntaContent.length > 0){
      for(let i=0; i<preguntaContent.length; i++){
        idsForm.push(preguntaContent[i].id);
      }
    }

    for(let i=0; i<idsForm.length; i++){
      if(idsBD.includes(idsForm[i])){
        idsActualizar.push(idsForm[i]);
      }
    }

    for(let i=0; i<idsForm.length; i++){
      if(!idsBD.includes(idsForm[i])){
        idsInsertar.push(idsForm[i]);
      }
    }

    for(let i=0; i<idsBD.length; i++){
      if(!idsForm.includes(idsBD[i])){
        idsEliminar.push(idsBD[i]);
      }
    }

    return {idsInsertar, idsActualizar, idsEliminar}
      
  }

  //---------------------------------CREAR FORM--------------------------------
  const [tituloForm, setTituloForm] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [ocultar, setOcultar] = useState(false);

  const [numeroPreguntas,setNumeroPreguntas] = useState(0);

  const [contIdPregunta, setContIdPregunta] = useState(0);
  const [contRadioTextual, setContRadioTextual] = useState(0);

  const [valorSelect, setValorSelect] = useState("");
  const [valorEscalaTextual, setValorEsacalaTextual] = useState("");
  const [valorMultipleSeleccionado, setValorMultipleSeleccionado] = useState("");

  const [textFieldUnica, setTextFieldUnica] = useState("");
  const [textFieldEscala, setTextFieldEscala] = useState("");
  const [textFieldMultiple, setTextFieldMultiple] = useState("");
  const [textFieldMaxMultiple, setTextFieldMaxMultiple] = useState("");

  const [idPreguntas, setIdPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);

  //----------------------------------------ACTUALIZAR ESTADOS--------------------------------

    function calcularValorMaximo(campo){
      let maxId = 0;
      let maxRadio = 0;

      if(campo === "id"){
        let auxMaxId = 0;
        for(let i = 0; i<preguntaContent.length; i++){
          if(preguntaContent[i].id > auxMaxId){
            auxMaxId = preguntaContent[i].id;
            maxId = auxMaxId;
          }
        }
        return maxId;
      }

      if(campo === "radioTextual"){
        let auxMaxRadio = 0;
        for(let i = 0; i<preguntaContent.length; i++){
          if(preguntaContent[i].id > auxMaxRadio){
            auxMaxRadio = preguntaContent[i].id;
            maxRadio = auxMaxRadio;
          }
        }
        return maxRadio;
      }

    }

      //ACTUALIZAR VALORES DE PREGUNTAS ANTERIORES
    if(preguntaContent && preguntaContent.length > 0 && formulario && formulario.length > -1 && executedState){
      //numero de preguntas
      setNumeroPreguntas(preguntaContent.length);
      //id siguiente pregunta
      setContIdPregunta((parseInt(calcularValorMaximo("id")) + 1 ));
      //id siguientes radios buttons
      setContRadioTextual((parseInt(calcularValorMaximo("radioTextual")) + 1 ));
      //actualizamos titulo form al anterior
      setTituloForm(formulario[0].titulo);
      //actualizamos descripcion form al anterior
      setDescripcion(formulario[0].descripcion);

      setIdPreguntas(guardarIdPreguntas());

      setNombrePreguntas(guardarNombrePreguntas());

      setEtiquetaPreguntas(guardarEtiquetaPreguntas());

      //para que no se ejecute mas de una vez la actualizacion de datos
      setExecutedState(false);
    }

    //---------------------------------PREGUNTAS----------------------------------------------------------------------------------------------------------------

    //estructura de cada pregunta que almacena todos sus valores (si cuenta con ellos)
    const anadirPregunta = () => {

        setNumeroPreguntas((preguntaContent.length + 1));
        //funcion que aumenta en uno el valor del state "contIdPregunta" para asignarlo como id de la pregunta
        contadorIdPregunta();
        //idem anterior pero en esta ocasion para las preguntas de radio button de tipo texto
        contadorRadioTextual();
  
        //estructura de las preguntas que se almacena en la variable de estado "preguntaContent". Esta variable contiene todas las preguntas del formulario
        const campos = {
          "id": contIdPregunta,
          "nombrepregunta": "",
          //etiqueta qeu va a servir para presentar las preguntas en cvs
          "etiqueta": "",
          "tipopregunta": "", // "respuestaLarga", "numerico", "escala", "respuestaUnica", "multiple", "escala numerica", "fecha"
          "respuesta": "",
          respuestamultiple: [],
          //lista con las opciones añadidas
          list: [],
          //lista para comprobar que opciones han sido marcadas cuando son preguntas de tipo checkbox, es una lista de booleanos
          listmultiple: [],
          //campo que indica el numero máximo de checkbox que pueden ser marcadas
          "maxmultiple": 0,
          //numero de checkbox que lleva marcado. Debe ser <= a maxmultiple
          "marcadasmultiple": 0,
          //pregutna obligatoria (booleano)
          "obligatorio": false,
          //iden para las opciones de radio buton textuales
          "contadorescalatextual": `${contRadioTextual}`,
          //booleano para indicar si se quiere añadir imagen
          "anadirimagen": false,
          //array para almacenar las imágenes
          imagen:[],
          //array para mostrar la previsualizacion de la imagen
          imagenpreview: [],
          //booleano para indicar si se quiere añadir opcion otro
          "anadirotro": false,
          //valor otro
          "contenidootro": "",
          //booleano para indicar si se quiere añadir restriccion
          "anadirrestriccion": false,
          //id y respuesta que genera restricciones
          "restriccionid": "",
          "restriccionrespuesta": "",
          //campo para habilitar completar titulos de preguntas con respuestas de otras
          "anadirrespuestapregunta" : false,
          "anadirrespuestapreguntaid": "",
          "disabled": false,
          "tiempo": 0
        };
        setPreguntaContent([...preguntaContent, campos]);
      };

      const duplicarPregunta = (nombrePregunta,tipoPregunta,lista,listaMultilpe,multipleMax) => {

        setNumeroPreguntas((preguntaContent.length + 1));
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
  
        //estructura de las preguntas que se almacena en la variable de estado "preguntaContent". Esta variable contiene todas las preguntas del formulario
        const campos = {
          "id": contIdPregunta,
          "nombrepregunta": nombrePregunta,
          //etiqueta qeu va a servir para presentar las preguntas en cvs
          "etiqueta": "",
          "tipopregunta": tipoPregunta, // "respuestaLarga", "numerico", "escala", "respuestaUnica", "multiple", "escala numerica", "fecha"
          "respuesta": "",
          respuestamultiple: [],
          //lista con las opciones añadidas
          list: listaAux,
          //lista para comprobar que opciones han sido marcadas cuando son preguntas de tipo checkbox, es una lista de booleanos
          listmultiple: listMultipleAux,
          //campo que indica el numero máximo de checkbox que pueden ser marcadas
          "maxmultiple": max,
          //numero de checkbox que lleva marcado. Debe ser <= a maxmultiple
          "marcadasmultiple": 0,
          //pregutna obligatoria (booleano)
          "obligatorio": false,
          //iden para las opciones de radio buton textuales
          "contadorescalatextual": `${contRadioTextual}`,
          //booleano para indicar si se quiere añadir imagen
          "anadirimagen": false,
          //array para almacenar las imágenes
          imagen:[],
          //array para mostrar la previsualizacion de la imagen
          imagenpreview: [],
          //booleano para indicar si se quiere añadir opcion otro
          "anadirotro": false,
          //valor otro
          "contenidootro": "",
          //booleano para indicar si se quiere añadir restriccion
          "anadirrestriccion": false,
          //id y respuesta que genera restricciones
          "restriccionid": "",
          "restriccionrespuesta": "",
          //campo para habilitar completar titulos de preguntas con respuestas de otras
          "anadirrespuestapregunta" : false,
          "anadirrespuestapreguntaid": "",
          "disabled": false,
          "tiempo": 0
        };
        setPreguntaContent([...preguntaContent, campos]);
      };
  
      //--------------------------------------ELIMINAR--------------------------------------------------------------------------------------------
  
      //recibiendo el id de la pregunta, esta es es eliminada de la variable de estado "preguntaContent"
      const eliminarPregunta = (id) => {
        setNumeroPreguntas(numeroPreguntas - 1);
        setPreguntaContent(preguntaContent.filter((item) => item.id !== id));
  
        //se elimina el select de respuestas re restriccion
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === id);
        if(index > -1){
          setRespuestas([]);
        } 
      }
  
      //recibe la opcion seleccionada y la estructura de la pregunta actual para modificarla
      const eliminarOpcion = (campoSeleccionado, campos) => {
        //se selecciona el indice de la opcion seleccionada
        var index = campos.list.indexOf(campoSeleccionado);
        //se elimina el elemento de la lista
        campos.list.splice(index,1);
        //se añade el cambio a la variable estate preguntaContent
        const aux = [...preguntaContent];
        setPreguntaContent(aux);
      }
  
      //idem que la anterior pero para las preguntas de opcion multiple
      const eliminarOpcionMultiple = (campoSeleccionado, campos) => {
        var index = campos.list.indexOf(campoSeleccionado);
        campos.list.splice(index,1);
        //además se elimina de la lista que comprueba que ceckbox se encuentran marcados
        campos.listmultiple.splice(index,1);
        const aux = [...preguntaContent];
        setPreguntaContent(aux);
      }
  
  
      //---------------------------------------AÑADIR-----------------------------------------------------------------------------
  
      //recibe el id de la pregunta, la y el valor del state y su correspondiente set
      const anadirOpcion = (campo, option, setOption) => {
        //siempre que no sea algo en blanco
        if(option !== ""){
          //se selecciona la pregunta actual
          const camposFormulario = [...preguntaContent];
          const index = camposFormulario.findIndex(f => f.id === campo);
          if(index > -1){
            //se añade la opcion a la lista de opciones
            camposFormulario[index].list.push(option);
            //se actualiza la variable de estado preguntaContentw
            setPreguntaContent(camposFormulario);
          } 
          setOption("");
        }
      }
  
      //se añade un checkbox a la pregunta y un campo de comprobacion de selecion a false (para comprobar el numero de marcadas)
      const anadirOpcionMultiple = (campo, option, setOption) => {
        if(option !== ""){
          const camposFormulario = [...preguntaContent];
          const index = camposFormulario.findIndex(f => f.id === campo);
          if(index > -1){
            camposFormulario[index].list.push(option);
            camposFormulario[index].listmultiple.push("false");
            setPreguntaContent(camposFormulario);
          } 
          setOption("");
        }
      }
  
      //recibe el id de la pregunta sobre la que se está trabajando y el valor de opciones marcadas a desear
      const anadirMaximoMultiple = (campos, valueMax) => {
        //se seleciona mediante el id la pregunta que se desea
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campos);
        if(index > -1){
          //se accede al campo maxmultiple y se le asigan el valor deseado
          camposFormulario[index].maxmultiple = valueMax;
          //se actualiza la variable de estado preguntaContent
          setPreguntaContent(camposFormulario);
        } 
        setTextFieldMaxMultiple("");
      }
  
      //se añade a la lista de imagenes la imagen seleccionada por el usuario y tambien a la lista de previsualización
      const anadirArchivoImagen = (campo,e) =>{
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          camposFormulario[index].imagen.push(e.target.files[0]);
          camposFormulario[index].imagenpreview.push(URL.createObjectURL(e.target.files[0]));
        }
        setPreguntaContent(camposFormulario);
  
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
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //se asigna al campo nombrepregunta de la pregunta el nombre recibido por parametro
          camposFormulario[index].nombrepregunta = contenidoCampo;
          //se actualiza la variable de estado preguntaContent
          setPreguntaContent(camposFormulario);
        } 
      }

      const editarAuxNombrePregunta = (campos, contenidoCampo) => {
        //se selecciona la pregunta sobre la que se quiere trabajar
        const camposFormulario = [...preguntaContent];  
        
        let preguntas = guardarNombrePreguntas();

        console.log(preguntas)
        const index = camposFormulario.findIndex(f => f.nombrepregunta === campos); 
        if(index > -1){
          //se asigna al campo nombrepregunta de la pregunta el nombre recibido por parametro
          preguntas[index] = contenidoCampo;
          //se actualiza la variable de estado preguntaContent
          setNombrePreguntas(preguntas);
        } 
      }

      const editarAuxEtiquetaPregunta = (campos, contenidoCampo) => {
        //se selecciona la pregunta sobre la que se quiere trabajar
        const camposFormulario = [...preguntaContent];  
        
        let etiquetas = guardarEtiquetaPreguntas();

        console.log(etiquetas)
        const index = camposFormulario.findIndex(f => f.nombrepregunta === campos); 
        if(index > -1){
          console.log("entramos en el if")
          //se asigna al campo nombrepregunta de la pregunta el nombre recibido por parametro
          etiquetas[index] = contenidoCampo;
          //se actualiza la variable de estado preguntaContent
          setEtiquetaPreguntas(etiquetas);
        } 
      }

      //recibe el id de la pregunta y el nombre de la pregunta
      const editarEtiqueta = (campo, contenidoCampo) => {
        //se selecciona la pregunta sobre la que se quiere trabajar
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //se asigna al campo nombrepregunta de la pregunta el nombre recibido por parametro
          camposFormulario[index].etiqueta = contenidoCampo;
          //se actualiza la variable de estado preguntaContent
          setPreguntaContent(camposFormulario);
        } 
      }

        //recibe el id d ela pregunta y el tipo de pregunta seleccionado
        const editarTipoPregunta = (campo, contenidoCampo) => {
            const camposFormulario = [...preguntaContent];
            const index = camposFormulario.findIndex(f => f.id === campo);
            if(index > -1){
              camposFormulario[index].tipopregunta = contenidoCampo;
              setPreguntaContent(camposFormulario);
            } 
      }
  
      //recibe el id de la pregunta y el nombre de la pregunta
      const editarOtro = (campo, contenidoCampo) => {
        //se selecciona la pregunta sobre la que se quiere trabajar
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //se asigna al campo nombrepregunta de la pregunta el nombre recibido por parametro
          camposFormulario[index].contenidootro = contenidoCampo;
          //se actualiza la variable de estado preguntaContent
          setPreguntaContent(camposFormulario);
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
  
      //se muestra o no el menu de imagenes en funcion del controlador anadirimagen
      const cambiarOcultoAnadirOtro = (campo) => {
        const camposFormulario = [...preguntaContent];
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //si no se quieren añadir imagenes, estas se borran en caso de existir y se pone el controlador a false
          if(camposFormulario[index].anadirotro === true){
            camposFormulario[index].anadirotro = false;
          //si se quieren añadir imagenes, se pone a true el controlador para mostrar el input que
          //permite seleccionar el archivo
          }else{
            camposFormulario[index].anadirotro = true;
          }
          setPreguntaContent(camposFormulario);
        }
      }
  
      //se muestra o no el menu de imagenes en funcion del controlador anadirimagen
      const cambiarOcultoAnadirImagen = (campo) => {
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //si no se quieren añadir imagenes, estas se borran en caso de existir y se pone el controlador a false
          if(camposFormulario[index].anadirimagen === true){
            camposFormulario[index].imagen = [];
            camposFormulario[index].imagenpreview = [];
            camposFormulario[index].anadirimagen = false;
          //si se quieren añadir imagenes, se pone a true el controlador para mostrar el input que 
          //permite seleccionar el archivo
          }else{
            camposFormulario[index].anadirimagen = true;
          }
          setPreguntaContent(camposFormulario);
        } 
      }
  
      //se muestra o no el menu de restricciones en funcion del controlador anadirrestriccion
      const cambiarOcultoAnadirRestriccion = (campo) => {
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //si se desea no añadir restricciones, estas se borran y se pone el controlador a false
          if(camposFormulario[index].anadirrestriccion === true){
            camposFormulario[index].restriccionid = "";
            camposFormulario[index].restriccionrespuesta = "";
            camposFormulario[index].anadirrestriccion = false;
            //en caso de querer añadir iamgenes 
          }else{
            camposFormulario[index].anadirrestriccion = true;
            setIdPreguntas(guardarIdPreguntas());
          }
          setPreguntaContent(camposFormulario);
        } 
      }

      const respuestasId = (id) => {
        const camposFormulario = [...preguntaContent]
        for(let i=0; i<idPreguntas.length; i++){
          if(idPreguntas[i] === parseInt(id)){
            setRespuestas(camposFormulario[i].list);
          }
        }

        /*const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === id);
        console.log(id)
        if(index > -1){
          setRespuestas(camposFormulario[index].list);
        } */
      }
  
      //se muestra o no el menu de completar pregunta en funcion del controlador AnadirRespuestaPregunta
      const cambiarOcultoAnadirRespuestaPregunta = (campo) => {
        const camposFormulario = [...preguntaContent];  
        const index = camposFormulario.findIndex(f => f.id === campo);
        if(index > -1){
          //si se desea no añadir restricciones, estas se borran y se pone el controlador a false
          if(camposFormulario[index].anadirrespuestapregunta === true){
            camposFormulario[index].anadirrespuestapreguntaid = "";
            camposFormulario[index].anadirrespuestapregunta = false;
            //en caso de querer añadir iamgenes 
          }else{
            camposFormulario[index].anadirrespuestapregunta = true;
            setIdPreguntas(guardarIdPreguntas());
          }
          setPreguntaContent(camposFormulario);
        } 
      }

//--------------------------------------FUNCIONALIDAD---------------------------------------------------------------------------------------

  
          //almacena todos los id de pregunta en ids para añadirlos al desplegable de restricciones
          function guardarIdPreguntas(){
            let ids = [];
            preguntaContent.map((campos) =>
              { 
                ids.push(campos.id);
              }
            );
            return ids;
          }

          function guardarNombrePreguntas(){
            let ids = [];
            preguntaContent.map((campos) =>
              { 
                ids.push(campos.nombrepregunta);
              }
            );
            return ids;
          }

          function guardarEtiquetaPreguntas(){
            let ids = [];
            preguntaContent.map((campos) =>
              { 
                ids.push(campos.etiqueta);
              }
            );
            return ids;
          }

      
          //cambia el valor de pregunta.obligatorio para indicar si esta es obligatoria o no
          const hacerObligatoria = (campos) => {
            //si el campo es true cambiamos el campo obligatorio a false para que no sea obligatoria
            if(campos.obligatorio){
              campos.obligatorio = false;
              const aux = [...preguntaContent];
              setPreguntaContent(aux);
              //idem al reves
            }else{  
              campos.obligatorio = true;
              const aux = [...preguntaContent];
              setPreguntaContent(aux);
            }
          }
    
    return(
      
      <div className="w-full bg-indigo-300 h-full">

        <div className='justify-center items-center'>

        <div className="flex flex-col items-center">

          {
          //camprueba  si se pulsa el boton de previsualizacion. Si está a true este boton no está pulsado por lo que se muestra la edicion
          !ocultar
          ?
  
          <div className='mt-0 w-full md:w-5/6 md:mt-12 lg:w-4/6 lg:mt-12 border-4 border-black  p-2 text-start'>

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
                  <button className=" bg-green-400 hover:bg-green-300 items-center p-2 lg:p-3 md:p-3 text-sm text-white rounded-md ml-2" onClick={guardarDatos} > Guardar </button>
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
              <input onChange={(event) => setTituloForm(event.target.value)}  id="titulo" value={tituloForm} className="text-2xl md:text-4xl lg:text-4xl text-center w-full mb-2 rounded-lg font-bold" />
              <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" rows="3" onChange={(e) => setDescripcion(e.target.value)} value={descripcion}/>
              <p>numero de preguntas: {numeroPreguntas}</p>
            </div> 

            {
              (preguntaContent && preguntaContent.length > 0) && preguntaContent.map((campos) => {
                return ( 
                  
                  <div className="border-4 border-gray-600 p-2 rounded-lg mt-5">
                  
                  {
                    a = a + 1
                  }

                    <div className=" flex flex-col-reverse lg:flex-row md:flex-row flex-wrap text-start ">

                      {/* nombre de pregunta */}
                      <div className=" flex-1" key={campos.id}>

                        <p>{campos.id}</p>
                        {
                          campos.obligatorio ? <p className="text-red-900 ml-4 text-sm md:text-xl lg:text-xl">*obligatoria</p> : null
                        }  
                        <textarea className="p-2.5 w-full text-sm md:text-base lg:text-base  text-gray-900 bg-gray-50 rounded-lg border border-gray-300" rows="2" value={nombrePreguntas[a]} type="text"  onChange={(e) => {editarCampoPregunta(campos.id, e.target.value);editarAuxNombrePregunta(campos.nombrepregunta, e.target.value)}}/> 
  
                      </div>

                      {/* desplegable */}
                      <div className="mb-2 lg:mb-0 md:mb-0 ">
                        {/* select con todos los tipos de preguntas disponibles, por defecto no hay ninguna seleccionada */}
                        {/* cuando se selecciona un tipo de pregunta esta se almacena en el atributo tipopregunta*/}
                        <select className="block text-sm lg:text-base md:text-base rounded-xl cursor-pointer pl-1 pr-1" onChange={(e) => editarTipoPregunta(campos.id, e.target.value) }>
                          <option className='rounded-md' value={campos.tipopregunta} defaultValue>{campos.tipopregunta}</option>
                          <option className='rounded-md' value="Respuesta corta">Repuesta corta</option>
                          <option className='rounded-md' value="Respuesta larga">Repuesta larga</option>
                          <option className='rounded-md' value="Fecha">Fecha</option>
                          <option className='rounded-md' value="Hora">Hora</option>
                          <option className='rounded-md' value="Respuesta numerica">Respuesta numérica</option>
                          <option className='rounded-md' value="Respuesta unica">Respuesta única</option>
                          <option className='rounded-md' value="Escala">Escala</option> 
                          <option className='border-' value="Respuesta multiple">Respuesta múltiple</option>
                        </select>
                      </div>

                    </div>

                    {/* etiqueta */}
                    <div className=" flex-1 mt-2">
                      {/* etiqueta que va a servir para mostrar resultados al usuario. Se almacena en el atributo etiqueta*/}
                      <input className="p-2.5 w-full text-sm md:text-base lg:text-base  text-gray-900 bg-gray-50 rounded-lg border border-gray-300" rows={1} type="text" value={campos.etiqueta} onChange={(e) => {editarEtiqueta(campos.id, e.target.value); editarAuxEtiquetaPregunta(campos.nombrepregunta, e.target.value) }}/>
                    </div>

                    {/* anadir imagen */}
                    <div key={campos.id}>
                          
                      {
                        //si se pulsa el boton de añadir imagen, el atributo anadirimagen se cambia a true y muestra el menu de añadir imagen
                        campos.anadirimagen
                        ?
                          <div className="mt-2 flex flex-col">
                            {/* se seelcciona el archivo */}
                            <input type="file" onChange={(e) => anadirArchivoImagen(campos.id,e)}></input>
                            <div className="mt-2 flex flex-row content-start">
                              {/* se muestra el archivo seleccionado*/}
                              {campos.imagenpreview.map((item) =><img src={item} className="w-40 h-40 border-2 border-black mr-2" alt=''></img>)}
                            </div>
                          </div>
                        :
                          //en caso de ser false anadirimagen no se muestra nada
                          null
                      }

                    </div>

                    {/* respuesta */}
                    <div>
                      {/* Respuesta en funcion del tipo de pregunta*/}

                      {
                        campos.tipopregunta === 'Respuesta corta' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md block w-full  " type="text" placeholder="Introduce aqui la respuesta"/> 
                      }
                      {
                        campos.tipopregunta === 'Respuesta larga' && <textarea className="mt-2 text-sm md:text-base lg:text-base rounded-md block w-full" rows={3} placeholder="Introduce aqui la respuesta"/>
                      }
                      {
                        campos.tipopregunta === 'Fecha' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md  block w-full" type="date" placeholder="dd/mm/yyyy"/> 
                      }
                      {
                          campos.tipopregunta === 'Hora' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md  block w-full" type="time" placeholder="HH/MM"/> 
                      }
                      {
                        campos.tipopregunta === 'Respuesta numerica' && <input className="text-sm md:text-base lg:text-base mt-2 rounded-md  block w-full" type="number" placeholder="Introduce aqui la respuesta"/>
                      }

                      {
                        //desplegable de respuesta unica
                        campos.tipopregunta === 'Respuesta unica' && 
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
                              campos.anadirotro
                              ?
                                <div className="flex flex-row">
                                  <input className="text-sm md:text-base lg:text-base rounded-lg block" size={campos.contenidootro.length} onChange={(e) => editarOtro(campos.id, e.target.value)} placeholder="Otro"/>
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
                            <button className= "bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => cambiarOcultoAnadirOtro(campos.id)}  > { !campos.anadirotro ? "Añadir otro" : "Quitar otro" } </button>
                          </div>

                        </div>
                      }

                      {
                        //escala de radio buttons
                        campos.tipopregunta === 'Escala' && 
                        <div className="mt-2 ">
                          <div className="flex flex-row flex-1 justify-start ml-5 flex-wrap ">                                                             {/* cada vez qye se crea una pregunta se incrementa en 1 la variable name para diferenciar grupos de radio buttons */}
                            {campos.list.map((item) => <label className="mr-7 text-sm lg:text-lg md:text-lg"><input id={item} className="rounded-3xl h-4 w-4 cursor-pointer" type="radio" name={campos.contadorescalatextual} onChange={(e) => seleccionarRadioEscalaTextual(e.target.value)} value={item} label={item}/> {item} </label>)}
                          </div>                                                                                                                  {/* se elimina el radio button seleccionado. el valor esta almacenado en valorEscalaTextual*/}
                          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => eliminarOpcion(valorEscalaTextual, campos)}> eliminar opción </button>
                          <div className="mt-2">
                            <input className=" text-sm lg:text-lg md:text-lg rounded-lg border-2 border-black" type="text" value={textFieldEscala} onChange={(e) => setTextFieldEscala(e.target.value)} placeholder="Añade un valor" />
                            <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 ml-2" onClick={() => anadirOpcion(campos.id, textFieldEscala,setTextFieldEscala)}>Añadir valor</button>
                          </div>
                        </div>
                      }

                      {
                        campos.tipopregunta === 'Respuesta multiple' && 
                        <div className="mt-2"> 

                          <div className=""> 
                            <ul className="flex flex-col">                                                                                                                            {/* la funcion es la de asignar valormultiple para poder eliminar*/}
                              {campos.list.map((item) => <label className="mr-7"><input id={item} className="rounded-3xl h-4 w-4 cursor-pointer" onChange={(e) => seleccionarOpcionMultiple(e.target.value)} type="checkbox" name="respuestamultiple" value={item} label={item}/> {item} </label>)}
                              {
                                campos.anadirotro
                                ?
                                  <div className="flex flex-col flex-nowrap lg:flex-row md:flex-row">
                                    <input className="mt-2 text-sm lg:text-lg md:text-lg rounded-lg block" size={campos.contenidootro.length} onChange={(e) => editarOtro(campos.id, e.target.value)} placeholder="Otro"/>
                                    <input className=" mt-2 text-sm lg:text-lg md:text-lg rounded-lg border-2 border-black ml-0 lg:ml-2 md:ml-2" type="text" placeholder="introduce tu otra respuesta" />
                                  </div>                                  
                                :
                                  null
                              }
                            </ul> 
                          </div>
                                
                          <div className="mt-2"> 
                            <input className=" text-sm lg:text-base md:text-base rounded-lg border-2 border-black" type="text" value={textFieldMultiple} onChange={(e) => setTextFieldMultiple(e.target.value)} placeholder="Añade un valor" />
                            <button className= "bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => anadirOpcionMultiple(campos.id, textFieldMultiple,setTextFieldMultiple)}>Añadir opción</button>
                            <button className= "bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md ml-2" onClick={() => cambiarOcultoAnadirOtro(campos.id)}  > { !campos.anadirotro ? "Añadir otro" : "Quitar otro" } </button>
                          </div>

                          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 ml-5" onClick={() => eliminarOpcionMultiple(valorMultipleSeleccionado, campos)}> eliminar opción </button>

                          <div className="flex flex-col lg:flex-row md:flex-row justify-start  mt-2 w-auto">
                            {/* SE INDICA EL MAXIMO DE CHEXBOXES A MARCAR */}
                            <input className=" lg:mr-2 md:mr-2 text-sm lg:text-base md:text-base rounded-lg border-2 border-black" type="number" value={textFieldMaxMultiple} onChange={(e) => setTextFieldMaxMultiple(e.target.value)} placeholder="Selección máxima" />
                            <button className= "mt-2 lg:mr-2 md:mr-2 lg:text-sm md:text-sm bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md" onClick={() => anadirMaximoMultiple(campos.id, textFieldMaxMultiple,setTextFieldMaxMultiple)}>Añadir máximo selección</button>
                            <p className="lg:mr-2 md:mr-2 text-sm lg:text-base md:text-base">valor actual: {campos.maxmultiple}</p>
                          </div> 

                        </div>
                      }

                    </div>

                    {/* botones opciones */}
                    <div className="flex flex-col flex-nowrap ">
                        <div className="flex flex-col">

                          <div>
                            <button className="bg-red-400 hover:bg-red-300 items-end p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 " onClick={() => eliminarPregunta(campos.id)}> Eliminar pregunta </button>
                            <button className="bg-gray-800 hover:bg-gray-700 items-end p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 ml-2" onClick={() => duplicarPregunta(campos.nombrepregunta,campos.tipopregunta,campos.list, campos.listmultiple, campos.maxmultiple)}> Duplicar pregunta </button>
                          </div>

                        <div className="flex justify-end">
                          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2" onClick={() => cambiarOcultoAnadirImagen(campos.id)}  > { !campos.anadirimagen ? "Añadir imagenes" : "Eliminar imágenes" } </button>
                          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2" onClick={() => cambiarOcultoAnadirRestriccion(campos.id)} > { !campos.anadirrestriccion ? "Añadir restriccion" : "Eliminar restriccion" } </button>
                          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2" onClick={() => cambiarOcultoAnadirRespuestaPregunta(campos.id)} > { !campos.anadirrespuestapregunta ? "Completar pregunta" : "Elininar completar pregunta" } </button>
                          <button className="bg-gray-800 hover:bg-gray-700 items-center p-1 lg:p-2 md:p-2 text-sm text-white rounded-md mt-2 mr-2" onClick={() => hacerObligatoria(campos)}> Obligatoria </button>
                        </div>

                      </div>

                      {/* RESTRICCIONES */}
                      <div className="float-right">
                        {
                          campos.anadirrestriccion
                          ?
                            <div className="flex flex-col float-right text-center">

                              <div className="mt-2 ">
                                <p>Menú restricciones</p>
                              </div>

                              <div className="mt-2 flex flex-row float-right">
                                <div  className="mr-2">
                                  <label className="mr-2">Id:</label>
                                  <select onChange={(e) => {respuestasId(e.target.value) ; campos.restriccionid = e.target.value; campos.restriccionrespuesta = ""} }>
                                    <option value={campos.restriccionid} defaultValue>{campos.restriccionid}</option>
                                    {idPreguntas.map((id) =><option value={id}>{id}</option>)}
                                  </select>
                                </div>

                                <div className="mr-2">
                                  <label className="mr-2">Respuesta:</label>
                                  <select onChange={(e) => campos.restriccionrespuesta = e.target.value}> {/* HACER UNA FUNCION DONDE SE PONGA A TRUE*/}
                                    <option value={campos.restriccionrespuesta} >{campos.restriccionrespuesta}</option>
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
                          campos.anadirrespuestapregunta
                          ?
                            <div className="flex flex-col float-right text-center">
                              <div className="mt-1 ">
                                <p>Menú completar pregunta</p>  
                              </div>

                              <div className="mt-2 flex flex-row float-right self-center">
                                <div  className="mr-2">
                                  <label className="mr-2 ">Id:</label>
                                  <select onChange={(e) => {campos.anadirrespuestapreguntaid = e.target.value} }>
                                    <option value={campos.anadirrespuestapreguntaid} defaultValue>{campos.anadirrespuestapreguntaid}</option>
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
                )
              })
            }

            {
              (dataGetPreguntaMaxId && dataGetPreguntaMaxId.length > 0 && preguntaContent ) &&
                <div className="relative w-full p-5 mt-4">
                  <div className="absolute inset-x-0 bottom-0 h-12 flex justify-center">
                    <button className="inline-flex bg-gray-800 hover:bg-gray-700 items-center p-3 text-sm text-white rounded-md" onClick={() => anadirPregunta()}> Añadir pregunta </button>
                  </div>
                </div>
            }
          </div>
          :
          //previsualizar
          <div className='w-full bg-indigo-300 h-screen text-center'>
          <div className="justify-center items-center">
            <div className="flex flex-col items-center ">
              <div className="mt-0 w-full md:w-5/6 md:mt-12 lg:w-4/6 lg:mt-12 border-4 border-black  p-2 text-start">

                  {
                    numeroPreguntas > 0
                    ?
                      <button className="inline-flex bg-gray-800 hover:bg-gray-700  p-2 lg:p-3 md:p-3 text-sm text-white rounded-md" onClick={cambiarOculto}  > { !ocultar ? "previsualizar" : "editar" } </button>
                    :
                      null
                  }
                  { 
                    numeroPreguntas > 0
                    ?
                      <button className="inline-flex bg-green-400 hover:bg-green-300 ml-2 p-2 lg:p-3 md:p-3 text-sm text-white rounded-md" onClick={guardarDatos}  > Guardar </button>
                    :
                      <p> debes añadir una pregunta para <span className='underline'>guardar</span> y <span className='underline'>previsualizar</span> </p>
                  }

                  <EditarPrev formPrev={preguntaContent} setformPrev={setPreguntaContent} titulo={tituloForm} descripcion={descripcion} numeroPreguntas={numeroPreguntas}/>
                </div>
              </div>
            </div>
          </div>
        }

        </div>
        {/*console.log(preguntaContent)*/}
      </div>
      </div>

      
    )
}

export default EditarFormulario;