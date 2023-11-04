import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Avatar, Collapse, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
// @mui icon
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// redux
import { useAppDispatch, useAppSelector } from 'redux/configStore';
import { setRoutesToBack } from 'redux/routes/routesSlice';
//
import { Order, OrderHistory } from '@types';
import { Color, Role, Status } from 'common/enum';
import { Label, Popover } from 'components';
import { useLocales, useModal, usePopover } from 'hooks';
import { PATH_CASHIER_APP, PATH_KITCHEN_CENTER_APP } from 'routes/paths';

interface OrderHistoryTableRowProps {
  orderHistory: OrderHistory;
  index: number;
  page: number;
  rowsPerPage: number;
  selected: readonly string[];
}

function OrderHistoryTableRow({ index, orderHistory, page, rowsPerPage, selected }: OrderHistoryTableRowProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { open, handleCloseMenu } = usePopover();
  const { handleOpen } = useModal();

  const { userAuth } = useAppSelector((state) => state.auth);

  const [openList, setOpenList] = useState(-1);

  const handleNavigateDetail = (orderId: number) => {
    navigate(
      userAuth?.roleName === Role.KITCHEN_CENTER_MANAGER
        ? PATH_KITCHEN_CENTER_APP.order.root + `/${orderId}`
        : PATH_CASHIER_APP.order.root + `/${orderId}`
    );
    dispatch(setRoutesToBack(pathname));
  };

  return (
    <>
      <TableRow hover tabIndex={-1} key={orderHistory.orderHistoryId} sx={{ cursor: 'pointer' }}>
        <TableCell width={60} align="center" onClick={() => handleNavigateDetail(orderHistory.orderHistoryId)}>
          {index + 1}
        </TableCell>

        <TableCell align="left" onClick={() => handleNavigateDetail(orderHistory.orderHistoryId)}>
          {orderHistory.createdDate}
        </TableCell>

        <TableCell align="left" onClick={() => handleNavigateDetail(orderHistory.orderHistoryId)}>
          <Label>{orderHistory.partnerOrderStatus}</Label>
        </TableCell>

        <TableCell align="left" onClick={() => handleNavigateDetail(orderHistory.orderHistoryId)}>
          <Label>{orderHistory.systemStatus}</Label>
        </TableCell>
      </TableRow>

      <Popover open={open} handleCloseMenu={handleCloseMenu} onDelete={handleOpen} />
    </>
  );
}

export default OrderHistoryTableRow;