import { useMemo, useState } from 'react';
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
// @mui icon
import AddRoundedIcon from '@mui/icons-material/AddRounded';
//
import { OrderSort, ProductTable } from '@types';
import { CommonTableHead, Page, SearchNotFound } from 'components';
import { useAppSelector } from 'redux/configStore';
import { PATH_BRAND_APP } from 'routes/paths';
import { ProductTableRow, ProductTableToolbar } from 'sections/product';
import { getComparator, stableSort } from 'utils';
import { productHeadCells } from '../../common/headCells';

function ListProductPage() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { products } = useAppSelector((state) => state.product);

  const [order, setOrder] = useState<OrderSort>('asc');
  const [orderBy, setOrderBy] = useState<keyof ProductTable>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState<string>('');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ProductTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(products, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, products]
  );

  const isNotFound = !visibleRows.length && !!filterName;

  return (
    <>
      <Page
        title="List Product"
        pathname={pathname}
        navigateDashboard={PATH_BRAND_APP.root}
        actions={() => [
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              navigate(PATH_BRAND_APP.product.newProduct);
            }}
          >
            Create product
          </Button>,
        ]}
      >
        <Card>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <ProductTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle" size="medium">
                  <CommonTableHead<ProductTable>
                    headCells={productHeadCells}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {visibleRows.map((product, index) => {
                      return <ProductTableRow index={index} product={product} />;
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={productHeadCells.length} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isNotFound && <SearchNotFound colNumber={productHeadCells.length} searchQuery={filterName} />}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products.length}
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

export default ListProductPage;
