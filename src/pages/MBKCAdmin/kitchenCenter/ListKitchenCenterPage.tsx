import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
//@mui Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
//
import { KitchenCenter, KitchenCenterTable, ListParams, OrderSort } from '@types';
import { CommonTableHead, Page, SearchNotFound } from 'components';
import { useConfigHeadTable, usePagination } from 'hooks';
import { useAppDispatch, useAppSelector } from 'redux/configStore';
import {
  getAllKitchenCenters,
  getKitchenCenterDetail,
  setAddKitchenCenter,
} from 'redux/kitchenCenter/kitchenCenterSlice';
import { PATH_ADMIN_APP } from 'routes/paths';
import {
  KitchenCenterTableRow,
  KitchenCenterTableRowSkeleton,
  KitchenCenterTableToolbar,
} from 'sections/kitchenCenter';
import { getComparator, stableSort } from 'utils';
import { getStoresByKitchenCenter } from 'redux/store/storeSlice';

function ListKitchenCenterPage(props: any) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { kitchenCenterHeadCells } = useConfigHeadTable();
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();

  const [order, setOrder] = useState<OrderSort>('asc');
  const [orderBy, setOrderBy] = useState<keyof KitchenCenterTable>('name');
  const [filterName, setFilterName] = useState<string>('');

  const { kitchenCenters, isLoading } = useAppSelector((state) => state.kitchenCenter);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof KitchenCenterTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleNavigateDetail = (kitchenCenter: KitchenCenter, kitchenCenterId: number) => {
    const params = {
      navigate,
      kitchenCenterId,
    };
    navigate(PATH_ADMIN_APP.kitchenCenter.root + `/detail/${kitchenCenterId}`);
    dispatch(getKitchenCenterDetail(params));
    dispatch(getStoresByKitchenCenter(params));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - kitchenCenters.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(kitchenCenters, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, kitchenCenters]
  );

  const isNotFound = !visibleRows.length && !!filterName;

  const params: ListParams = useMemo(() => {
    return {
      optionParams: {
        itemsPerPage: rowsPerPage,
        currentPage: page + 1,
        keySearchName: filterName,
      },
      navigate,
    };
  }, [page, rowsPerPage, filterName, navigate]);

  useEffect(() => {
    dispatch(getAllKitchenCenters(params));
  }, [dispatch, navigate, params]);

  return (
    <>
      <Page
        title="List Of Kitchen Center"
        pathname={pathname}
        navigateDashboard={PATH_ADMIN_APP.root}
        actions={() => [
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              navigate(PATH_ADMIN_APP.kitchenCenter.newKitchenCenter);
              dispatch(setAddKitchenCenter());
            }}
          >
            Create new Kitchen Center
          </Button>,
        ]}
      >
        <Card>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <KitchenCenterTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle" size="medium">
                  <CommonTableHead<KitchenCenterTable>
                    headCells={kitchenCenterHeadCells}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  {isLoading ? (
                    <KitchenCenterTableRowSkeleton length={visibleRows.length} />
                  ) : (
                    <TableBody>
                      {visibleRows.map((kitchenCenter, index) => {
                        return (
                          <KitchenCenterTableRow
                            index={index}
                            kitchenCenter={kitchenCenter}
                            handleNavigateDetail={handleNavigateDetail}
                          />
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: 53 * emptyRows,
                          }}
                        >
                          <TableCell colSpan={kitchenCenterHeadCells.length} />
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                  {isNotFound && <SearchNotFound colNumber={kitchenCenterHeadCells.length} searchQuery={filterName} />}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={kitchenCenters.length}
                rowsPerPage={rowsPerPage}
                page={page}
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

export default ListKitchenCenterPage;
