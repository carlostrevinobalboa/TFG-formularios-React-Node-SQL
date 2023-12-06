import React from 'react';
import ReactDOM from 'react-dom'; 
import './index.css';
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"

import CrearFormulario from './componentes/CrearForm'
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import RecuperarContrasena from './componentes/RecuperarContrasena';
import AdministrarFormularios from './componentes/AdministrarFormularios'
import VisualizarFormulario from './componentes/VisualizarFormulario'
import EditarFormulario from './componentes/EditarFormulario'
import DuplicarForm from './componentes/DuplicarForm';
import Respuesta from './componentes/Respuesta';
import ExportarDatos from './componentes/ExportarDatos';
import Error404 from './componentes/RouteError';


ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/registro" element={<Registro />} />
                <Route exact path="/recuperarContrasena/:username" element={<RecuperarContrasena />} />
                <Route exact path="/formularios" element={<AdministrarFormularios />} />
                <Route exact path="/visualizarFormulario/:id" element={<VisualizarFormulario />} />
                <Route exact path="/formularios/:id" element={<EditarFormulario />} />
                <Route exact path="/crearFormulario/:id" element={<CrearFormulario />} />
                <Route exact path="/duplicarFormulario/:id/:idNew" element={<DuplicarForm />} />
                <Route exact path="/respuesta/:id" element={<Respuesta />} /> 
                <Route exact path="/exportarDatos/:id" element={<ExportarDatos />} /> 
                <Route exact path="/404" element={<Error404/>} />
                <Route path="*" element={<Navigate to='/404' replace />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)