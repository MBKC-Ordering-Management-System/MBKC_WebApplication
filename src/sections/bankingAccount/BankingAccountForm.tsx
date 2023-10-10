// @mui
import { Grid, Stack, Typography } from '@mui/material';
import { Language } from 'common/enum';
//
import { InputField, UploadImageField } from 'components';
import { useLocales } from 'hooks';
import { useAppSelector } from 'redux/configStore';

function BankingAccountForm() {
  const { translate, currentLang } = useLocales();

  const { isEditing } = useAppSelector((state) => state.brand);

  return (
    <Grid container columnSpacing={3}>
      <Grid item md={4} sm={12}>
        <Stack alignItems="center" gap={3}>
          <Stack width="100%">
            <Typography variant="subtitle1">{translate('page.content.logo')}</Typography>
            <Typography variant="body2" color="grey.600">
              {translate('page.content.contentLogo', { model: translate('model.lowercase.bankingAccount') })}
            </Typography>
          </Stack>
          <UploadImageField
            label={translate('page.content.dragDrop')}
            name="BankLogo"
            defaultValue=""
            isEditing={isEditing}
          />
        </Stack>
      </Grid>
      <Grid item md={8} sm={12}>
        <Stack gap={3}>
          <Stack width="100%">
            <Typography variant="subtitle1">{translate('page.content.detail')}</Typography>
            <Typography variant="body2" color="grey.600">
              {translate('table.name')}, {translate('table.lowercase.numberAccount')},...
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <InputField
              fullWidth
              name="BankName"
              label={translate(
                'page.form.nameExchange',
                currentLang.value === Language.ENGLISH
                  ? {
                      model: translate('model.capitalizeOne.bankingAccount'),
                      name: translate('page.form.nameLower'),
                    }
                  : {
                      model: translate('page.form.name'),
                      name: translate('model.lowercase.bankingAccount'),
                    }
              )}
            />
            <InputField fullWidth name="NumberAccount" label={translate('page.form.numberAccount')} />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default BankingAccountForm;
