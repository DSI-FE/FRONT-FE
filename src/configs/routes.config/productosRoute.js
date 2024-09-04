import React from "react";

const productosRoute = [

    {
        key: 'productos',
        path: `/productos/productos`,
        component: React.lazy(() => import('views/productos/productos/ProductosList')),
        authority: [],
    }
]

export default productosRoute;