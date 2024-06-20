import React from "react";

const transportRoute = [

    {
        key: 'clientes',
        path: `/clientes/clientes`,
        component: React.lazy(() => import('views/clientes/clientes/ClienteList')),
        authority: [],
    }
]

export default transportRoute;