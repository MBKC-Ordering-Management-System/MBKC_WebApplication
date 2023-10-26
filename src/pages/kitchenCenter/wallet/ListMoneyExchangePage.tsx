import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Paper, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
//redux
import { useAppSelector } from 'redux/configStore';
// section
import { MoneyExchangeTableRow, MoneyExchangeTableToolbar } from 'sections/moneyExchange';
//
import { MoneyExchange, MoneyExchangeTable, OrderSort } from '@types';
import { CommonTableHead, EmptyTable, Page, SearchNotFound } from 'components';
import { useConfigHeadTable, useLocales, usePagination } from 'hooks';
import { PATH_KITCHEN_CENTER_APP } from 'routes/paths';
import { getComparator, stableSort } from 'utils';

function ListMoneyExchangePage() {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { translate } = useLocales();
  const { MoneyExchangeHeadCells } = useConfigHeadTable();
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();

  const { moneyExchanges } = useAppSelector((state) => state.wallet);

  const [order, setOrder] = useState<OrderSort>('asc');
  const [orderBy, setOrderBy] = useState<keyof MoneyExchangeTable>('sender');
  const [filterName, setFilterName] = useState<string>('');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof MoneyExchangeTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleNavigateDetail = (moneyExchange: MoneyExchange, moneyExchangeId: number) => {
    navigate(PATH_KITCHEN_CENTER_APP.wallet.root + `/${moneyExchangeId}`);
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - moneyExchanges.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(moneyExchanges, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, moneyExchanges]
  );

  const isNotFound = !visibleRows.length && !!filterName;

  return (
    <>
      <Page title="List Of Money Exchange" pathname={pathname} navigateDashboard={PATH_KITCHEN_CENTER_APP.root}>
        <Card>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <MoneyExchangeTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle" size="medium">
                  <CommonTableHead<MoneyExchangeTable>
                    headCells={MoneyExchangeHeadCells}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />

                  <TableBody>
                    {visibleRows.map((moneyExchange, index) => {
                      return (
                        <MoneyExchangeTableRow
                          key={index}
                          index={index}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          moneyExchange={moneyExchange}
                          handleNavigateDetail={handleNavigateDetail}
                        />
                      );
                    })}
                    {emptyRows > 0 ||
                      (moneyExchanges.length === 0 && !filterName && (
                        <EmptyTable
                          colNumber={MoneyExchangeHeadCells.length + 2}
                          model={translate('model.lowercase.store')}
                        />
                      ))}
                  </TableBody>

                  {isNotFound && (
                    <SearchNotFound colNumber={MoneyExchangeHeadCells.length + 2} searchQuery={filterName} />
                  )}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={moneyExchanges.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={translate('table.rowsPerPage')}
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

export default ListMoneyExchangePage;
