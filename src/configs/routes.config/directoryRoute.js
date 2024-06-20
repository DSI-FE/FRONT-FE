import React from 'react'
import { DIRECTORY_PREFIX_PATH } from 'constants/route.constant';

const title = 'Directorio';

const directoryRoute =
[

    {
        key: 'directory.employees',
        path: `${DIRECTORY_PREFIX_PATH}/employees`,
        component: React.lazy(() => import('views/directory/Employees')),
        authority: [],
        base:{
            title:title,
            subtitle:'Empleados',
            info:'Lista de empleado activos y sus respectivos contactos',
        }
    }
]
export default directoryRoute