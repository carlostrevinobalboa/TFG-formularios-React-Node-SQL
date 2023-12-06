import { Link } from "react-router-dom";

function RouteError(){
    return(
        <div className="bg-indigo-300 ">
            <div className="flex justify-center h-screen w-screen items-center ">
                <div className="w-auto md:w-3/4 lg:w-1/3 flex flex-col items-center border-2 bg-white " >
                    <p className=" text-2xl font-black tracking-wide"> ERROR: Página no encontrada</p>
                    <Link className="bg-blue-400 text-blue-50 hover:bg-blue-700 text-sm border border-slate-200 rounded-lg font-medium px-4 py-2 inline-flex space-x-1 items-center mt-2" to={"/"}>Volver a inicio</Link>
                </div>
            </div>
        </div>
    )
}

export default RouteError;