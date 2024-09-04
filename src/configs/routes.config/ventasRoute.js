import React from "react";

const ventasRoute = [

    {
        key: 'ventas',
        path: `/ventas/ventas`,
        component: React.lazy(() => import('views/ventas/ventas/VentasList')),
        authority: [],
    }
]

export default ventasRoute;