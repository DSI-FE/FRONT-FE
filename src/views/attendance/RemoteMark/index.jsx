import React from 'react';
import { Button } from 'components/ui';
import { FaFingerprint } from 'react-icons/fa';
import BaseService from 'services/BaseService';
import OpenNotification from './OpenNotification';
import { convertToAmPm,extractTime } from 'helpers';

const handleClick = async () => {
    try {
      const request = await BaseService.get('/attendance/mark');
  
      if (request?.data) {
        const time = convertToAmPm(extractTime(request?.data.datetime)).toUpperCase()
        OpenNotification('success', '¡Éxito!', 'Marcación registrada a las '+time, 'top-start', 7000);
      } else {
        throw new Error('Error de datos en la respuesta de la API');
      }
    } catch (error) {
      OpenNotification('danger', '¡Error!', error.response.data, 'top-start', 3500);
    }
}  

const RemoteMark = () => {
    return (
        <Button title="Haga click para registrar marcación" variant="solid" color="green-500" icon={<FaFingerprint />} onClick={handleClick}></Button>
    );
}

export default RemoteMark;