import { useEffect, useState } from "react";
import { useLocation, useNavigate   } from "react-router-dom";
import swal from 'sweetalert2'
import { useRecuperarContrasena } from "../hooks";
import { useParams } from "react-router-dom";

function RecuperarContrasena(){

    const location = useLocation();
    let idFormRespuesta;
    if(location.state){
        idFormRespuesta = location.state.idFormRespuesta;
        if(idFormRespuesta){
            console.log("---------" + idFormRespuesta);
        }
    }

    const navigate = useNavigate();
    const {username} = useParams();

    const [fechaSeguridad, setFechaSeguridad] = useState(null);
    const [fechaBBDD, setFechaBBDD] = useState();

    const [contrasena, setContrasena] = useState("");

    const [controller, setController] = useState(false);

    const {dataGetFecha, updateContrasena}  = useRecuperarContrasena(username);


    useEffect(() => {
        if(dataGetFecha.length > 0){
            setFechaBBDD(dataGetFecha);
            console.log(fechaBBDD)
      }
    }, [dataGetFecha,controller,fechaBBDD]);

    const actualizarContrasena = async (e) => { 
        e.preventDefault();
        let controlador;
        try {
            controlador = await updateContrasena({
            contrasena: contrasena,
            username: username,
          })
          console.log(controlador)
    
          if(controlador === false){
            swal.fire('Debes introducir una fecha de seguidad', '', 'error')
          }else{
            navigate("/");
          }
    
        } catch (err) {
          alert("error:" + err);
        }
      }

    const submit = async (e) => {
        e.preventDefault();

        if(fechaSeguridad === null){
            swal.fire('Debes introducir una fecha de seguidad', '', 'error')
            e.preventDefault(); 
        }else{

            const fechaAux = fechaBBDD[0].verificacion;

            const fecha = new Date(fechaAux);
            const year = fecha.getFullYear();
            const month = fecha.getMonth()+1;
            const day = fecha.getDate();
            
            const fechaFormateada = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        
            if(fechaFormateada === fechaSeguridad){
                setController(true);
            }
            

        }

    }

    const handleIrAInicio = () =>{
            if(idFormRespuesta){
                navigate("/", {state: { idFormRespuesta: idFormRespuesta } })
            }else{
                navigate("/");
            }
    }

    return(
        <div className="bg-indigo-300">
            <div className="flex justify-center h-screen w-screen items-center ">
                <div className="w-full flex flex-col items-center border-2 pt-10 pb-10 bg-white sm:w-2/3 md:w-1/2 lg:w-1/3" >
                    <h1 className="text-2xl font-bold sm:text-2xl"> Recuperar contraseña </h1>

                    <form className="w-3/4 flex flex-col items-center ">

                        <div className="w-full mb-2 mt-6 ">
                            <p className="pb-1">Pregunta de seguridad del usuario: <span className="font-bold">{username}</span></p>
                            <p className="font-bold pb-1">¿Cual es tu fecha de nacimiento?</p>
                            <input type="date" id="fecha" name="fecha" onChange={(e) => setFechaSeguridad(e.target.value)} className="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"/>           
                        </div>

                        {
                            controller === true
                            ?
                            <div className="w-full mb-6 mt-2 ">
                                <div>
                                    <input type="password" id="Contrasena" placeholder="Contraseña" minLength="8" maxLength="16" name="Contrasena" onChange={(e) => setContrasena(e.target.value)} className="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"/>
                                </div>
                                <div className="mt-4">
                                    <button className="p-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700" onClick={(e) => actualizarContrasena(e)}> Cambiar contraseña </button>
                                </div>
                            </div>
                            :
                            <div className="w-2/4 mt-4">
                                <button className="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700" onClick={submit}> Comprobar </button>
                            </div>
                        }

                    </form>
                    <span className="mt-6"> Si ya tienes cuenta <button className="underline text-blue-900" onClick={handleIrAInicio}>inicia sesión aquí</button></span>

                </div>
            </div>
        </div>
    )
}

export default RecuperarContrasena;