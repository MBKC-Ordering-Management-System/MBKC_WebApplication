/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
// @mui
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, FormControlLabel, InputAdornment, Stack, Switch, TextField, Typography, Button } from '@mui/material';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { TimeView } from '@mui/x-date-pickers';
//
import { TimePickerField } from 'components';
import { useLocales } from 'hooks';

function ConfigurationMoneyExchangeToStore() {
  const { translate } = useLocales();

  const [checked, setChecked] = useState(false);
  const [valueInput, setValueInput] = useState<string>('');
  const [view, setView] = useState<TimeView>('hours');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const { watch } = useFormContext();

  const scrawlingMoneyExchangeToStore = watch('scrawlingMoneyExchangeToStore');

  const handleChangeInput = () => {
    setValueInput(moment(dayjs(scrawlingMoneyExchangeToStore).toDate()).format('HH:mm:ss'));
  };

  useEffect(() => {
    handleChangeInput();
  }, [scrawlingMoneyExchangeToStore]);

  return (
    <Box>
      <Stack mb={2}>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />}
          label={translate('page.content.switchToConfiguration')}
          labelPlacement="start"
        />
      </Stack>

      <Stack direction="column" alignItems="center" width="100%">
        <Stack direction="row" gap={2} width="100%">
          <TextField
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <AccessTimeIcon />
                </InputAdornment>
              ),
            }}
            label={translate('table.start')}
            value={valueInput}
            defaultValue={moment(dayjs(scrawlingMoneyExchangeToStore).toDate()).format('HH:mm:ss')}
            sx={{
              '.css-1j5h0bl-MuiInputBase-root-MuiOutlinedInput-root': {
                pr: '5px',
              },
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" mt={4}>
          <DemoItem
            label={
              <Stack direction="column" alignItems="left" justifyContent="left">
                <Typography variant="body2">{translate('page.content.selectTimeStart')}</Typography>
                <Box>
                  <Button variant="outlined" size="small" onClick={() => setView('hours')} disabled={!checked}>
                    {translate('button.editHours')}
                  </Button>
                </Box>
              </Stack>
            }
          >
            <TimePickerField
              name="scrawlingMoneyExchangeToStore"
              ampm={false}
              disabled={!checked}
              setView={setView}
              view={view}
            />
          </DemoItem>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ConfigurationMoneyExchangeToStore;