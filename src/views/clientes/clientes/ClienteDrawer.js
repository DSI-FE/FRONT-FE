<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { Upload, Input, Button, Drawer, Radio, Switcher } from 'components/ui';
import { apiCreateCliente, apiDeleteCliente } from 'services/ClienteService';
=======
import React, { useState, useEffect } from "react";
import { Input, Button, Drawer, Notification, toast, Select } from 'components/ui';
import { apiCreateCliente, apiUpdateCliente, apiGetDepartments, apiGetMunicipios, apiGetActividades } from 'services/ClienteService';
>>>>>>> alfonsog


const ClienteDrawer = ({ isOpen, setIsOpen, cliente }) => {
    const [formData, setFormData] = useState({
        codigo: '',
        nombres: '',
        apellidos: '',
        numeroDocumento: '',
        direccion: '',
        nrc: '',
        telefono: '',
        correoElectronico: '',
        department_id: '',
        municipality_id: '',
        economic_activity_id: ''
    });;

    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [municipio, setMunicipio] = useState([]);
    const [selectedMunicipio, setSelectedMunicipio] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [selectedActividades, setSelectedActividades] = useState(null);

    useEffect(() => {
        if (cliente) {
            setFormData(cliente);
        } else {
            setFormData({
                codigo: '',
                nombres: '',
                apellidos: '',
                numeroDocumento: '',
                direccion: '',
                nrc: '',
                telefono: '',
                correoElectronico: '',
                department_id: '',
                municipality_id: '',
                economic_activity_id: ''
            });
        }

        if (cliente) {
            setFormData(cliente);
            const departamento = departamentos.find(dep => dep.id === cliente.department_id);
            const municipios = municipio.find(mun => mun.id === cliente.municipality_id);
            const actividad = actividades.find(act => act.id === cliente.economic_activity_id);

            setSelectedDepartamento(departamento ? { value: departamento.id, label: departamento.name } : null);
            setSelectedMunicipio(municipios ? { value: municipios.id, label: municipios.name } : null);
            setSelectedActividades(actividad ? { value: actividad.id, label: actividad.actividad } : null);
        } else {
            setFormData(formData);
            setSelectedDepartamento(null);
            setSelectedMunicipio(null);
            setSelectedActividades(null);
        }

        // Obtener la lista de departamentos
        const fetchDepartamentos = async () => {
            const response = await apiGetDepartments();
            setDepartamentos(response.data);
        };
        fetchDepartamentos();

        //municipios
        const fetchMunicipios = async () => {
            const response = await apiGetMunicipios();
            setMunicipio(response.data);
        };
        fetchMunicipios();

        //actividades economicas
        const fetchActividades= async () => {
            const response = await apiGetActividades();
            setActividades(response.data);
          };
          fetchActividades();

    }, [cliente]);


    //departamentos
    const handleSelectDeparChange = (selectedOption) => {
        setSelectedDepartamento(selectedOption);
        setFormData({
            ...formData,
            department_id: selectedOption.value
        });
    };

    //Departamentos
    const departamentoOptions = departamentos.map(departamento => ({
        value: departamento.id,
        label: departamento.name,
    }));

    //municipios
    const handleSelectMunicipioChange = (selectedOption) => {
        setSelectedMunicipio(selectedOption);
        setFormData({
            ...formData,
            municipality_id: selectedOption.value
        })
    };

    const municipioOptions = municipio.map(muni => ({
        value: muni.id,
        label: muni.name,
    }));

    const handleSelectActividadesChange = (selectedOption) => {
        setSelectedActividades(selectedOption);
        setFormData({
            ...formData,
            economic_activity_id: selectedOption.value
        })
      };

    const actividadesOptions = actividades.map(actividad => ({
        value: actividad.id,
        label: actividad.actividad, 
       }));



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cliente) {
            // Actualizar cliente existente
            try {
                await apiUpdateCliente(cliente.id, formData);
                const toastNotification = (
                    <Notification title="Completado" type="success">
                        El cliente se actualizó exitosamente.
                    </Notification>
                );
                toast.push(toastNotification);
                setFormData({})
            } catch (error) {
                const errorNotification = (
                    <Notification title="Error" type="danger">
                        Ocurrió un error al actualizar el cliente.
                    </Notification>
                );
                toast.push(errorNotification);
                console.error('Error al actualizar el cliente:', error);
            }
        } else {
            // Crear nuevo cliente
            try {
                await apiCreateCliente(formData);
                const toastNotification = (
                    <Notification title="Completado" type="success">
                        El cliente se registró exitosamente.
                    </Notification>
                );
                toast.push(toastNotification);
                setFormData({})
                console.log('Insertado correctamente:');
                //  handleReset();
            } catch (error) {
                const errorNotification = (
                    <Notification title="Error" type="danger">
                        Ocurrió un error al guardar el cliente.
                    </Notification>
                );
                toast.push(errorNotification);
                console.error('Error al guardar el cliente:', error);
            }

        }
        // setIsOpen(false);
        // window.location.reload();  // Refrescar la página

    };

    const onDrawerClose = () => {
        setIsOpen(false);
       // window.location.reload();
    };



    const title = cliente ? "Editar cliente" : "Nuevo cliente";

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
            closable={false}
            lockScroll={true}
            bodyClass="p-5"
            title={
                <div className="p-2" style={{ marginTop: '2px', textAlign: 'left' }}>
                    <h2 className="text-2xl font-bold mt-2" style={{ color: '#019DE1' }}>
                        {title}
                    </h2>
                    <h4 className="text-sm mt-2" style={{ color: 'grey' }}>
                        Complete el formulario...
                    </h4>
                </div>
            }
            footer={
                <div className="flex justify-between items-center w-full">
                    <Button size="sm" variant="solid" color="gray-500" onClick={() => setFormData({})}>Limpiar</Button>
                    <Button size="sm" variant="solid" color="gray-500" onClick={onDrawerClose}>Salir</Button>
                    <Button size="sm" variant="solid" onClick={handleSubmit}>Guardar</Button>
                </div>
            }
            width={500}
        >
            <div className="p-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                    <div className="mt-0 mb-4">
                        <label htmlFor="codigo" className="mb-4">Código:</label>
                        <Input
                            id="codigo"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nombres" className="mb-4">Nombres:</label>
                        <Input
                            id="nombres"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="apellidos" className="mb-4">Apellidos:</label>
                        <Input
                            id="apellidos"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="numeroDocumento" className="mb-4">Número de Documento:</label>
                        <Input
                            id="numeroDocumento"
                            name="numeroDocumento"
                            value={formData.numeroDocumento}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="direccion" className="mb-4">Dirección:</label>
                        <Input
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="nrc" className="mb-4">NRC:</label>
                        <Input
                            id="nrc"
                            name="nrc"
                            value={formData.nrc}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="telefono" className="mb-4">Teléfono:</label>
                        <Input
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="correoElectronico" className="mb-4">Correo Electrónico:</label>
                        <Input
                            id="correoElectronico"
                            name="correoElectronico"
                            value={formData.correoElectronico}
                            onChange={handleInputChange}
                        />
                    </div>


                    <div className="mb-8 flex justify-between items-center">
                        <label htmlFor="awd">Departamento:</label>
                        <div style={{ width: '350px' }}>
                            <Select
                                value={selectedDepartamento}
                                options={departamentoOptions}
                                onChange={handleSelectDeparChange}
                            />
                        </div>
                    </div>

                    <div className="mb-8 flex justify-between items-center">
                        <label htmlFor="awd">Municipio:</label>
                        <div style={{ width: '350px' }}>
                            <Select
                                value={selectedMunicipio}
                                options={municipioOptions}
                                onChange={handleSelectMunicipioChange}
                            />
                        </div>
                    </div>

                    <div className="mb-8 flex justify-between items-center">
                        <label htmlFor="awd">Act. Economica:</label>
                        <div style={{ width: '350px' }}>
                            <Select
                                value={selectedActividades}
                                options={actividadesOptions}
                                onChange={handleSelectActividadesChange}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Drawer>
    );
};

export default ClienteDrawer;
