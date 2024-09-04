import React from "react";

const inventarioRoute = [

    {
        key: 'inventario',
        path: `/inventario/inventario`,
        component: React.lazy(() => import('views/inventario/inventario/InventarioList')),
        authority: [],
    }
]

export default inventarioRoute;