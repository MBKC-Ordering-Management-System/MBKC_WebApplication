/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Card, Paper, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
// @mui icon
import AddRoundedIcon from '@mui/icons-material/AddRounded';
// redux
import { useAppDispatch, useAppSelector } from 'redux/configStore';
import { setRoutesToBack } from 'redux/routes/routesSlice';
import { getAllStores, setAddFormList } from 'redux/store/storeSlice';
// section
import { StoreTableToolbar } from 'sections/store';
import { StorePartnerTableRow, StorePartnerTableRowSkeleton } from 'sections/storePartner';
import { getAllStorePartners } from 'redux/storePartner/storePartnerSlice';
//
import { ListParams, OrderSort, StoreTable } from '@types';
import { CommonTableHead, EmptyTable, Page, SearchNotFound } from 'components';
import { StorageKeys } from 'constants/storageKeys';
import { useConfigHeadTable, useDebounce, useLocales, usePagination } from 'hooks';
import { PATH_BRAND_APP } from 'routes/paths';
import { getComparator, removeLocalStorage, stableSort } from 'utils';

function ListStorePartnerPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { storeHeadCells } = useConfigHeadTable();
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();

  const { brandProfile } = useAppSelector((state) => state.profile);
  const { isLoading: isLoadingStorePartner } = useAppSelector((state) => state.storePartner);
  const { stores, numberItems, isLoading: isLoadingStore } = useAppSelector((state) => state.store);

  const [order, setOrder] = useState<OrderSort>('asc');
  const [orderBy, setOrderBy] = useState<keyof StoreTable>('name');
  const [filterName, setFilterName] = useState<string>('');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof StoreTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - numberItems) : 0;

  const visibleRows = useMemo(() => stableSort(stores, getComparator(order, orderBy)), [order, orderBy, stores]);

  const isNotFound = !visibleRows.length && !!filterName;

  const debounceValue = useDebounce(filterName, 500);

  const paramsBrandRole: ListParams = useMemo(() => {
    return {
      optionParams: {
        itemsPerPage: rowsPerPage,
        currentPage: page + 1,
        searchValue: debounceValue,
        idBrand: brandProfile?.brandId,
      },
      navigate,
    };
  }, [page, rowsPerPage, debounceValue]);

  useEffect(() => {
    dispatch<any>(getAllStores(paramsBrandRole));
  }, [paramsBrandRole]);

  const paramsStorePartner: ListParams = useMemo(() => {
    return {
      optionParams: {
        itemsPerPage: rowsPerPage,
        currentPage: page + 1,
        searchName: debounceValue,
      },
      navigate,
    };
  }, [page, rowsPerPage, debounceValue]);

  useEffect(() => {
    dispatch<any>(getAllStorePartners(paramsStorePartner));
  }, [paramsStorePartner]);

  return (
    <>
      <Page
        pathname={pathname}
        title={translate('page.title.list', { model: translate('model.lowercase.storePartner') })}
        navigateDashboard={PATH_BRAND_APP.root}
        actions={() => [
          <Button
            variant="contained"
            onClick={() => {
              navigate(PATH_BRAND_APP.storePartner.newStorePartner);
              dispatch(setRoutesToBack(pathname));
              dispatch(setAddFormList());
              removeLocalStorage(StorageKeys.STORE_ID);
            }}
            startIcon={<AddRoundedIcon />}
          >
            {translate('button.add', { model: translate('model.lowercase.storePartner') })}
          </Button>,
        ]}
      >
        <Card>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <StoreTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle" size="medium">
                  <CommonTableHead<StoreTable>
                    hideStatus
                    hideLogo
                    hideEmail
                    hideBrand
                    showAction
                    showPartner
                    headCells={storeHeadCells}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  {isLoadingStore && isLoadingStorePartner ? (
                    <StorePartnerTableRowSkeleton />
                  ) : (
                    <TableBody>
                      {visibleRows.map((store, index) => {
                        return <StorePartnerTableRow key={store.storeId} index={index} store={store} />;
                      })}
                      {emptyRows > 0 ||
                        (stores.length === 0 && !filterName && (
                          <EmptyTable
                            colNumber={storeHeadCells.length + 2}
                            model={translate('model.lowercase.storePartner')}
                          />
                        ))}
                    </TableBody>
                  )}

                  {isNotFound && <SearchNotFound colNumber={storeHeadCells.length + 2} searchQuery={filterName} />}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={numberItems}
                page={page}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={translate('table.rowsPerPage')}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </Card>
      </Page>
    </>
  );
}

export default ListStorePartnerPage;
