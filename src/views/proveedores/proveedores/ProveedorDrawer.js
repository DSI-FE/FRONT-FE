import React, { useState, useEffect, useRef } from "react";
import { Upload, Input, Button, Drawer, Radio, Switcher } from 'components/ui';
import { apiCreateProveedor } from 'services/ProveedorService';

const ProveedorDrawer = ({ isOpen, eventSent, setIsOpen, drawerOpen, formType }) => {
    const [nombre, setNombre] = useState('');
    const [selectedProveedor, setSelectedProveedor] = useState(null);

    useEffect(() => {
        setIsOpen(drawerOpen);
        if (formType === "DataProveedor" && eventSent) {
            setNombre(eventSent?.extendedProps?.nombres || '');
                        
        } else {
            setNombre('');
        }
    }, [drawerOpen, formType]);

    const Footer = ({ onSave, onCancel, onReset }) => {
        return (
            <div className="flex justify-between items-center w-full">
                <Button size="sm" variant="solid" color="gray-500" onClick={onReset}>Limpiar</Button>
                <Button size="sm" variant="solid" color="gray-500" onClick={onCancel}>Salir</Button>
                <Button size="sm" variant="solid" onClick={onSave}>Guardar</Button>
            </div>
        )
    }

    // const handlePlateChange = (event) => {
    //     setPlate(event.target.value);
    // }
    // const handleCheckboxChange = (value) => {
    //     setSelectedVehicleType(value);
    // }
    // const handleBrandChange = (event) => {
    //     setBrand(event.target.value);
    // }

    // const handleModelChange = (event) => {
    //     setModel(event.target.value);
    // }

    // const handleYearChange = (event) => {
    //     setYear(event.target.value);
    // }
    // const handleSwitcherChange = (isChecked) => {
    //     setIs4WD(isChecked);
    // }

    // function getTraccionLabel(is4WD) {
    //     return is4WD ? '4WD' : '2WD';

    // }
    // const handleImageUpload = () => {
    //     const file = uploadInputRef.current.files[0];
    //     if (file) {
    //         const uniqueName = `vehicle_${Date.now()}_${file.name}`;
    //         setUploadedFile(file);
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             setPreviewURL(e.target.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const onDrawerClose = () => {
        setIsOpen(false);
    }

    const handleSubmit = async (event) => {
        // event.preventDefault();

        // const formData = new FormData();
        // formData.append('plate', plate);
        // formData.append('brand', brand);
        // formData.append('model', model);
        // formData.append('year', year);

        // if (uploadedFile) {
        //     formData.append('photo', uploadedFile);
        // }

        // try {
        //     await apiStoreVehicle(formData);
        //     onDrawerClose();
        //     clearFields();
        // } catch (error) {
        //     console.error('Error al guardar el vehículo:', error);
        // }
    };

    // const clearFields = () => {
    //     setPlate('');
    //     setBrand('');
    //     setModel('');
    //     setYear('');
    //     setUploadedFile(null);
    //     setPreviewURL(null);
    // };

    // const handleReset = () => {
    //     clearFields();
    // };

    const title = formType === "DataProveedor" ? "Editar registro del proveedor" : "Nuevo registro de proveedor";

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
            closable={false}
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
            footer={<Footer onCancel={onDrawerClose} onSave={handleSubmit} onReset={{}} />}
            width={500}
        >
            {/* <div className="p-4 flex flex-col">
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div className="mt-0 mb-4" style={{ marginRight: '10px' }}>
                            <label htmlFor="plate" className="mb-4">Placa:</label>
                            <Input
                                id="plate"
                                value={plate}
                                onChange={handlePlateChange}
                            />
                        </div>
                        <div className="mt-0 mb-4">
                            <label htmlFor="year" className="mb-4">Año:</label>
                            <Input
                                id="year"
                                value={year}
                                onChange={handleYearChange}
                            />
                        </div>
                    </div>
                    <div className="mt-4 mb-8">
                        <label htmlFor="vehicle_type">Tipo de vehículo:</label>
                        <div style={{ display: 'flex', marginTop: '20px', flexDirection: 'column' }}>
                            <Radio.Group id="vehicle_type" value={selectedVehicleType} onChange={handleCheckboxChange}>
                                <Radio value="Sedan">Sedan</Radio>
                                <Radio value="PickUp">Pick Up</Radio>
                                <Radio value="Microbus">Microbús</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="mb-8 flex justify-between items-center">
                        <label htmlFor="awd">Tracción del vehículo:</label>
                        <div style={{ width: '200px' }}>
                            <Switcher
                                checkedContent="4x4"
                                unCheckedContent="4x2"
                                onChange={handleSwitcherChange}
                            />
                        </div>
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="brand" className="mb-4">Marca:</label>
                        <Input
                            id="brand"
                            value={brand}
                            onChange={handleBrandChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="model" className="mb-4">Modelo:</label>
                        <Input
                            id="model"
                            value={model}
                            onChange={handleModelChange}
                        />
                    </div>
                    <div className="mt-0 mb-4">
                        <label htmlFor="photo" className="mb-4">Fotografía del vehículo:</label>
                        <Upload draggable onClick={() => uploadInputRef.current.click()} />
                        <input type="file" ref={uploadInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
                        {previewURL && <img src={previewURL} alt="Preview" style={{ width: "100px" }} />}
                    </div>
                </form>
            </div> */}
        </Drawer>
    )
}

export default ProveedorDrawer;
