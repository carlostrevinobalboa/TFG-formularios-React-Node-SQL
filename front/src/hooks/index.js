import { useState, useEffect } from 'react'
import API from '../api'

export function useRegistro() {
    
    const create = user => API.instance().insertUsuarios(user)
        .then(respuesta => {return respuesta})
    
    return {create}
}

export function useLogin() {

    const create = user => API.instance().getUsuarios(user)
        .then(respuesta => {return respuesta}) //recibo o un 200 o un 500 en true o false
    
    return {create}
}

export function useRecuperarContrasena(username) {

    const [data, setData] = useState({})

    useEffect(() => {
        API.instance().getPreguntaConfirmacion(username)
            .then(fechaConfirmacion => {
                setData(fechaConfirmacion)
            })
    }, [username])
    
    const updateContrasena = contrasena => API.instance().updateContrasena(contrasena)
    .then(respuesta => {return respuesta})
    
    return {dataGetFecha:data, updateContrasena}
}

export function usePreguntas(id) {
    const [data, setData] = useState({})
    const [dataIds, setDataIds] = useState({})
    const [dataIdMax, setDataIdMax] = useState({})


    useEffect(() => {
        API.instance().getPreguntas(id)
            .then(formularios => {
                setData(formularios)
            })
    }, [id])

    useEffect(() => {
        API.instance().getPreguntaMaxId(id)
            .then(maxId => {
                setDataIdMax(maxId)
            })
    }, [id])

    useEffect(() => {
        API.instance().getPreguntasIds(id)
            .then(pregunta => {
                setDataIds(pregunta)
            })
    }, [id])

    const updatePreguntas = pregunta => API.instance().updatePreguntas(pregunta)
    .then(respuesta => {return respuesta})

    const create = user => API.instance().insertPreguntas(user)
    .then(respuesta => {return respuesta}) //marcadas multiple entra con 0

    const deletePreguntas = (id) => API.instance().deletePreguntas(id)
    .then(respuesta => {return respuesta})

    return {dataGetPreguntas:data,dataGetIdsPregunta:dataIds, dataGetPreguntaMaxId:dataIdMax, updatePreguntas, deletePreguntas, create}
}

export function useFormulario(idFormulario) {


    const [data, setData] = useState({})
    const [dataExacto, setDataExacto] = useState({})
    const [id, setId] = useState({})

    useEffect(() => {
        API.instance().getFormularios()
            .then(formularios => {
                setData(formularios)
            })
    }, [])

    useEffect(() => {
        API.instance().getFormulariosExacto(idFormulario)
            .then(formulario => {
                setDataExacto(formulario)
            })
    }, [idFormulario])

    useEffect(() => {
        API.instance().getFormulariosMaxId()
            .then(idForm => {
                setId(idForm)
            })
    }, [])

    
    const create = formulario => API.instance().insertFormularios(formulario)
    .then(formulario => {return formulario})

    const updateFormulario = formulario => API.instance().updateFormularios(formulario)
    .then(respuesta => {return respuesta})

    const updateEstadoFormulario = formulario => API.instance().updateEstadoFormulario(formulario)
    .then(respuesta => {return respuesta})

    const deleteFormulario = id => API.instance().deleteFormularios(id)
    .then(respuesta => {return respuesta})

    return {dataGetFormulario:data,dataGetFormulariosExacto:dataExacto, dataGetFormularioMaxId:id ,create, deleteFormulario, updateFormulario, updateEstadoFormulario}
}

export function useRespuesta() {
    const create = respuesta => API.instance().insertRespuesta(respuesta)
        .then(respuesta => {return respuesta}) //recibo o un 200 o un 500 en true o false
    
    return {create}
}

export function useExport() {

    const obtenerCSV = (id,ids) => API.instance().obtenerCSV(id,ids)
    .then(respuesta => {return respuesta})

    const obtenerFormularioCSV = ids => API.instance().obtenerFormularioCSV(ids)
    .then(respuesta => {return respuesta})

    return {obtenerCSV,obtenerFormularioCSV}
}