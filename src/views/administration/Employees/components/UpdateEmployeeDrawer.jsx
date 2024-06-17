import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawerUpdateEmployee, setUpdateEmployee } from "../store/stateSlice";
import { Avatar, Button, Card, DatePicker, Drawer, Input, Select, Spinner, Switcher,FormContainer } from "components/ui";
import OpenNotification from "./OpenNotification";
import { ImSpinner9 } from "react-icons/im";
import BaseService from "services/BaseService";
import moment from "moment";
import { Upload } from 'components/custom'
import { HiDocument, HiOutlinePlus } from 'react-icons/hi'


const UpdateEmployeeDrawer = () => {
    const dispatch = useDispatch();

    const drawerUpdateOpen = useSelector((state) => state.employee.state.openDrawerUpdateEmployee);
    const loadingSelectedUpdateEmployee = useSelector((state) => state.employee.state.loading);
    const employeeUpdateInfo = useSelector((state) => state.employee.state.selectedEmployee);

    const title = (
        <div>
            <h5 className="flex items-center justify-start gap-2 text-slate-600">Editar Colaborador</h5>
        </div>
    );

    const onCancel = () => {
        onDrawerClose();
    }

    const Footer = ({onCancel, onSave}) => {
        return (
            <div className="flex items-center justify-between w-full">
                <Button size="sm" variant="solid" loading={sending} onClick={onCancel} color="gray-500">Salir</Button>
                <Button size="sm" variant="solid" loading={sending} onClick={onSave} disabled={disabledSubmit}>Guardar</Button>
            </div>
        );
    }

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [personalPhone, setPersonalPhone] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [personalEmailError, setPersonalEmailError] = useState('');
    const [dui, setDui] = useState('');
    const [duiError, setDuiError] = useState('');
    const [nit, setNit] = useState('');
    const [nitError, setNitError] = useState('');

    const [nup, setNup] = useState("");
    const [isss, setIsss] = useState("");
    const [mh, setMh] = useState("");
    const [dsi, setDsi] = useState("");

    const [genders, setGenders] = useState(null);
    const [gendersLoading, setGendersLoading] = useState(false);
    const [genderSelected, setGenderSelected] = useState({});
    const [maritalStatuses, setMaritalStatuses] = useState(null);
    const [maritalStatusesLoading, setMaritalStatusesLoading] = useState(false);
    const [maritalStatusSelected, setMaritalStatusSelected] = useState({});
    const [children, setChildren] = useState(false);
    const [birthDay, setBirthDay] = useState('');

    const [vehicle, setVehicle] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [departmentsLoading, setDepartmentsLoading] = useState(false);
    const [departments, setDepartments] = useState(null);
    const [departmentSelected, setDepartmentSelected] = useState({});
    const [municipalitiesLoading, setMunicipalitiesLoading] = useState(false);
    const [municipalities, setMunicipalities] = useState(null);
    const [municipalitySelected, setMunicipalitySelected] = useState(false);
    const [urbanization, setUrbanization] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [complement, setComplement] = useState('');

    const [organizationalUnitsLoading, setOrganizationalUnitsLoading] = useState(false);
    const [organizationalUnits, setOrganizationalUnits] = useState(null);
    const [organizationalUnitSelected, setOrganizationalUnitSelected] = useState({});
    const [functionalPositionLoading, setFunctionalPositionsLoading] = useState(false);
    const [functionalPositions, setFunctionalPositions] = useState(null);
    const [functionalPositionSelected, setFunctionalPositionSelected] = useState({});
    const [salary, setSalary] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [adhonorem, setAdhonorem] = useState(false);
    const [markingRequired, setMarkingRequired] = useState(true);
    const [viatic, setViatic] = useState(false);
    const [external, setExternal] = useState(false);
    const [schedulesLoading, setSchedulesLoading] = useState(false);
    const [schedules, setSchedules] = useState(null);
    const [scheduleSelected, setScheduleSelected] = useState({});

    const [parking, setParking] = useState(false);

    const [ file, setFile ] = useState([])
    const [avatarImg, setAvatarImg] = useState(null)
    const [avaSize, setAvaSize] = useState(80)

    const handleChangeFile = (e) => { setFile(e) }

    const onFileUpload = (files) => {
        if(files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            handleChangeFile(files)
            setAvaSize(150)
        }
    }

    const CustomMandatoryAttachments = ({name}) => (
        <div className='flex justify-between items-center align-middle'>
            <Upload
                name='photo'
                accept='image/jpeg, image/png'
                uploadLimit={2}
                onChange={(file) => {onFileUpload(file)}}
            >
                <Avatar size={ avaSize } src={ avatarImg } icon={ <HiOutlinePlus /> } />

                {/* <CustomButton icon={<HiUpload className='text-lg'/>}>Cargar {name}</CustomButton> */}
            </Upload>
            <div >
            {
                file.map((el,i) =>{
                    return (
                        <div className='flex justify-between' key={`file-${i}`}>
                            <div className='flex align-middle items-center gap-2'><HiDocument className='inline-block'/><span>{el.name}</span></div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )

    const CustomMandatoriesAttachments = () => {
        return (
            <>
                <h6 className='mb-4'>Imagen</h6>
                <FormContainer className='w-full mt-2'>
                    <CustomMandatoryAttachments name={`Imagen de Entrada`}/>
                </FormContainer>
            </>
        )
    }
    
    const onDrawerClose = () => {
        setName('');
        setLastname('');
        setPhone('');
        setEmail('');
        setEmailError('');
        setPersonalPhone('');
        setPersonalEmail('');
        setPersonalEmailError('');
        setDui('');
        setDuiError('');
        setNit('');
        setNitError('');
        setNit("");
        setNup("");
        setIsss("");
        setMh("");
        setDsi(""); 
        setGendersLoading(false);
        setMaritalStatusesLoading(false);
        setChildren(false);
        setBirthDay('');
        setVehicle(false);
        setDisabled(false);
        setDepartmentsLoading(false);
        setDepartmentSelected({});
        setMunicipalitiesLoading(false);
        setMunicipalitySelected({});
        setUrbanization('');
        setStreet('');
        setHouseNumber('');
        setComplement('');
        setOrganizationalUnitsLoading(false);
        setOrganizationalUnitSelected({});
        setFunctionalPositionsLoading(false);
        setFunctionalPositionSelected({});
        setSalary('');
        setDateStart('');
        setAdhonorem(false);
        setMarkingRequired(true);
        setViatic(false);
        setExternal(false);
        setSchedulesLoading(false);
        setScheduleSelected({});
        setSending(false);
        setParking(false);

        dispatch(setOpenDrawerUpdateEmployee(false));
    }

    const [disabledSubmit, setDisabledSubmit] = useState(true);
    const [sending, setSending] = useState(false);

    const StringToDate = (str, separator = '-') => {
        const [year, month, day] = String(str).split(separator);
        return new Date(+year, +month - 1, +day);
    }

    useEffect(() => {
        if (Boolean(drawerUpdateOpen) && Boolean(employeeUpdateInfo)) {
          setName(employeeUpdateInfo?.name || '');
          setLastname(employeeUpdateInfo?.lastname || '');
          setPhone(employeeUpdateInfo?.phone || '');
          setEmail(employeeUpdateInfo?.email || '');
          setPersonalPhone(employeeUpdateInfo?.phone_personal || '');
          setPersonalEmail(employeeUpdateInfo?.email_personal || '');
          setDui(employeeUpdateInfo?.documents.find(document => document.id === 1)?.pivot.value || '');
          setNit(employeeUpdateInfo?.documents.find(document => document.id === 2)?.pivot.value || '');

          setNup(employeeUpdateInfo?.documents.find(document => document.id === 3)?.pivot.value || '');
          setIsss(employeeUpdateInfo?.documents.find(document => document.id === 4)?.pivot.value || '');
          setMh(employeeUpdateInfo?.documents.find(document => document.id === 6)?.pivot.value || '');
          setDsi(employeeUpdateInfo?.documents.find(document => document.id === 7)?.pivot.value || '');

          setChildren(Boolean(employeeUpdateInfo?.children) || false);
          if (employeeUpdateInfo?.birthday) {
            setBirthDay(StringToDate(employeeUpdateInfo?.birthday, '-'));
          } else {
            setBirthDay(null);
          }

          setVehicle(employeeUpdateInfo?.vehicle);
          setDisabled(employeeUpdateInfo?.disabled);
      
          // Restablecer los estados a valores vacíos o nulos
          setDepartmentSelected({});
          setMunicipalitySelected({});
          setOrganizationalUnitSelected({});
          setFunctionalPositionSelected({});
          setSalary('');
          setDateStart(null);
      
          if (
            employeeUpdateInfo &&
            employeeUpdateInfo.address &&
            employeeUpdateInfo.address.municipality
          ) {
            const { municipality } = employeeUpdateInfo.address;
            const { department } = employeeUpdateInfo.address.municipality;
      
            if (Boolean(department)) {
              setDepartmentSelected({ label: department.name, value: department.id });
            }
            if (Boolean(department) && Boolean(municipality)) {
              setMunicipalitySelected({ label: municipality.name, value: municipality.id });
              fetchMunicipalities(department.id);
            }
          }
      
          setUrbanization(employeeUpdateInfo?.address?.urbanization || '');
          setStreet(employeeUpdateInfo?.address?.street || '');
          setHouseNumber(employeeUpdateInfo?.address?.number || '');
          setComplement(employeeUpdateInfo?.address?.complement || '');
      
          if (
            employeeUpdateInfo &&
            employeeUpdateInfo.functional_positions &&
            Object.keys(employeeUpdateInfo.functional_positions).length > 0 &&
            employeeUpdateInfo.functional_positions['0'].organizational_unit
          ) {
            const { organizational_unit } = employeeUpdateInfo?.functional_positions['0'];
            const { functional_positions } = employeeUpdateInfo;
      
            if (organizational_unit) {
              setOrganizationalUnitSelected({ label: organizational_unit?.name, value: organizational_unit?.id });
            }
            if (organizational_unit && functional_positions) {
              setFunctionalPositionSelected({ label: functional_positions['0']?.name, value: functional_positions['0']?.id });
              fetchFunctionalPositions(organizational_unit?.id);
            } else {
                setFunctionalPositions(null);
            }
      
            setSalary(functional_positions['0']?.pivot?.salary);
            setDateStart(StringToDate(functional_positions['0']?.pivot?.date_start, '-'));
          }
      
          setAdhonorem(Boolean(employeeUpdateInfo?.adhonorem));
          setMarkingRequired(Boolean(employeeUpdateInfo?.marking_required));
          setViatic(Boolean(employeeUpdateInfo?.viatic));
          setExternal(Boolean(employeeUpdateInfo?.external));
          setParking(Boolean(employeeUpdateInfo?.parking));

          setScheduleSelected({ label: employeeUpdateInfo?.schedules['0']?.name, value: employeeUpdateInfo?.schedules['0']?.id });
        }
      }, [drawerUpdateOpen, employeeUpdateInfo]);    

    useEffect(() => {
        const validatedFields =
            name && 
            lastname &&
            phone &&
            email &&
            dui &&
            nit &&
            genderSelected &&
            maritalStatusSelected &&
            birthDay &&
            departmentSelected &&
            municipalitySelected &&
            urbanization &&
            street &&
            houseNumber &&
            organizationalUnitSelected &&
            functionalPositionSelected &&
            dateStart &&
            scheduleSelected;

        // setDisabledSubmit(!Boolean(validatedFields));
	    setDisabledSubmit(false)
    }, [
        name,
        lastname,
        phone,
        email,
        dui,
        nit,
        genderSelected,
        maritalStatusSelected,
        birthDay,
        departmentSelected,
        municipalitySelected,
        urbanization,
        street,
        houseNumber,
        organizationalUnitSelected,
        functionalPositionSelected,
        dateStart,
        scheduleSelected
    ]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    }

    const emailValidated = (personalEmail) => {
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailRegex.test(personalEmail);
    }

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);

        if (value === '' || !emailValidated(value)) {
            setEmailError("El Email debe tener el formato correcto (ejemplo: usuario@servidor.dominio)");
        } else {
            setEmailError("");
        }
    }

    const handlePersonalPhoneChange = (event) => {
        setPersonalPhone(event.target.value);
    }

    const handlePersonalEmailChange = (event) => {
        const value = event.target.value;
        setPersonalEmail(value);

        if (value !== '' && !emailValidated(value)) {
            setPersonalEmailError('El Email Personal debe tener el formato correcto (ejemplo: usuario@servidor.dominio)');
        } else {
            setPersonalEmailError('');
        }
    }

    const duiValidated = (dui) => {
        const duiRegex = /^\d{8}-\d$/;
        return duiRegex.test(dui);
    }

    const handleDuiChange = (event) => {
        const value = event.target.value;
        setDui(value);

        /*if (value.trim() === "") { // Si value es vacío
            setDuiError("El DUI es requerido");
        } else if (!duiValidated(value)) {  // Si no cumple con la expresión regular
            setDuiError("El DUI debe tener el formato correcto (ejemplo: 12345678-9)");
        } else {
            setDuiError("");
        }*/
    }

    const nitValidated = (nit) => {
        /*const nitRegex = /^\d{4}-\d{6}-\d{3}-\d{1}/;
        return nitRegex.test(nit);*/
    }

    const handleNitChange = (event) => {
        const value = event.target.value;
        setNit(value);

        /*if (value.trim() === "") {
            setNitError("El NIT es requerido");
        } else if (!nitValidated(value)) {
            setNitError("El NIT debe tener el formato correcto (ejemplo: 1234-123456-123-1)");
        } else {
            setNitError("");
        }*/
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
            setGendersLoading(true);
            try {
                const response = await BaseService.get('/administration/active-genders');
                const data = await response.data;

                const options = await data.map(({name, id}) => ({ value: id, label: name }));
                setGenders(options);
                setGendersLoading(false);
            } catch (error) {
                // setGendersLoading(false);
                OpenNotification('danger', 'Error!', error, 'top-start', 5000);
                console.log('Error obteniendo Géneros', error);
            }
        } 

        const fetchMaritalStatuses = async () => {
            setMaritalStatusesLoading(true);
            try {
                const response = await BaseService.get('/administration/active-marital-statuses');
                const data = await response.data;

                const options = await data.map(({name, id}) => ({ value: id, label: name }));
                setMaritalStatuses(options);
                setMaritalStatusesLoading(false);
            } catch (error) {
                OpenNotification('danger', 'Error!', error, 'top-start', 5000);
                console.log('Error obteniendo Estados Maritales', error);
            }
        }

        const fetchDepartments = async () => {
            setDepartmentsLoading(true);
            try {
                const response = await BaseService.get('/administration/departments');
                const data = await response.data;

                const options = await data.map(({name, id}) => ({value: id, label: name}));
                setDepartments(options);
                setDepartmentsLoading(false);
            } catch (error) {
                OpenNotification('danger', 'Error!', error, 'top-start', 5000);
                console.log('Error obteniendo Departamentos', error);
            }
        }

        const fetchOrganizationalUnits = async () => {
            setOrganizationalUnitsLoading(true);
            try {
                const response = await BaseService.get('/administration/active-organizational-units');
                const data = await response.data;

                const options = data.map(({name, id}) => ({value:id, label:name}));
                setOrganizationalUnitsLoading(false);
                setOrganizationalUnits(options);
            } catch (error) {
                OpenNotification('danger', 'Error!', error, 'top-start', 5000);
                console.log('Error al cargar Unidades Organizacionales', error);
            }
        }

        const fetchSchedules = async () => {
            setSchedulesLoading(true);
            try {
                const response = await BaseService.get('/attendance/active-schedules');
                const data = await response.data;

                const options = data.map(({name, id}) => ({value:id, label:name}));
                setSchedulesLoading(false);
                setSchedules(options);
            } catch (error) {
                OpenNotification('danger', 'Error!', error, 'top-start', 5000);
                console.log('Error al cargar Horarios', error);
            }
        }

        fetchGenders();
        fetchMaritalStatuses();
        fetchDepartments();
        fetchOrganizationalUnits();
        fetchSchedules();
    }, []);

    useEffect(() => {
        if (genders?.length > 0 && employeeUpdateInfo?.gender) {
            setGenderSelected({
                label: employeeUpdateInfo?.gender?.name, 
                value: employeeUpdateInfo?.gender?.id
            });
        }
    }, [
        genders,
        employeeUpdateInfo
    ]);

    const handleGenderChange = (selectedOption) => {
        setGenderSelected(selectedOption);
    }

    useEffect(() => {
        if (maritalStatuses?.length > 0 && employeeUpdateInfo?.marital_status) {
            setMaritalStatusSelected({
                label: employeeUpdateInfo?.marital_status?.name,
                value: employeeUpdateInfo?.marital_status?.id
            });
        }
    }, [
        maritalStatuses,
        employeeUpdateInfo
    ])

    const handleMaritalStatusChange = (selectedOption) => {
        setMaritalStatusSelected(selectedOption);
    }

    const handleChildrenChange = (value) => {
        setChildren(!value);
    }

    const handleBirthdayPicker = (date) => {
        setBirthDay(date);
    }

    const fetchMunicipalities = async (department) => {
        setMunicipalitiesLoading(true);
        try {
            const response = await BaseService.get('/administration/departments/' + department);
            const data = await response.data;

            const options = data.municipalities.map(({name, id}) => ({value: id, label: name}));
            setMunicipalitiesLoading(false);
            setMunicipalities(options);
        } catch (error) {
            OpenNotification('danger', 'Error', error, 'top-start', 5000);
            console.log('Error al obtener Municipios de ' + departmentSelected.label, error);
        }
    }

    const handleDepartmentChange = (optionSelected) => {
        setDepartmentSelected(optionSelected);
        setMunicipalitySelected({});
        setMunicipalities({});

        fetchMunicipalities(optionSelected.value);
    }

    const handleMunicipalityChange = (optionSelected) => {
        setMunicipalitySelected(optionSelected);
    }

    const handleUrbanizationChange = (event) => {
        setUrbanization(event.target.value)
    }

    const handleStreetChange = (event) => {
        setStreet(event.target.value);
    }

    const handleHouseNumberChange = (event) => {
        setHouseNumber(event.target.value);
    }

    const handleComplementChange = (event) => {
        setComplement(event.target.value);
    }

    const fetchFunctionalPositions = async (organizationalUnit) => {
        setFunctionalPositionsLoading(true);
        try {
            const response = await BaseService.get('/administration/organizational-units/' + organizationalUnit);
            const data = await response.data;

            const options = data.functional_positions.map(({name, id}) => ({value:id, label:name}));
            setFunctionalPositionsLoading(false);
            setFunctionalPositions(options);
        } catch (error) {
            OpenNotification('danger', 'Error!', error, 'top-start', 5000);
            console.log('Error obteniendo Cargos Funcionales', error);
        }
    }

    const handleOrganizationalUnitChange = (selectedOption) => {
        setOrganizationalUnitSelected(selectedOption);
        setFunctionalPositionSelected({});
        setFunctionalPositions(null);

        fetchFunctionalPositions(selectedOption.value);
    }

    const handleFunctionalPositionChange = (selectedOption) => {
        setFunctionalPositionSelected(selectedOption);
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
        setViatic(!Boolean(value));
    }

    const handleVehicleChange = (value) => {
        setVehicle(!value);
    }

    const handleDisabledChange = (value) => {
        setDisabled(!value);
    }

    const handleExternalChange = (value) => {
        setExternal(value);
    }

    const handleSchedulesChange = (selectedOption) => {
        setScheduleSelected(selectedOption);
    }

    const handleParkingChange = (value) => {
        setParking(!value);
    }

    const handleSubmit = async (e) => { console.log('UpdateInfo', employeeUpdateInfo);
        e.preventDefault();
        setSending(true);

        try {
            const formData = new FormData();
            Boolean(name !== employeeUpdateInfo?.name) && formData.append('name', name);
            Boolean(lastname !== employeeUpdateInfo?.lastname) && formData.append('lastname', lastname);
            Boolean(phone !== employeeUpdateInfo?.phone) && formData.append('phone', phone);
            Boolean(email !== employeeUpdateInfo?.email) && formData.append('email', email);
            Boolean(Boolean(personalPhone) !== Boolean(employeeUpdateInfo?.phone_personal)) && formData.append('phone_personal', personalPhone);
            Boolean(personalEmail !== employeeUpdateInfo?.email_personal) && formData.append('email_personal', personalEmail);
            Boolean(Boolean(markingRequired) !== Boolean(employeeUpdateInfo?.marking_required)) && formData.append('marking_required', markingRequired);
            Boolean(genderSelected.value !== employeeUpdateInfo?.gender?.id) && formData.append('adm_gender_id', genderSelected.value);
            Boolean(maritalStatusSelected.value !== employeeUpdateInfo?.marital_status?.id) && formData.append('adm_marital_status_id', maritalStatusSelected.value);
            Boolean(moment(birthDay).format('YYYY-MM-DD') !== moment(employeeUpdateInfo?.birthday).format('YYYY-MM-DD')) && formData.append('birthday', moment(birthDay).format('YYYY-MM-DD'));

            formData.append('vehicle', Boolean(vehicle));
            Boolean(Boolean(disabled) !== Boolean(employeeUpdateInfo?.disabled)) && formData.append('disabled', disabled);

            (Boolean(external) !== Boolean(employeeUpdateInfo?.external)) && formData.append('external', external);
            (Boolean(viatic) !== Boolean(employeeUpdateInfo?.viatic)) && formData.append('viatic', viatic);
            (Boolean(children) !== Boolean(employeeUpdateInfo?.children)) && formData.append('children', children);
            Boolean(dui !== employeeUpdateInfo?.documents?.find(document => document.id === 1)?.pivot?.value) && formData.append('dui', dui);
            Boolean(nit !== employeeUpdateInfo?.documents?.find(document => document.id === 2)?.pivot?.value) && formData.append('nit', nit);

            Boolean(nup !== employeeUpdateInfo?.documents?.find(document => document.id === 3)?.pivot?.value) && formData.append('nup', nup);
            Boolean(isss !== employeeUpdateInfo?.documents?.find(document => document.id === 4)?.pivot?.value) && formData.append('isss', isss);
            Boolean(mh !== employeeUpdateInfo?.documents?.find(document => document.id === 6)?.pivot?.value) && formData.append('mh', mh);
            Boolean(dsi !== employeeUpdateInfo?.documents?.find(document => document.id === 7)?.pivot?.value) && formData.append('dsi', dsi);

            Boolean(municipalitySelected.value !== employeeUpdateInfo?.address?.municipality?.id) && formData.append('adm_municipality_id', municipalitySelected.value);
            Boolean(urbanization !== employeeUpdateInfo?.address?.urbanization) && formData.append('urbanization', urbanization);
            Boolean(street !== employeeUpdateInfo?.address?.street) && formData.append('street', street);
            Boolean(houseNumber !== employeeUpdateInfo?.address?.number) && formData.append('number', houseNumber);
            Boolean(complement) !== Boolean(employeeUpdateInfo?.address?.complement) && formData.append('complement', complement);

            Boolean(functionalPositionSelected.value !== employeeUpdateInfo?.functional_positions['0']?.id) && formData.append('adm_functional_position_id', functionalPositionSelected.value);
            if (Boolean(salary !== (employeeUpdateInfo?.functional_positions['0']?.pivot?.salary))) { if (salary) { formData.append('salary', salary); } else { formData.append('salary', 0); } }
            Boolean(moment(dateStart).format('YYYY-MM-DD') !== moment(employeeUpdateInfo?.functional_positions['0']?.pivot?.date_start).format('YYYY-MM-DD')) && formData.append('date_start', moment(dateStart).format('YYYY-MM-DD'));
            Boolean(scheduleSelected.value !== employeeUpdateInfo?.schedules['0']?.id) && formData.append('att_schedule_id', scheduleSelected.value);

            formData.append('adhonorem', Boolean(adhonorem));
            formData.append('parking', Boolean(parking));

            if (formData.entries().next().done) {
                throw new Error('Sin cambios en la información.')
            }

            if (file && file[0]){
                formData.append('photo', file[0])
            }

            formData.append('employee_id', employeeUpdateInfo?.id);
            const response = await BaseService.post('/administration/employee-update/' + employeeUpdateInfo?.id, formData);
            // const data = await response.data;

            if (response.status === 200) {
                setSending(false);
                dispatch(setUpdateEmployee(true));
                dispatch(setOpenDrawerUpdateEmployee(false));
                OpenNotification('success', 'Actualización!', 'Información actualizada con éxito.', 'top-start', 3500);
            }
        } catch (error) {
            console.log('errorSending', error.response);
            setSending(false);
            dispatch(setOpenDrawerUpdateEmployee(true));
            const decodedResponse = decodeURIComponent(error.request.response);
            OpenNotification('danger', 'Error!', error.message + '\n' + decodedResponse, 'top-start', 15000, { closable: true });
        }
    }

    return (
        <Drawer
            isOpen={drawerUpdateOpen}
            onClose={onDrawerClose}
            // onRequestClose={onDrawerClose}
            closable={false}
            title={title}
            footer={<Footer onCancel={onCancel} onSave={handleSubmit} />}
            width={600}
            lockScroll={true}
        >
            {loadingSelectedUpdateEmployee ? (
                <div className="flex items-center justify-center h-40">
                    <Spinner size={40} indicator={ImSpinner9} />
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* <CustomMandatoriesAttachments/> */}
                    <Card>
                        <h6 className="mb-4">Informaci&oacute;n Personal</h6>
                        <label htmlFor="name" className="required">Nombres</label>
                        <div className="grid grid-cols-4 mb-4">
                            <div className="col-span-3">
                                <Input
                                    id={'name'}
                                    name={'name'}
                                    value={name}
                                    onChange={handleNameChange}
                                    size='sm'
                                    className={'mb-4'}
                                />
                                <label htmlFor="lastname" className="required">Apellidos</label>
                                <Input
                                    id={'lastname'}
                                    name={'lastname'}
                                    value={lastname}
                                    onChange={handleLastnameChange}
                                    size='sm'
                                />
                            </div>
                            <div className="flex justify-end">
                            <Avatar key={employeeUpdateInfo?.id} size={90} src={employeeUpdateInfo?.photo_route_sm}></Avatar>
                            </div>
                        </div>
                        <div className="flex flex-row mb-4">
                            <div className="mr-4 basis-1/3">
                                <label className="required">Tel&eacute;fono</label>
                                <Input
                                    id='phone'
                                    name='phone'
                                    size='sm'
                                    value={phone}
                                    onChange={handlePhoneChange}
                                />
                            </div>
                            <div className="basis-2/3">
                                <label className="required">Email</label>
                                <Input
                                    id='email'
                                    name='email'
                                    size='sm'
                                    value={email}
                                    onChange={handleEmailChange}
                                    invalid={Boolean(emailError)}
                                />
                                { emailError && <span className="text-xs text-red-500">{emailError}</span> }
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
                            </div>
                            <div className="basis-2/3">
                                <label>Email personal</label>
                                <Input
                                    id='email_personal'
                                    name='email_personal'
                                    size='sm'
                                    value={personalEmail}
                                    onChange={handlePersonalEmailChange}
                                    invalid={Boolean(personalEmailError)}
                                />
                                { personalEmailError && <span className="text-xs text-red-500">{personalEmailError}</span> }
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
                                    invalid={Boolean(duiError)}
                                />
                                { duiError && <span className="text-xs text-red-500">{duiError}</span> }
                            </div>
                            <div className="w-50">
                                <label className="required">NIT</label>
                                <Input
                                    id='nit'
                                    name='nit'
                                    size='sm'
                                    value={nit}
                                    onChange={handleNitChange}
                                    invalid={Boolean(nitError)}
                                />
                                { nitError && <span className="text-xs text-red-500">{nitError}</span> }
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
                                isLoading={gendersLoading}
                                isDisabled={gendersLoading}
                                placeholder={'Seleccionar'}
                                options={genders}
                                value={genderSelected}
                                onChange={handleGenderChange}
                            />
                            <Select
                                id={'marital_status'}
                                name={'marital_status'}
                                size='sm'
                                isLoading={maritalStatusesLoading}
                                isDisabled={maritalStatusesLoading}
                                placeholder={'Seleccionar'}
                                options={maritalStatuses}
                                value={maritalStatusSelected}
                                onChange={handleMaritalStatusChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label></label>
                            <label className="required">Fecha de nacimiento</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                <label htmlFor="children">{ children ? 'Con Hijos' : 'Sin Hijos' }</label>
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
                                <label htmlFor="vehicle">{ vehicle ? 'Posee Vehículo' : 'Sin Vehículo' }</label>
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
                                <label htmlFor="disabled">{ disabled ? 'Persona con necesidades especiales' : 'Persona sin necesidades especiales' }</label>
                            </div>
                        </div>
                    </Card>
                    <Card className="mt-6">
                        <h6>Direcci&oacute;n principal</h6>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <label className="required">Departamento</label>
                            <label className="required">Municipio</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Select
                                id='department'
                                name='department'
                                isDisabled={departmentsLoading}
                                isLoading={departmentsLoading}
                                placeholder='Seleccionar'
                                options={departments}
                                value={departmentSelected}
                                onChange={handleDepartmentChange}
                            />
                            <Select
                                id='municipality'
                                name='municipality'
                                isDisabled={!municipalities || municipalitiesLoading}
                                isLoading={municipalitiesLoading}
                                placeholder='Seleccionar'
                                options={municipalities}
                                value={municipalitySelected}
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
                                <label className="required">Calle / Pol&iacute;gono / Pasaje</label>
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
                        <div className="">
                            <label>Observaciones y/o notas</label>
                            <Input
                                id='complement'
                                name='complement'
                                value={complement}
                                onChange={handleComplementChange}
                                textArea
                            />
                        </div>
                    </Card>
                    <Card className="mt-6">
                        <h6>Información laboral</h6>
                        <div className="grid grid-cols-2 gap-4 mt-4 mb-2">
                            <label className="required">Unidad</label>
                            <label className="required">Cargo</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Select
                                id='organizationalUnit'
                                name='organizationalUnit'
                                isDisabled={organizationalUnitsLoading}
                                isLoading={organizationalUnitsLoading}
                                placeholder='Seleccionar'
                                options={organizationalUnits}
                                value={organizationalUnitSelected}
                                onChange={handleOrganizationalUnitChange}
                                size='sm'
                            />
                            <Select
                                id='functionalPosition'
                                name='functionalPosition'
                                isDisabled={!Boolean(functionalPositions) || functionalPositionLoading}
                                isLoading={functionalPositionLoading}
                                placeholder='Seleccionar'
                                options={functionalPositions}
                                value={functionalPositionSelected}
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
                                isDisabled={schedulesLoading}
                                isLoading={schedulesLoading}
                                placeholder='Seleccionar'
                                options={schedules}
                                value={scheduleSelected}
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
                                <label htmlFor="adhonorem">{ adhonorem ? 'Ad Honorem' : 'Ad Honorem' /** en Negativo */ }</label>
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
                                <label htmlFor="markingRequired">{ markingRequired ? 'Requiere Marcación' : 'No requiere Marcación'}</label>
                            </div>
                            <div className="mb-4">
                                <Switcher
                                    id='viatic'
                                    name='viatic'
                                    checked={Boolean(viatic)}
                                    onChange={handleViaticChange}
                                    // checkedContent="Con derecho a Viáticos"
                                    // unCheckedContent="Sin derecho a Viáticos "
                                    className='mr-4'
                                />
                                <label htmlFor="viatic">{viatic ? 'Con derecho a Viáticos' : 'Sin derecho a Viáticos'}</label>
                            </div>
                            <div className="mb-4">
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
                            <div className="">
                                <Switcher
                                    id='parking'
                                    name='parking'
                                    checked={parking}
                                    onChange={handleParkingChange}
                                    className='mr-4'
                                />
                                <label htmlFor="parking">{ parking ? 'Requiere Parqueo' : 'No Requiere Parqueo' }</label>
                            </div>
                        </div>
                    </Card>
                </form>
            ) }
        </Drawer>
    )
}

export default UpdateEmployeeDrawer;
