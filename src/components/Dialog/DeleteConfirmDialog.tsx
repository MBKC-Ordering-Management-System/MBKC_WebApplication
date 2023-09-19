import React, { FC, ReactElement } from 'react';
import { Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent, Button } from '@mui/material';
import LoadingAsyncButton from 'components/LoadingAsyncButton/LoadingAsyncButton';
import { useLocales } from 'hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete?: () => any;
  onUpdate?: () => any;
  title: String | ReactElement;
  description?: String | ReactElement | undefined;
}

const UpdateConfirmDialog: FC<Props> = ({ open, onClose, onUpdate, title, description }) => {
  const { translate } = useLocales();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="warning-dialog-title"
      aria-describedby="warning-dialog-description"
    >
      <DialogTitle id="warning-dialog-title">
        <DialogContentText variant="h5">{title}</DialogContentText>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="warning-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text" color="secondary">
          {translate('common.cancel')}
        </Button>
        <LoadingAsyncButton onClick={onUpdate} variant="contained" autoFocus>
          {translate('common.confirm')}
        </LoadingAsyncButton>
      </DialogActions>
    </Dialog>
  );
};

export { UpdateConfirmDialog };
