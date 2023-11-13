/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentsIcon from '@mui/icons-material/Payments';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Popover as MUIPopover,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
// section
import { OrderDetailPageSkeleton, OrderItem, OrderTimeline } from 'sections/order';
import { CreateShipperPaymentModal } from 'sections/shipperPayment';
//redux
import { useAppDispatch, useAppSelector } from 'redux/configStore';
import { changeOrderToReadyDelivery, getOrderDetail } from 'redux/order/orderSlice';
// interface
import { Color, Language, PartnerOrderStatus, PaymentMethod, Role, SystemStatus } from 'common/enums';
import { OrderStatusActions } from 'common/models';
//
import { ConfirmDialog, Helmet, Label } from 'components';
import { useLocales, useModal, usePagination, usePopover } from 'hooks';
import { PATH_CASHIER_APP, PATH_KITCHEN_CENTER_APP } from 'routes/paths';
import { formatCurrency } from 'utils';

function OrderDetailPage() {
  const { id: orderId } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { translate, currentLang } = useLocales();
  const {
    open: openConfirm,
    handleOpenMenu: handleOpenMenuConfirm,
    handleCloseMenu: handleCloseMenuConfirm,
  } = usePopover();
  const { page, rowsPerPage } = usePagination();
  const { handleOpen: handleOpenCreateShipperPaymentModal, isOpen: isOpenCreateShipperPaymentModal } = useModal();
  const { handleOpen: handleOpenModalReadyDelivery, isOpen: isOpenModalConfirmReadyDelivery } = useModal();

  const { userAuth } = useAppSelector((state) => state.auth);
  const { order, isLoading: isLoadingOrder } = useAppSelector((state) => state.order);

  const paramsDetails = useMemo(() => {
    return {
      orderId,
      navigate,
    };
  }, [orderId]);

  useEffect(() => {
    dispatch<any>(getOrderDetail(paramsDetails));
  }, [paramsDetails]);

  const handleOrderReadyDelivery = () => {
    dispatch<any>(
      changeOrderToReadyDelivery({
        orderId,
        navigate,
      })
    );
  };

  return (
    <>
      <Helmet title={translate('page.title.detail', { model: translate('model.lowercase.order') })} />
      <Container maxWidth="lg">
        {isLoadingOrder ? (
          <OrderDetailPageSkeleton />
        ) : (
          <Box>
            <Stack mb={5} direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={1}>
                <IconButton
                  onClick={
                    userAuth?.roleName === Role.KITCHEN_CENTER_MANAGER
                      ? () => navigate(PATH_KITCHEN_CENTER_APP.order.list)
                      : () => navigate(PATH_CASHIER_APP.order.list)
                  }
                >
                  <KeyboardArrowLeftOutlinedIcon fontSize="medium" color="disabled" />
                </IconButton>
                <Typography variant="h4">
                  {translate('model.capitalizeOne.order')} {order?.id} - {order?.partner.name}
                </Typography>

                <Label
                  color={
                    order?.systemStatus === SystemStatus.COMPLETED
                      ? Color.SUCCESS
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
              </Stack>

              {userAuth?.roleName === Role.CASHIER &&
                order?.systemStatus !== SystemStatus.COMPLETED &&
                order?.systemStatus !== SystemStatus.READY_DELIVERY && (
                  <Button
                    color="inherit"
                    variant="outlined"
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ width: 180 }}
                    onClick={handleOpenMenuConfirm}
                  >
                    {translate('button.menuAction')}
                  </Button>
                )}
            </Stack>

            <Grid container columnSpacing={5} rowSpacing={5}>
              <Grid item xs={12} sm={12} md={7.5}>
                <Card>
                  <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%' }}>
                      <Stack
                        gap={1}
                        direction="row"
                        alignItems="center"
                        px={3}
                        py={2}
                        sx={{
                          borderBottom: 1,
                          borderColor: (theme) => theme.palette.grey[400],
                        }}
                      >
                        <ListAltIcon />
                        <Typography variant="subtitle1">
                          {translate('page.title.detail', { model: translate('model.lowercase.order') })}
                        </Typography>
                      </Stack>

                      <Stack px={3} py={2} gap={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="subtitle1">
                            {translate('table.partnerOrderId')}:{' '}
                            <Typography variant="body1" component="span">
                              {order?.orderPartnerId}
                            </Typography>
                          </Typography>

                          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                            <Typography variant="subtitle1">{translate('table.partnerOrderStatus')}:</Typography>
                            <Label
                              color={
                                order?.partnerOrderStatus === PartnerOrderStatus.COMPLETED
                                  ? Color.SUCCESS
                                  : order?.partnerOrderStatus === PartnerOrderStatus.CANCELLED
                                  ? Color.ERROR
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
                                : translate('status.cancelled')}
                            </Label>
                          </Stack>
                        </Stack>

                        <Typography variant="subtitle1">
                          {translate('table.store')}:{' '}
                          <Typography variant="body1" component="span">
                            {order?.store.name}
                          </Typography>
                        </Typography>

                        <Typography variant="subtitle1">
                          {translate('page.content.orderNote')}:{' '}
                          <Typography variant="body1" component="span">
                            {order?.note}
                          </Typography>
                        </Typography>

                        <Stack>
                          <Typography variant="subtitle1">
                            {currentLang.value === Language.VIETNAMESE
                              ? translate('page.title.details', { model: translate('model.lowercase.products') })
                              : translate('page.title.details', { model: translate('model.capitalizeOne.products') })}
                            :
                          </Typography>
                          {order?.orderDetails.map((orderDetail, index) => {
                            const isLast = index === order?.orderDetails.length - 1;

                            return (
                              <Stack
                                sx={{
                                  border: 0,
                                  borderBottom: isLast ? 0 : 1,
                                  borderStyle: 'dashed',
                                  borderColor: (theme) => theme.palette.grey[400],
                                }}
                              >
                                <OrderItem
                                  key={orderDetail.product.productId}
                                  paddingTop={2}
                                  productDetail={orderDetail.product}
                                  quantity={orderDetail.quantity}
                                  noteContent={orderDetail.note}
                                />
                              </Stack>
                            );
                          })}
                        </Stack>

                        <Divider />

                        <Stack gap={1} textAlign="right">
                          <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                              {translate('page.content.subTotalPrice')}
                            </Typography>
                            <Typography width={150} variant="body2">
                              {formatCurrency(order?.subTotalPrice as number)}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                              {translate('page.content.deliveryFee')}
                            </Typography>
                            <Typography width={150} variant="body2">
                              {formatCurrency(order?.deliveryFee as number)}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                              {translate('page.content.totalDiscount')}
                            </Typography>
                            <Typography width={150} variant="body2" color="red">
                              {formatCurrency(order?.totalDiscount as number)}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <Typography variant="subtitle1">{translate('page.content.finalTotalPrice')}</Typography>
                            <Typography width={150} variant="subtitle1">
                              {formatCurrency(order?.finalTotalPrice as number)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>
                </Card>

                <Box mt={5}>
                  <OrderTimeline />
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={4.5}>
                <Card>
                  <Box width="100%">
                    <Paper sx={{ width: '100%' }}>
                      <Stack
                        gap={1}
                        direction="row"
                        alignItems="center"
                        px={3}
                        py={2}
                        sx={{
                          borderBottom: 1,
                          borderColor: (theme) => theme.palette.grey[400],
                        }}
                      >
                        <InfoIcon />
                        <Typography variant="subtitle1">{translate('page.content.orderInformation')}</Typography>
                      </Stack>
                      <Stack gap={2} p={2}>
                        <Stack gap={1}>
                          <Typography variant="subtitle1">{translate('page.content.shipping')}</Typography>
                          <Typography variant="body2" color={(theme) => theme.palette.grey[500]}>
                            {translate('page.content.customer')}:{' '}
                            <Typography variant="body2" component="span" color="black">
                              {order?.customerName}
                            </Typography>
                          </Typography>

                          <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                            {translate('model.capitalize.phone')}:{' '}
                            <Typography variant="body2" component="span" color="black">
                              {order?.customerPhone}
                            </Typography>
                          </Typography>

                          <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                            {translate('table.address')}:{' '}
                            <Typography variant="body2" component="span" color="black">
                              {order?.address}
                            </Typography>
                          </Typography>
                        </Stack>

                        <Divider />

                        <Stack gap={1}>
                          <Typography variant="subtitle1">{translate('page.content.delivery')}</Typography>
                          <Typography variant="body2" color={(theme) => theme.palette.grey[500]}>
                            {translate('page.content.shipperName')}:{' '}
                            <Typography variant="body2" component="span" color="black">
                              {order?.shipperName}
                            </Typography>
                          </Typography>

                          <Typography variant="body2" color={(theme) => theme.palette.grey[500]}>
                            {translate('page.content.shipperPhone')}:{' '}
                            <Typography variant="body2" component="span" color="black">
                              {order?.shipperPhone}
                            </Typography>
                          </Typography>
                        </Stack>

                        <Divider />

                        <Stack gap={1}>
                          <Typography variant="subtitle1">{translate('page.content.payment')}</Typography>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[500] }}>
                              {translate('page.content.paidBy')}
                            </Typography>
                            <Label color={Color.PRIMARY}>
                              {order?.paymentMethod === PaymentMethod.CASH
                                ? translate('page.content.cash')
                                : translate('page.content.cashless')}
                            </Label>
                          </Stack>
                        </Stack>

                        {userAuth?.roleName === Role.CASHIER && order?.systemStatus !== SystemStatus.COMPLETED && (
                          <>
                            <Divider />

                            <Stack direction="row" justifyContent="flex-end">
                              <Button
                                disabled={
                                  order?.systemStatus === SystemStatus.READY_DELIVERY &&
                                  order.partnerOrderStatus === PartnerOrderStatus.READY
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  handleOpenCreateShipperPaymentModal(OrderStatusActions.COMPLETED);
                                }}
                                variant="outlined"
                                startIcon={<PaymentsIcon />}
                              >
                                {translate('page.title.create', {
                                  model: translate('model.lowercase.shipperPayment'),
                                })}
                              </Button>
                            </Stack>
                          </>
                        )}
                      </Stack>
                    </Paper>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      {!isLoadingOrder &&
        order?.systemStatus !== SystemStatus.COMPLETED &&
        order?.systemStatus !== SystemStatus.READY_DELIVERY && (
          <MUIPopover
            open={Boolean(openConfirm)}
            anchorEl={openConfirm}
            onClose={handleCloseMenuConfirm}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 1,
                mt: 0.5,
                width: 180,
                '& .MuiMenuItem-root': {
                  px: 1,
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleOpenModalReadyDelivery(OrderStatusActions.READY_DELIVERY);
              }}
            >
              <DeliveryDiningIcon fontSize="small" sx={{ mr: 2 }} />
              {translate('status.readyDelivery')}
            </MenuItem>
          </MUIPopover>
        )}

      {isOpenModalConfirmReadyDelivery && (
        <ConfirmDialog
          open={isOpenModalConfirmReadyDelivery}
          onClose={handleOpenModalReadyDelivery}
          onAction={handleOrderReadyDelivery}
          isOrder
          model={order?.orderPartnerId}
          subModel={translate('model.lowercase.readyToDelivery')}
          color={Color.SUCCESS}
          title={translate('dialog.confirmOrderReadyDeliveryTitle', { model: translate('model.lowercase.order') })}
          description={translate('dialog.confirmOrderReadyDeliveryContent')}
        />
      )}

      {isOpenCreateShipperPaymentModal && (
        <CreateShipperPaymentModal
          isOpen={isOpenCreateShipperPaymentModal}
          handleOpen={handleOpenCreateShipperPaymentModal}
          page={page}
          rowsPerPage={rowsPerPage}
          paymentMethod={order?.paymentMethod as string}
          orderPartnerId={order?.orderPartnerId as string}
          orderId={order?.id as number}
        />
      )}
    </>
  );
}

export default OrderDetailPage;
