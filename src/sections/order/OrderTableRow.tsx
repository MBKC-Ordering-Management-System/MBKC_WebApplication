import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Avatar, Box, Collapse, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
// @mui icon
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// redux
import { useAppSelector } from 'redux/configStore';
// interface
import { OrderSortBy } from 'common/@types';
import { Color, PartnerOrderStatus, Role, SystemStatus } from 'common/enums';
import { Order } from 'common/models';
//
import { Label } from 'components';
import { useLocales } from 'hooks';
import { PATH_CASHIER_APP, PATH_KITCHEN_CENTER_APP } from 'routes/paths';
import { formatCurrency } from 'utils';
import moment from 'moment';

interface OrderTableRowProps {
  order: Order;
  index: number;
  selected: readonly string[];
}

function OrderTableRow({ index, order, selected }: OrderTableRowProps) {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const { userAuth } = useAppSelector((state) => state.auth);

  const [openList, setOpenList] = useState(-1);

  const createDate = order?.orderHistories?.map((history) => history.createdDate);

  const handleNavigateDetail = () => {
    navigate(
      userAuth?.roleName === Role.KITCHEN_CENTER_MANAGER
        ? PATH_KITCHEN_CENTER_APP.order.root + `/${order.id}`
        : PATH_CASHIER_APP.order.root + `/${order.id}`
    );
  };

  return (
    <>
      <TableRow hover tabIndex={-1} key={index} sx={{ cursor: 'pointer' }}>
        <TableCell width={60} align="center" onClick={handleNavigateDetail}>
          {index + 1}
        </TableCell>

        <TableCell onClick={handleNavigateDetail} padding="none">
          <Box textAlign="center" pr={3.5}>
            {order?.id}
          </Box>
        </TableCell>

        {selected.includes(OrderSortBy.ORDER_PARTNER_ID) && (
          <TableCell padding="none" onClick={handleNavigateDetail}>
            {order?.orderPartnerId}
          </TableCell>
        )}

        <TableCell onClick={handleNavigateDetail}>
          {moment(createDate ? createDate[0] : '').format('DD/MM/YYYY HH:mm')}
        </TableCell>

        <TableCell onClick={handleNavigateDetail}>{order?.partner.name}</TableCell>

        <TableCell onClick={handleNavigateDetail}>{order?.store.name}</TableCell>

        {selected.includes(OrderSortBy.FINAL_TOTAL_PRICE) && (
          <TableCell onClick={handleNavigateDetail}>{formatCurrency(order?.finalTotalPrice)}</TableCell>
        )}

        <TableCell onClick={handleNavigateDetail}>
          <Label
            color={
              order?.systemStatus === SystemStatus.COMPLETED
                ? Color.SUCCESS
                : order?.systemStatus === SystemStatus.READY_DELIVERY
                ? Color.WARNING
                : order?.systemStatus === SystemStatus.CANCELLED
                ? Color.ERROR
                : Color.PRIMARY
            }
          >
            {order?.systemStatus === SystemStatus.IN_STORE
              ? translate('status.inStore')
              : order?.systemStatus === SystemStatus.READY_DELIVERY
              ? translate('status.readyDelivery')
              : order?.systemStatus === SystemStatus.COMPLETED
              ? translate('status.completed')
              : translate('status.cancelled')}
          </Label>
        </TableCell>

        <TableCell onClick={handleNavigateDetail}>
          <Label
            color={
              order?.partnerOrderStatus === PartnerOrderStatus.COMPLETED
                ? Color.SUCCESS
                : order?.partnerOrderStatus === PartnerOrderStatus.CANCELLED
                ? Color.ERROR
                : order?.partnerOrderStatus === PartnerOrderStatus.READY
                ? Color.WARNING
                : order?.partnerOrderStatus === PartnerOrderStatus.UPCOMING
                ? Color.DEFAULT
                : Color.INFO
            }
          >
            {order?.partnerOrderStatus === PartnerOrderStatus.READY
              ? translate('status.ready')
              : order?.partnerOrderStatus === PartnerOrderStatus.UPCOMING
              ? translate('status.upcoming')
              : order?.partnerOrderStatus === PartnerOrderStatus.PREPARING
              ? translate('status.preparing')
              : order?.partnerOrderStatus === PartnerOrderStatus.COMPLETED
              ? translate('status.completed')
              : order?.partnerOrderStatus === PartnerOrderStatus.CANCELLED
              ? translate('status.cancelled')
              : ''}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => setOpenList(openList === index ? -1 : index)}>
            {openList === index ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={9}
          sx={{ py: openList !== index ? 0 : 2, px: 2, bgcolor: (theme) => theme.palette.grey[200] }}
        >
          <Collapse in={openList === index} timeout="auto" unmountOnExit>
            <Stack direction="column" p={1} sx={{ bgcolor: 'white', borderRadius: 2 }}>
              {order?.orderDetails.map((detail, indexDetail) => {
                const isLast = indexDetail === order?.orderDetails.length - 1;

                return (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                    sx={{
                      border: 0,
                      borderBottom: isLast ? 0 : 1,
                      borderStyle: 'dashed',
                      borderColor: (theme) => theme.palette.grey[400],
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} width={200}>
                      <Avatar alt={detail.product.name} src={detail.product.image} />
                      <Stack direction="column">
                        <Typography variant="body2" noWrap>
                          {detail.product.name}
                        </Typography>
                        <Typography variant="caption" color={(theme) => theme.palette.grey[500]}>
                          {detail.product.code}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography>x{detail.quantity}</Typography>
                    <Typography>{formatCurrency(detail.product.sellingPrice)}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default OrderTableRow;
