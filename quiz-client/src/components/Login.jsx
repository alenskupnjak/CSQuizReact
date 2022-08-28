import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import Center from './Center';
import useForm from '../hooks/useForm';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import useStateContext from '../hooks/useStateContext';
import { useNavigate } from 'react-router';

const getFreshModel = () => ({
  name: 't',
  email: 't@t.com',
});

export default function Login() {
  const { setContext, resetContext } = useStateContext();
  const navigate = useNavigate();

  const { values, errors, setErrors, handleInputChange } =
    useForm(getFreshModel);

  useEffect(() => {
    resetContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (e) => {
    console.log('%c 01 ', 'color:green', values);

    e.preventDefault();
    if (validate())
      createAPIEndpoint(ENDPOINTS.participant)
        .post(values)
        .then((res) => {
          setContext({ participantId: res.data.participantId });
          navigate('/quiz');
        })
        .catch((err) => console.log(err));
  };

  const validate = () => {
    const temp = {};
    temp.email = /\S+@\S+\.\S+/.test(values.email) ? '' : 'Email is not valid.';
    temp.name = values.name !== '' ? '' : 'This field is required.';
    setErrors(temp);
    console.log(
      '%c 02 Object.values(temp) ',
      'color:green',
      Object.values(temp),
    );

    return Object.values(temp).every((key) => key === '');
  };

  console.log('%c 00 values=', 'color:green', values);

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ my: 3 }}>
            Quiz Aplikacija
          </Typography>
          <Box
            sx={{
              '& .MuiTextField-root': {
                m: 1, //margin
                width: '90%',
              },
            }}
          >
            <form noValidate autoComplete="off" onSubmit={login}>
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                variant="outlined"
                helperText={errors.email}
                error={errors.email ? true : null}
                // {...(errors.email && { error: true, helperText: errors.email })}
              />
              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
                variant="outlined"
                {...(errors.name && { error: true, helperText: errors.name })}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: '90%' }}
              >
                Start
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
}
