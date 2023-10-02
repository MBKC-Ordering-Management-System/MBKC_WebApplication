import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Avatar, FormControlLabel, IconButton, Switch, TableCell, TableRow } from '@mui/material';
// @mui icon
import MoreVertIcon from '@mui/icons-material/MoreVert';
//
import { Brand } from '@types';
import { Color, Status } from 'common/enum';
import { ConfirmDialog, Label, Popover } from 'components';
import { useLocales, useModal, usePopover } from 'hooks';
import { deleteBrand, getBrandDetail, setEditBrand } from 'redux/brand/brandSlice';
import { useAppDispatch } from 'redux/configStore';
import { PATH_ADMIN_APP } from 'routes/paths';
import { getStoresByBrand } from 'redux/store/storeSlice';
import { setRoutesToBack } from 'redux/routes/routesSlice';

interface BrandTableRowProps {
  index: number;
  brand: Brand;
  page?: number;
  rowsPerPage?: number;
}

function BrandTableRow({ index, brand, page, rowsPerPage }: BrandTableRowProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { handleOpen, isOpen } = useModal();
  const { open, handleOpenMenu, handleCloseMenu } = usePopover();

  const handleNavigateDetail = (brand: Brand, brandId: number) => {
    const params = {
      brandId,
      navigate,
    };
    navigate(PATH_ADMIN_APP.brand.root + `/detail/${brandId}`);
    dispatch(getBrandDetail(params));
    console.log('id', brandId);
    dispatch(getStoresByBrand(params));
  };

  const handleEdit = () => {
    navigate(PATH_ADMIN_APP.brand.root + `/update/${brand.brandId}`);
    dispatch(setRoutesToBack(pathname));
    dispatch(setEditBrand(brand));
  };

  const handleDelete = async () => {
    const brandId = brand.brandId;
    const params = {
      brandId,
      navigate,
    };
    dispatch(deleteBrand(params));
  };

  return (
    <>
      <TableRow hover tabIndex={-1} key={brand.name} sx={{ cursor: 'pointer' }}>
        <TableCell width={60} align="center" onClick={() => handleNavigateDetail(brand, brand.brandId)}>
          {index + 1}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 80 }}
          onClick={() => handleNavigateDetail(brand, brand.brandId)}
        >
          <Avatar alt={brand.name} src={brand.logo} />
        </TableCell>
        <TableCell align="left" onClick={() => handleNavigateDetail(brand, brand.brandId)}>
          {brand.name}
        </TableCell>
        <TableCell align="left" onClick={() => handleNavigateDetail(brand, brand.brandId)}>
          {brand.address}
        </TableCell>
        <TableCell align="left">
          <Label
            color={
              brand?.status === Status.ACTIVE
                ? Color.SUCCESS
                : brand?.status === Status.INACTIVE
                ? Color.WARNING
                : Color.ERROR
            }
          >
            {brand?.status === Status.INACTIVE
              ? translate('status.inactive')
              : brand?.status === Status.ACTIVE
              ? translate('status.active')
              : translate('status.deactive')}
          </Label>
        </TableCell>
        <TableCell align="right">
          <Switch
            size="small"
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={brand.status === Status.DEACTIVE}
            checked={brand.status === Status.INACTIVE || brand.status === Status.DEACTIVE ? false : true}
            color={brand?.status === Status.INACTIVE ? Color.WARNING : Color.SUCCESS}
          />
          <IconButton color="inherit" onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover open={open} handleCloseMenu={handleCloseMenu} onEdit={handleEdit} onDelete={handleOpen} />

      {isOpen && (
        <ConfirmDialog
          open={isOpen}
          onClose={handleOpen}
          onAction={handleDelete}
          title={translate('dialog.confirmDeleteTitle', { model: translate('model.lowercase.brand') })}
          description={translate('dialog.confirmDeleteContent', { model: translate('model.lowercase.brand') })}
        />
      )}
    </>
  );
}

export default BrandTableRow;
