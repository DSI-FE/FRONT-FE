import React from 'react'
import { OUR_JOB_PREFIX_PATH } from 'constants/route.constant';

const title = 'Nuestro trabajo';

const options = [
    {title:'Galeria',key:'ourJob.gallery',path:`${OUR_JOB_PREFIX_PATH}/gallery`,pos:[1, 60]},
    {title:'Configuraciones',key:'ourJob.gallery',path:`${OUR_JOB_PREFIX_PATH}/settings/gallery`,pos:[1, 60]},
];

const setSubOptions = [
    {title:'Galeria',key:'ourJob.settings.gallery',path:`${OUR_JOB_PREFIX_PATH}/settings/gallery`},
]


const ourJobRoute =
[
    {
        key: 'ourJob.gallery',
        generalKey: 'ourJob',
        path: `${OUR_JOB_PREFIX_PATH}/gallery`,
        component: React.lazy(() => import('views/ourJob/Gallery')),
        authority: [],
        base:{
            title:title,
            subtitle:'Galeria Dígital',
            info:'Encuentra accesos directos a las galerías de imágenes de nuestros eventos',
            options:options
        },
        index:1
    },
    {
        key: 'ourJob.settings',
        generalKey: 'ourJob',
        path: `${OUR_JOB_PREFIX_PATH}/settings`,
        component: React.lazy(() => import('views/ourJob/Settings')),
        authority: [],
        base:{
            title:title,
            subtitle:'Configuraciones',
            info:'',
            options:options,
            subOptions:setSubOptions
        },
        index:1,
    },

    {
        key: 'ourJob.settings.gallery',
        generalKey: 'ourJob',
        path: `${OUR_JOB_PREFIX_PATH}/settings/gallery`,
        component: React.lazy(() => import('views/ourJob/Settings/gallery')),
        authority: [],
        base:{
            title:title,
            subtitle:'Galeria',
            info:'Configuraciones correspondientes a la galeria de eventos',
            options:options,
            subOptions:setSubOptions
        },
        index:2,
        subIndex:1
    },
    


    
]
export default ourJobRoute