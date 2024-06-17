import React from 'react'
import { MEDIA_PREFIX_PATH } from 'constants/route.constant';

const title = 'Medios de Comunicación';

const options = [
    {title:'Revista',key:'media.magazine',path:`${MEDIA_PREFIX_PATH}/magazine`},
    {title:'Noticiero',key:'media.news',path:`${MEDIA_PREFIX_PATH}/news`},
    {title:'Configuraciones',key:'media.settings.magazine',path:`${MEDIA_PREFIX_PATH}/settings/magazine`, pos:[1, 60]},
];

const setSubOptions = [
    {title:'Revistas',key:'media.settings.magazine',path:`${MEDIA_PREFIX_PATH}/settings/magazine`},
    {title:'Noticiero',key:'media.settings.news',path:`${MEDIA_PREFIX_PATH}/settings/news`},
]

const ourJobRoute =
[
    {
        key: 'media.magazine',
        generalKey: 'media',
        path: `${MEDIA_PREFIX_PATH}/magazine`,
        component: React.lazy(() => import('views/media/Magazine')),
        authority: [],
        base:{
            title:title,
            subtitle:'Revista Digital',
            info:'Mantente al tanto de las labores realizadas por DSI en favor de la población salvadoreña',
            options:options
        },
        index:1
    },
    
    {
        key: 'media.news',
        generalKey: 'media',
        path: `${MEDIA_PREFIX_PATH}/news`,
        component: React.lazy(() => import('views/media/News')),
        authority: [],
        base:{
            title:title,
            subtitle:'Noticiero',
            info:'Mantente al tanto de las labores realizadas por DSI en favor de la población salvadoreña',
            options:options
        },
        index:1
    },

    {
        key: 'media.settings.magazine',
        generalKey: 'media',
        path: `${MEDIA_PREFIX_PATH}/settings/magazine`,
        component: React.lazy(() => import('views/media/Settings/magazine')),
        authority: [],
        base:{
            title:title,
            subtitle:'Configuraciones',
            info:'Configuraciones correspondientes a los medios de comunicación',
            options:options,
            subOptions:setSubOptions
        },
        index:2,
        subIndex:1
    },
    {
        key: 'media.settings.news',
        generalKey: 'media',
        path: `${MEDIA_PREFIX_PATH}/settings/news`,
        component: React.lazy(() => import('views/media/Settings/news')),
        authority: [],
        base:{
            title:title,
            subtitle:'Configuraciones',
            info:'Configuraciones correspondientes a los medios de comunicación',
            options:options,
            subOptions:setSubOptions
        },
        index:2,
        subIndex:2
    },
    


    
]
export default ourJobRoute