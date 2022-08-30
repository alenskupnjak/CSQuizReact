import React, { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS, BASE_URL } from '../api';
import useStateContext from '../hooks/useStateContext';
import {
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  List,
  ListItemButton,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { getFormatedTime } from '../helper';
import { useNavigate } from 'react-router';

export default function Quiz() {
  const [pitanje, odrediPitanja] = useState([]);
  const [qnIndex, setQnIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const { context, setContext } = useStateContext();
  const navigate = useNavigate();

  let timer;

  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, [1000]);
  };

  useEffect(() => {
    console.log('%c useEffect QUIZ ', 'color:red');

    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });
    createAPIEndpoint(ENDPOINTS.question)
      .fetch()
      .then((res) => {
        console.log('%c Pitanja ', 'color:green', res);
        odrediPitanja(res.data);
        startTimer();
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAnswer = (qnId, optionIdx) => {
    const temp = [...context.selectedOptions];
    temp.push({
      qnId,
      selektiranoPitanje: optionIdx,
    });
    if (qnIndex < 4) {
      setContext({ selectedOptions: [...temp] });
      setQnIndex(qnIndex + 1);
    } else {
      setContext({ selectedOptions: [...temp], timeTaken, End: 'Kraj' });
      navigate('/result');
    }
  };

  return pitanje.length !== 0 ? (
    <Card
      sx={{
        maxWidth: 640,
        mx: 'auto',
        mt: 5,
        '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' },
      }}
    >
      <CardHeader
        title={'Pitanje ' + (qnIndex + 1) + ' of 5'}
        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
      />
      <Box>
        <LinearProgress
          variant="determinate"
          value={((qnIndex + 1) * 100) / 5}
        />
      </Box>
      {pitanje[qnIndex].imageName != null ? (
        <CardMedia
          component="img"
          image={BASE_URL + 'images/' + pitanje[qnIndex].imageName}
          sx={{ width: 'auto', m: '10px auto' }}
        />
      ) : null}
      <CardContent>
        <Typography variant="h6">{pitanje[qnIndex].qnInWords}</Typography>
        <List>
          {pitanje[qnIndex].options.map((item, idx) => (
            <ListItemButton
              disableRipple
              key={idx}
              onClick={() => updateAnswer(pitanje[qnIndex].qnId, idx)}
            >
              <div>
                <b>{String.fromCharCode(65 + idx) + ' . '}</b>
                {item}
              </div>
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  ) : null;
}
