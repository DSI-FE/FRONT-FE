import React, { useEffect, useState } from "react";
import { setOpenDrawerAddEmployee, setNewEmployee } from "../store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Card, DatePicker, Drawer, Input, Select, Steps, Switcher, Upload } from "components/ui";
import { HiOutlinePlus } from "react-icons/hi";
import { FaTimesCircle } from "react-icons/fa";
import OpenNotification from "./OpenNotification";
import BaseService from "services/BaseService";
import moment from "moment";
import 'dayjs/locale/es';

const NewEmployeeDrawer = () => {
    const dispatch = useDispatch();

    const drawerOpen = useSelector((state) => state.employee.state.openDrawerAddEmployee);

    const title = (
        <div>
            <h5 className="flex items-center justify-start gap-2 mb-2 text-slate-600">Agregar Colaborador</h5>
        </div>
    )

    const onCancel = () => {
        onDrawerClose();
    }

    const Footer = ({ onCancel, onSave }) => {
        return (
            <div className="flex items-center justify-between w-full">
                <Button size="sm" variant="solid" loading={sending} color="gray-500" onClick={onCancel}>Salir</Button>
                <Button size="sm" variant="solid" loading={sending} onClick={onSave} disabled={disabledSubmit}>Guardar</Button>
            </div>
        )
    }

    const resetUpload = () => {
        setAvatarImg(null)
    }

    const onDrawerClose = () => {
        setStep(0);
        setName("");
        setFile(null);
        setLastname("");
        setPersonalPhone("");
        setPhoneError("");
        setPersonalEmail("");
        setEmailError("");
        setDui("");
        setDuiError("");
        setNit("");
        setNup("");
        setIsss("");
        setMh("");
        setDsi("");
        setSelectedGender(null);
        setSelectedMaritalStatus(null);
        setBirthDay("");
        setChildren(true);
        setVehicle(false);
        /*setCarMakeSelected(null);
        setCarModelSelected(null);
        setCarYear('');
        setCarColor('');
        setCarLicensePlate('');*/
        setDisabled(false);
        setSelectedDepartment("");
        setMunicipalities(null);
        setSelectedMunicipality("");
        setLoadingMunicipalities(true);
        setUrbanization('');
        setStreet('');
        setHouseNumber('');
        setComplement('');
        setLoadingOrganizationalUnits(false);
        setSelectedOrganizationalUnit('');
        setLoadingFunctionalPositions(false);
        setSelectedFunctionalPosition('');
        setFunctionalPositions(null);
        setSalary('');
        setDateStart('');
        setMarkingRequired(true);
        setViatic(false);
        setExternal(false);
        setSelectedSchedule('');
        setLoadingApplicants(false);
        setSelectedApplicant('');
        setLoadingApplicants(false);
        setSelectedApplicant('');
        setDesktop(false);
        setPortable(false);
        setMobile(false);
        setRequestEmail(false);
        setRequestIpPhone(false);
        setParking(false);

        setSending(false);

        dispatch(setOpenDrawerAddEmployee(false));
        resetUpload();
    };

    const [step, setStep] = useState(0);

    const [avatarImg, setAvatarImg] = useState('');
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [personalPhone, setPersonalPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [personalEmail, setPersonalEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [dui, setDui] = useState("");
    const [duiError, setDuiError] = useState("");
    const [nit, setNit] = useState("");
    const [nitError, setNitError] = useState("");
    const [nup, setNup] = useState("");
    const [isss, setIsss] = useState("");
    const [mh, setMh] = useState("");
    const [dsi, setDsi] = useState("");
    const [genders, setGenders] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [loadingGenders, setLoadingGenders] = useState(null);
    const [maritalStatuses, setMaritalStatuses] = useState(null);
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState(null);
    const [loadingMaritalStatuses, setLoadingMaritalStatuses] = useState(null);
    const [birthDay, setBirthDay] = useState('');
    const [carMakesLoading, setCarMakesLoading] = useState(false);
    const [carMakes, setCarMakes] = useState(null);
    const [carMakeSelected, setCarMakeSelected] = useState(null);
    const [carModelsLoading, setCarModelsLoading] = useState(false);
    const [carModels, setCarModels] = useState(null);
    const [carModelSelected, setCarModelSelected] = useState(null);
    const [carYear, setCarYear] = useState("");
    const [carColor, setCarColor] = useState("");
    const [carLicensePlate, setCarLicensePlate] = useState("");
    const [children, setChildren] = useState(false);
    const [departments, setDepartments] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [municipalities, setMunicipalities] = useState(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
    const [urbanization, setUrbanization] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [organizationalUnits, setOrganizationalUnits] = useState(null);
    const [selectedOrganizationalUnit, setSelectedOrganizationalUnit] = useState('');
    const [loadingOrganizationalUnits, setLoadingOrganizationalUnits] = useState(false);
    const [functionalPositions, setFunctionalPositions] = useState(null);
    const [selectedFunctionalPosition, setSelectedFunctionalPosition] = useState('');
    const [loadingFunctionalPositions, setLoadingFunctionalPositions] = useState('');
    const [salary, setSalary] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [adhonorem, setAdhonorem] = useState(false);
    const [markingRequired, setMarkingRequired] = useState(true);
    const [viatic, setViatic] = useState(false);
    const [vehicle, setVehicle] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [external, setExternal] = useState(false);
    const [schedules, setSchedules] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [loadingSchedules, setLoadingSchedules] = useState('');
    const [applicants, setApplicants] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState('');
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [desktop, setDesktop] = useState(false);
    const [portable, setPortable] = useState(false);
    const [mobile, setMobile] = useState(false);
    const [requestEmail, setRequestEmail] = useState(false);
    const [requestIpPhone, setRequestIpPhone] = useState(false);
    const [parking, setParking] = useState(false);
    const [disabledSubmit, setDisabledSubmit] = useState(true);

    const [sending, setSending] = useState(false);

    useEffect(() => {
        const validateFields =
            name &&
            lastname &&
            personalEmail &&
            dui &&
            nit &&
            selectedGender &&
            selectedMaritalStatus &&
            birthDay &&
            selectedDepartment &&
            selectedMunicipality &&
            urbanization &&
            street &&
            houseNumber &&
            selectedOrganizationalUnit &&
            selectedFunctionalPosition &&
            dateStart &&
            selectedSchedule &&
            selectedApplicant &&
            step === 3;

        console.log({
            name, lastname, personalEmail, dui, nit, selectedGender, selectedMaritalStatus, birthDay,
            selectedDepartment, selectedMunicipality, urbanization, street, houseNumber,
            selectedOrganizationalUnit, selectedFunctionalPosition, dateStart, selectedSchedule, selectedApplicant, step
        });

        setDisabledSubmit(!Boolean(validateFields));
    }, [
        name,
        lastname,
        personalEmail,
        dui,
        nit,
        selectedGender,
        selectedMaritalStatus,
        birthDay,
        selectedDepartment,
        selectedMunicipality,
        urbanization,
        street,
        houseNumber,
        complement,
        selectedOrganizationalUnit,
        selectedFunctionalPosition,
        dateStart,
        selectedSchedule,
        selectedApplicant,
        step
    ]);

    const onChange = (nextStep) => {
        if (nextStep < 0) {
            setStep(0);
        } else if (nextStep > 3) {
            setStep(3);
        } else {
            setStep(nextStep);
        }
    }

    const onNext = () => onChange(step + 1);
    const onPrevious = () => onChange(step - 1);

    const stepsTitles = [
        { title: "Información Personal" },
        { title: "Dirección principal" },
        { title: "Información Laboral" },
        { title: "Solicitud de creación de usuario" }
    ];

    const onFileUpload = (file) => {
        setAvatarImg(URL.createObjectURL(file[0]));
        setFile(file[0]);
    }

    const beforeUpload = (files) => {
        let valid = true;

        const allowedFileType = ['image/jpeg']

        for (let file of files) {
            if (!allowedFileType.includes(file.type)) {
                valid = 'La imagen debe de ser JPG.'
            }
        }

        return valid
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    };

    const handlePersonalPhoneChange = (event) => {
        const value = (event.target.value);
        setPersonalPhone(value);

        if (value !== '' && !validatePhone(value)) { // value puede ser vacío y debe de cumplir con la expresión regular
            setPhoneError("El Teléfono personal debe tener el formato correcto (ejemplo: 7777-7777)");
        } else {
            setPhoneError('');
        }
    }

    const validatePhone = (personalPhone) => {
        const phoneRegex = /^\d{4}-\d{4}$/;
        return phoneRegex.test(personalPhone);
    }

    const handlePersonalEmailChange = (event) => {
        const value = (event.target.value);
        setPersonalEmail(value);

        if (value !== '' && !validateEmail(value)) {
            setEmailError("El Email personal debe tener el formato correcto (ejemplo: usuario@servidor.dominio)");
        } else {
            setEmailError("");
        }
    }

    const validateEmail = (personalEmail) => {
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailRegex.test(personalEmail);
    }

    const handleDuiChange = (event) => {
        const value = event.target.value;
        setDui(value);

        if (value.trim() === "") { // Si value es vacío
            setDuiError("El DUI es requerido");
        } else if (!validateDui(value)) {  // Si no cumple con la expresión regular
            setDuiError("El DUI debe tener el formato correcto (ejemplo: 12345678-9)");
        } else {
            setDuiError("");
        }
    }

    const validateDui = (dui) => {
        const duiRegex = /^\d{8}-\d$/;
        return duiRegex.test(dui);
    }

    const handleNitChange = (event) => {
        const value = event.target.value;
        setNit(value);

        if (value.trim() === "") {
            setNitError("El NIT es requerido");
        } else if (!validateNit(value)) {
            setNitError("El NIT debe tener el formato correcto (ejemplo: 1234-123456-123-1)");
        } else {
            setNitError("");
        }
    }

    const validateNit = (nit) => {
        const nitRegex = /^\d{4}-\d{6}-\d{3}-\d{1}/;
        return nitRegex.test(nit);
    }

    const handleNupChange = (event) => {
        const value = event.target.value;
        setNup(value);
    }

    const handleIsssChange = (event) => {
        const value = event.target.value;
        setIsss(value);
    }

    const handleMhChange = (event) => {
        const value = event.target.value;
        setMh(value);
    }

    const handleDsiChange = (event) => {
        const value = event.target.value;
        setDsi(value);
    }

    useEffect(() => {
        const fetchGenders = async () => {
            setLoadingGenders(true);
            try {
                const response = await BaseService.get('/administration/active-genders');
                const data = await response.data;

                const options = data.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingGenders(false);
                setGenders(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al obtener los Géneros: ', error);
            }
        };

        const fetchMaritalStatuses = async () => {
            setLoadingMaritalStatuses(true);
            try {
                const response = await BaseService.get('/administration/active-marital-statuses');
                const data = await response.data;

                const options = data.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingMaritalStatuses(false);
                setMaritalStatuses(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al obtener los Estados Familiares: ', error);
            }
        };

        /*const fecthCarMakes = async () => {
            setCarMakesLoading(true);
            try {
                const response = await BaseService.get('/administration/car-makes');
                const data = await response.data;

                const options = data.map(({name, id}) => ({ value: id, label: name }));
                setCarMakesLoading(false);
                setCarMakes(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al obtener las Marcas de Vehículos: ', error);
            }
        }*/

        const fetchDepartments = async () => {
            setLoadingDepartments(true);
            try {
                const response = await BaseService.get('/administration/departments');
                const data = await response.data;

                const options = data.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingDepartments(false);
                setDepartments(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al obtener los Departamentos: ', error);
            }
        }

        const fetchOrganizationalUnits = async () => {
            setLoadingOrganizationalUnits(true);
            try {
                const response = await BaseService.get('/administration/active-organizational-units');
                const data = await response.data;

                const options = data.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingOrganizationalUnits(false);
                setOrganizationalUnits(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al cargar los datos: ', error);
            }
        }

        const fetchSchedules = async () => {
            setLoadingSchedules(true);
            try {
                const response = await BaseService.get('/attendance/active-schedules');
                const data = await response.data;

                const options = data.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingSchedules(false);
                setSchedules(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al cargar los datos: ', error);
            }
        }

        const fetchApplicants = async () => {
            setLoadingApplicants(true);
            try {
                const response = await BaseService.get('/administration/active-employees');
                const data = await response.data;

                const options = data.map(({ name, id }) => ({ value: id, label: name }));
                setApplicants(options);
                setLoadingApplicants(false);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al cargar los datos: ', error);
            }
        }

        fetchGenders();
        fetchMaritalStatuses();
        fetchDepartments();
        fetchOrganizationalUnits();
        fetchSchedules();
        fetchApplicants();
    }, []);

    const handleGenderChange = (selectedOption) => {
        setSelectedGender(selectedOption);
    };

    const handleMaritalStatusChange = (selectedOption) => {
        setSelectedMaritalStatus(selectedOption);
    };

    const handleChildrenChange = (value) => {
        setChildren(!value);
    }

    const handleBirthdayPicker = (date) => {
        setBirthDay(date);
    }

    const handleDepartmentChange = (selectedOption) => {
        setSelectedDepartment(selectedOption);
        setSelectedMunicipality('');
        setMunicipalities(null);

        const fetchMunicipalities = async () => {
            setLoadingMunicipalities(true);
            try {
                const response = await BaseService.get('/administration/departments/' + selectedOption.value);
                const data = await response.data;

                const options = data.municipalities.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingMunicipalities(false);
                setMunicipalities(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al obtener los Municipios: ', error);
            }
        }

        fetchMunicipalities();
    }

    const handleMunicipalityChange = (selectedOption) => {
        setSelectedMunicipality(selectedOption);
    }

    const handleUrbanizationChange = (event) => {
        const value = (event.target.value);
        setUrbanization(value);
    }

    const handleStreetChange = (event) => {
        const value = (event.target.value);
        setStreet(value);
    }

    const handleHouseNumberChange = (event) => {
        const value = (event.target.value);
        setHouseNumber(value);
    }

    const handleComplementChange = (event) => {
        const value = (event.target.value);
        setComplement(value);
    }

    const handleOrganizationalUnitChange = (selectedOption) => {
        setSelectedOrganizationalUnit(selectedOption);
        setSelectedFunctionalPosition('');
        setFunctionalPositions(null);

        const fetchFunctionalPositions = async () => {
            setLoadingFunctionalPositions(true);
            try {
                const response = await BaseService.get('/administration/organizational-units/' + selectedOption.value);
                const data = await response.data;

                const options = data.functional_positions.map(({ name, id }) => ({ value: id, label: name }));
                setLoadingFunctionalPositions(false);
                setFunctionalPositions(options)
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error obteniendo los Cargos Funcionales: ', error);
            }
        }

        fetchFunctionalPositions();
    }

    const handleFunctionalPositionChange = (selectedOption) => {
        setSelectedFunctionalPosition(selectedOption);
    }

    const handleSalaryChange = (event) => {
        const value = (event.target.value);
        setSalary(value);
    }

    const handleDateStartPicker = (date) => {
        setDateStart(date);
    }

    const handleAdhonoremChange = (value) => {
        setAdhonorem(!value);
    }

    const handleMarkingRequiredChange = (value) => {
        setMarkingRequired(!value);
    }

    const handleViaticChange = (value) => {
        setViatic(!value);
    }

    const handleVehicleChange = (value) => {
        setVehicle(!value);
    }

    /*const handleCarMakeChange = (selectedOption) => {
        setCarMakeSelected(selectedOption);
        setCarModelSelected('');
        setCarModels(null);

        const fetchCarModels = async () => {
            setCarModelsLoading(true);
            try {
                const response = await BaseService.get('/administration/car-models/' + selectedOption.value);
                const data = await response.data;

                const options = data.municipalities.map(({name, id}) => ({ value:id, label: name}));
                setCarModelsLoading(false);
                setCarModels(options);
            } catch (error) {
                OpenNotification('danger', 'Error', error, 'top-start', 5000);
                console.log('Error al obtener los Modelos de Vehículos: ', error);
            }
        }

        fetchCarModels();
    }*/

    const handleCarModelChange = (selectedOption) => {
        setCarModelSelected(selectedOption);
    }

    const handleCarYearChange = (value) => {
        setCarYear(value);
    }

    const handleCarColorChange = (value) => {
        setCarColor(value);
    }

    const handleCarLicensePlateChange = (value) => {
        setCarLicensePlate(value);
    }

    const handleDisabledChange = (value) => {
        setDisabled(!value);
    }

    const handleExternalChange = (value) => {
        setExternal(value);
    }

    const handleSchedulesChange = (selectedOption) => {
        setSelectedSchedule(selectedOption);
    }

    const handleApplicantsChange = (selectedOption) => {
        setSelectedApplicant(selectedOption);
    }

    const handleDesktopChange = (value) => {
        setDesktop(!value);
    }

    const handlePortableChange = (value) => {
        setPortable(!value);
    }

    const handleMobileChange = (value) => {
        setMobile(!value);
    }

    const handleRequestEmailChange = (value) => {
        setRequestEmail(!value);
    }

    const handleRequestIpPhone = (value) => {
        setRequestIpPhone(!value);
    }

    const handleParkingChange = (value) => {
        setParking(!value);
    }

    const stepContents = {
        0: <> { /** PASO 1 */}
            <div className="flex flex-row mt-4">
                <div className="basis-2/3">
                    <div className="mb-4">
                        <label className="required">Nombres</label>
                        <Input
                            id='name'
                            value={name}
                            size='sm'
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="required">Apellidos</label>
                        <Input
                            id='lastname'
                            value={lastname}
                            size='sm'
                            onChange={handleLastnameChange}
                        />
                    </div>
                </div>
                <div className="pt-6 basis-1/3 text-end justify-self-end">
                    <div className="flex justify-end pl-12 text-red-500">{avatarImg ? <FaTimesCircle className="cursor-pointer" color="red-500" onClick={resetUpload} /> : null}</div>
                    <Upload
                        name='photo'
                        accept='application/jpg'
                        className="border-2 border-solid rounded-lg cursor-pointer border-slate-400"
                        onChange={onFileUpload}
                        showList={false}
                        uploadLimit={1}
                        beforeUpload={beforeUpload}
                    >
                        <Avatar size={90} src={avatarImg} icon={<HiOutlinePlus />} />
                    </Upload>
                </div>
            </div>
            <div className="flex flex-row mb-4">
                <div className="mr-4 basis-1/3">
                    <label>Teléfono personal</label>
                    <Input
                        id='phone_personal'
                        name='phone_personal'
                        size='sm'
                        value={personalPhone}
                        onChange={handlePersonalPhoneChange}
                    />
                    {phoneError && <span className="text-xs text-red-500">{phoneError}</span>}
                </div>
                <div className="basis-2/3">
                    <label className="required">Email personal</label>
                    <Input
                        id='email_personal'
                        name='phone_personal'
                        size='sm'
                        value={personalEmail}
                        onChange={handlePersonalEmailChange}
                    />
                    {emailError && <span className="text-xs text-red-500">{emailError}</span>}
                </div>
            </div>
            <div className="flex mb-4">
                <div className="mr-4 w-50">
                    <label className="required">DUI</label>
                    <Input
                        id='dui'
                        name='dui'
                        size='sm'
                        value={dui}
                        onChange={handleDuiChange}
                    />
                    {duiError && <span className="text-xs text-red-500">{duiError}</span>}
                </div>
                <div className="w-50">
                    <label className="required">NIT</label>
                    <Input
                        id='nit'
                        name='nit'
                        size='sm'
                        value={nit}
                        onChange={handleNitChange}
                    />
                    {nitError && <span className="text-xs text-red-500">{nitError}</span>}
                </div>
            </div>

            <div className="flex mb-4">
                <div className="mr-4 w-50">
                    <label htmlFor="">NUP</label>
                    <Input
                        id='nup'
                        name='nup'
                        size='sm'
                        value={nup}
                        onChange={handleNupChange}
                    />
                </div>
                <div className="w-50">
                    <label htmlFor="">ISSS</label>
                    <Input
                        id='isss'
                        name='isss'
                        size='sm'
                        value={isss}
                        onChange={handleIsssChange}
                    />
                </div>
            </div>

            <div className="flex mb-4">
                <div className="mr-4 w-50">
                    <label htmlFor="">C&oacute;digo Ministerio de Hacienda</label>
                    <Input
                        id='mh'
                        name='mh'
                        size='sm'
                        value={mh}
                        onChange={handleMhChange}
                    />
                </div>
                <div className="w-50">
                    <label htmlFor="">C&oacute;digo empleado</label>
                    <Input
                        id='dsi'
                        name='dsi'
                        size='sm'
                        value={dsi}
                        onChange={handleDsiChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="required">G&eacute;nero</label>
                <label className="required">Estado Familiar</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Select
                    id={'gender'}
                    name={'gender'}
                    size='sm'
                    isLoading={loadingGenders}
                    isDisabled={loadingGenders}
                    placeholder={'Seleccionar'}
                    options={genders}
                    value={selectedGender}
                    onChange={handleGenderChange}
                />
                <Select
                    id={'marital_status'}
                    name={'marital_status'}
                    size='sm'
                    isLoading={loadingMaritalStatuses}
                    isDisabled={loadingMaritalStatuses}
                    placeholder={'Seleccionar'}
                    options={maritalStatuses}
                    value={selectedMaritalStatus}
                    onChange={handleMaritalStatusChange}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <label></label>
                <label className="required">Fecha de nacimiento</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                    <Switcher
                        id='children'
                        name='children'
                        checked={children}
                        onChange={handleChildrenChange}
                        // checkedContent={withIcon(<FaBaby />)}
                        // checkedContent="Con Hijos"
                        // unCheckedContent="Sin Hijos "
                        className='mr-4'
                    />
                    <label htmlFor="children">{children ? 'Con Hijos' : 'Sin Hijos'}</label>
                </div>
                <DatePicker
                    placeholder="Seleccionar"
                    value={birthDay}
                    onChange={handleBirthdayPicker}
                    size='sm'
                    locale="es"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-2">
                <div>
                    <Switcher
                        id='vehicle'
                        name='vehicle'
                        checked={vehicle}
                        onChange={handleVehicleChange}
                        className='mr-4'
                    />
                    <label htmlFor="vehicle">{vehicle ? 'Posee Vehículo' : 'Sin Vehículo'}</label>
                </div>
            </div>
            { /*vehicle && (
                <Card
                    className="m-2 p-0"
                >
                    <h6>Información de Veh&iacute;culo</h6>
                </Card>
            )*/ }
            <div className="grid grid-cols-1 gap-4 mb-2">
                <div>
                    <Switcher
                        id='disabled'
                        name='disabled'
                        checked={disabled}
                        onChange={handleDisabledChange}
                        className='mr-4'
                    />
                    <label htmlFor="disabled">{disabled ? 'Persona con necesidades especiales' : 'Persona sin necesidades especiales'}</label>
                </div>
            </div>
        </>,
        1: <>{ /** PASO 2 */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="required">Departamento</label>
                <label className="required">Municipio</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Select
                    id='department'
                    name='department'
                    isDisabled={loadingDepartments}
                    isLoading={loadingDepartments}
                    placeholder='Seleccionar'
                    options={departments}
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                />
                <Select
                    id='municipality'
                    name='municipality'
                    isDisabled={!municipalities || loadingMunicipalities}
                    isLoading={loadingMunicipalities}
                    placeholder='Seleccionar'
                    options={municipalities}
                    value={selectedMunicipality}
                    onChange={handleMunicipalityChange}
                />
            </div>
            <div className="grid grid-cols-1 mb-4">
                <label className="mb-0 required">Urbanización / Residencial / Colonia</label>
                <Input
                    id='urbanization'
                    name='urbanization'
                    size='sm'
                    value={urbanization}
                    onChange={handleUrbanizationChange}
                />
            </div>
            <div className="flex flex-row mt-4 mb-4">
                <div className="pr-2 basis-2/3">
                    <label className="required">Calle / Polígono / Pasaje</label>
                    <Input
                        id='street'
                        name='street'
                        size='sm'
                        value={street}
                        onChange={handleStreetChange}
                    />
                </div>
                <div className="pl-2 basis-1/3">
                    <label className="required"># de Casa</label>
                    <Input
                        id='houseNumber'
                        name='houseNumber'
                        size='sm'
                        value={houseNumber}
                        onChange={handleHouseNumberChange}
                    />
                </div>
            </div>
            <div className="mb-4">
                <label>Observaciones y/o notas</label>
                <Input
                    id='complement'
                    name='complement'
                    value={complement}
                    onChange={handleComplementChange}
                    textArea
                />
            </div>
        </>,
        2: <>{ /** PASO 3 */}
            <div className="grid grid-cols-2 gap-4 mt-4 mb-2">
                <label className="required">Unidad</label>
                <label className="required">Cargo</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Select
                    id='organizationalUnit'
                    name='organizationalUnit'
                    isDisabled={loadingOrganizationalUnits}
                    isLoading={loadingOrganizationalUnits}
                    placeholder='Seleccionar'
                    options={organizationalUnits}
                    value={selectedOrganizationalUnit}
                    onChange={handleOrganizationalUnitChange}
                    size='sm'
                />
                <Select
                    id='functionalPosition'
                    name='functionalPosition'
                    isDisabled={!functionalPositions || loadingFunctionalPositions}
                    isLoading={loadingFunctionalPositions}
                    placeholder='Seleccionar'
                    options={functionalPositions}
                    value={selectedFunctionalPosition}
                    onChange={handleFunctionalPositionChange}
                    size='sm'
                />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <label>Salario</label>
                <label className="required">Fecha de Ingreso</label>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <Input
                    id='salary'
                    name='salary'
                    size="sm"
                    value={salary}
                    onChange={handleSalaryChange}
                />
                <DatePicker
                    placeholder="Seleccionar"
                    value={dateStart}
                    onChange={handleDateStartPicker}
                    size='sm'
                />
            </div>
            <div className="grid grid-cols-1 gap-2 mb-8">
                <label className="required">Horario de Trabajo</label>
                <Select
                    id='schedules'
                    name='schedules'
                    isDisabled={loadingSchedules}
                    isLoading={loadingSchedules}
                    placeholder='Seleccionar'
                    options={schedules}
                    value={selectedSchedule}
                    onChange={handleSchedulesChange}
                />
            </div>
            <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="mb-4">
                    <Switcher
                        id='adhonorem'
                        name='adhonorem'
                        checked={adhonorem}
                        onChange={handleAdhonoremChange}
                        className='mr-4'
                    />
                    <label htmlFor="adhonorem">{adhonorem ? 'Ad Honorem' : 'Remunerado'}</label>
                </div>
                <div className="mb-4">
                    <Switcher
                        id='markingRequired'
                        name='markingRequired'
                        checked={markingRequired}
                        onChange={handleMarkingRequiredChange}
                        // checkedContent="Requiere Marcación"
                        // unCheckedContent="Sin Marcación "
                        className='mr-4'
                    />
                    <label htmlFor="markingRequired">{markingRequired ? 'Requiere Marcación' : 'No requiere Marcación'}</label>
                </div>
                <div className="mb-4">
                    <Switcher
                        id='viatic'
                        name='viatic'
                        checked={viatic}
                        onChange={handleViaticChange}
                        // checkedContent="Con derecho a Viáticos"
                        // unCheckedContent="Sin derecho a Viáticos "
                        className='mr-4'
                    />
                    <label htmlFor="viatic">{viatic ? 'Con derecho a Viáticos' : 'Sin derecho a Viáticos'}</label>
                </div>
                <div className="">
                    <Switcher
                        id='external'
                        name='external'
                        checked={!external}
                        onChange={handleExternalChange}
                        // checkedContent="Colaborador Externo"
                        // unCheckedContent="Colaborador Interno "
                        className='mr-4'
                    />
                    <label htmlFor="external">{external ? 'Colaborador Externo' : 'Colaborador Interno'}</label>
                </div>
            </div>
        </>,
        3: <>{ /** PASO 4 */}
            <div className="grid grid-cols-1 gap-2 mt-2 mb-8">
                <label className="required">Solicitante</label>
                <Select
                    id='applicant'
                    name='applicant'
                    isDisabled={loadingApplicants}
                    isLoading={loadingApplicants}
                    placeholder='Seleccionar'
                    options={applicants}
                    value={selectedApplicant}
                    onChange={handleApplicantsChange}
                />
            </div>
            <label>Equipo Requerido:</label>
            <Card className="mb-6">
                <div className="mb-4">
                    <Switcher
                        id='desktop'
                        name='desktop'
                        checked={desktop}
                        onChange={handleDesktopChange}
                        className='mr-4'
                    />
                    <label htmlFor="desktop">{desktop ? 'Con computadora de Escritorio' : 'Sin computadora de Escritorio'}</label>
                </div>
                <div className="mb-4">
                    <Switcher
                        id='portable'
                        name='portable'
                        checked={portable}
                        onChange={handlePortableChange}
                        className='mr-4'
                    />
                    <label htmlFor="portable">{portable ? 'Con computadora Portátil' : 'Sin computadora Portátil'}</label>
                </div>
                <div className="">
                    <Switcher
                        id='mobile'
                        name='mobile'
                        checked={mobile}
                        onChange={handleMobileChange}
                        className='mr-4'
                    />
                    <label htmlFor="mobile">{mobile ? 'Con teléfono móvil' : 'Sin teléfono móvil'}</label>
                </div>
            </Card>
            <label>Acceso a aplicaciones y recursos</label>
            <Card>
                <div className="mb-4">
                    <Switcher
                        id='requestEmail'
                        name='requestEmail'
                        checked={requestEmail}
                        onChange={handleRequestEmailChange}
                        className='mr-4'
                    />
                    <label htmlFor="requestEmail">{requestEmail ? 'Con correo institucional' : 'Sin correo institucional'}</label>
                </div>
                <div className="mb-4">
                    <Switcher
                        id='requestIpPhone'
                        name='requestIpPhone'
                        checked={requestIpPhone}
                        onChange={handleRequestIpPhone}
                        className='mr-4'
                    />
                    <label htmlFor="requestIpPhone">{requestIpPhone ? 'Con teléfono IP' : 'Sin teléfono IP'}</label>
                </div>
                <div className="">
                    <Switcher
                        id='parking'
                        name='parking'
                        checked={parking}
                        onChange={handleParkingChange}
                        className='mr-4'
                    />
                    <label htmlFor="parking">{parking ? 'Requiere Parqueo' : 'No Requiere Parqueo'}</label>
                </div>
            </Card>
        </>,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('lastname', lastname);
            file && formData.append('photo', file);
            personalPhone && formData.append('phone_personal', personalPhone);
            personalEmail && formData.append('email_personal', personalEmail);
            formData.append('dui', dui);
            formData.append('nit', nit);
            formData.append('nup', nup);
            formData.append('isss', isss);
            formData.append('dsi', dsi);
            formData.append('adm_gender_id', selectedGender.value);
            formData.append('adm_marital_status_id', selectedMaritalStatus.value);
            formData.append('children', children);
            formData.append('birthday', birthDay ? moment(birthDay).format('YYYY-MM-DD') : '');
            formData.append('adm_municipality_id', selectedMunicipality.value);
            formData.append('urbanization', urbanization);
            formData.append('street', street);
            formData.append('number', houseNumber);
            complement && formData.append('complement', complement);
            formData.append('adm_organizational_unit_id', selectedOrganizationalUnit.value);
            formData.append('adm_functional_position_id', selectedFunctionalPosition.value);
            salary && formData.append('salary', salary);
            formData.append('date_start', dateStart ? moment(dateStart).format('YYYY-MM-DD') : '');
            formData.append('att_schedule_id', selectedSchedule.value);
            formData.append('adhonorem', adhonorem);
            formData.append('marking_required', markingRequired);
            formData.append('viatic', viatic);
            formData.append('vehicle', vehicle);
            formData.append('adhonorem', adhonorem);
            formData.append('disabled', disabled);
            formData.append('external', external);
            formData.append('applicant', selectedApplicant.value);
            formData.append('desktop', desktop);
            formData.append('portable', portable);
            formData.append('mobile', mobile);
            formData.append('requestEmail', requestEmail);
            formData.append('requestIpPhone', requestIpPhone);
            formData.append('parking', parking);

            const response = await BaseService.post('/administration/employees', formData);

            if (response.status === 200) {
                setSending(false);
                OpenNotification('success', 'Éxito!', 'La información de colaborador a sido guardada.', 'top-start', 3500);
                dispatch(setNewEmployee(true));
                onDrawerClose();
            }
        } catch (error) {
            console.log('errorSending', error);
            setSending(false);
            dispatch(setOpenDrawerAddEmployee(true));
            OpenNotification('danger', 'Error!', 'Ha ocurrido un error al enviar el formulario.', 'top-start', 3500);
        }
    }

    return (
        <Drawer
            isOpen={drawerOpen}
            onClose={onDrawerClose}
            // onRequestClose={onDrawerClose}
            closable={false}
            title={title}
            footer={<Footer onCancel={onCancel} onSave={handleSubmit}></Footer>}
            width={600}
            lockScroll={true}
        >
            <div>
                <Steps current={step}>
                    {stepsTitles.map((stepTitle, index) => (
                        <Steps.Item
                            key={index}
                            title={index === step ? null : null}
                        />
                    ))}
                </Steps>
                <div className="mt-6">
                    <Card>
                        <div className="h-full">
                            <form onSubmit={handleSubmit}>
                                <h6>{stepsTitles[step].title}</h6>
                                {stepContents[step]}
                            </form>
                        </div>
                    </Card>
                </div>
                <div className="mt-4 text-right">
                    <Button
                        className="mx-2"
                        onClick={onPrevious}
                        disabled={step === 0}
                    >{step === 0 ? 'Inicio' : 'Anterior'}</Button>
                    <Button
                        onClick={onNext}
                        enabled={step === 3}
                        variant="solid"
                    >{step === 3 ? 'Completado' : 'Siguiente'}</Button>
                </div>
            </div>
        </Drawer>
    )
}

export default NewEmployeeDrawer;