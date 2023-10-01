import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
//
import { Category, CategoryTable, CategoryType, OrderSort } from '@types';
import { CommonTableHead, EmptyTable, SearchNotFound } from 'components';
import { useConfigHeadTable, useLocales, usePagination } from 'hooks';
import { getCategoryDetail_local } from 'redux/category/categorySlice';
import { useAppDispatch, useAppSelector } from 'redux/configStore';
import { PATH_BRAND_APP } from 'routes/paths';
import { CategoryTableToolbar } from 'sections/category';
import { getComparator, stableSort } from 'utils';
import ExtraToCategoryRow from './ExtraToCategoryRow';
import ExtraToCategoryRowSkeleton from './ExtraToCategoryRowSkeleton';
import { Language } from 'common/enum';

interface AddExtraToCategoryModalProps {
  isOpen: boolean;
  handleOpen: (title: any) => void;
}

function AddExtraToCategoryModal({ isOpen, handleOpen }: AddExtraToCategoryModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { translate, currentLang } = useLocales();
  const { categoryHeadCells } = useConfigHeadTable();
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = usePagination();

  const { categories, isLoading } = useAppSelector((state) => state.category);

  const [order, setOrder] = useState<OrderSort>('asc');
  const [orderBy, setOrderBy] = useState<keyof CategoryTable>('name');
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [filterName, setFilterName] = useState<string>('');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof CategoryTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleNavigateDetail = (category: Category, categoryId: number) => {
    navigate(PATH_BRAND_APP.category.root + `/detail/${categoryId}`);
    dispatch(getCategoryDetail_local(category));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = categories.map((n) => n.categoryId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, categoryId: number) => {
    const selectedIndex = selected.indexOf(categoryId);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, categoryId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (categoryId: number) => selected.indexOf(categoryId) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(categories, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, categories]
  );

  const isNotFound = !visibleRows.length && !!filterName;

  return (
    <>
      {isOpen && (
        <Dialog maxWidth="md" fullWidth open={isOpen} onClose={handleOpen}>
          <DialogContent sx={{ pb: 0 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4">{translate('page.content.extraInCategory')}</Typography>

              <IconButton onClick={handleOpen}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Divider sx={{ mt: 1.5 }} />

            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <CategoryTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
                <TableContainer>
                  <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle" size="medium">
                    <CommonTableHead<CategoryTable>
                      checkbox
                      numSelected={selected.length}
                      rowCount={categories.length}
                      headCells={categoryHeadCells}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    {isLoading ? (
                      <ExtraToCategoryRowSkeleton length={visibleRows.length} />
                    ) : (
                      <TableBody>
                        {visibleRows.map((category, index) => {
                          const isItemSelected = isSelected(category.categoryId);

                          return (
                            <ExtraToCategoryRow
                              key={category.categoryId}
                              showAction
                              checkbox
                              index={index}
                              category={category}
                              handleClick={handleClick}
                              isItemSelected={isItemSelected}
                              categoryType={CategoryType.EXTRA}
                              handleNavigateDetail={handleNavigateDetail}
                            />
                          );
                        })}
                        {emptyRows > 0 && <EmptyTable colNumber={categoryHeadCells.length} />}
                      </TableBody>
                    )}
                    {isNotFound && <SearchNotFound colNumber={categoryHeadCells.length} searchQuery={filterName} />}
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={categories.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" px={2}>
              {selected.length > 0 && (
                <Typography variant="subtitle1">
                  {currentLang.value === Language.ENGLISH
                    ? `${selected.length + ' ' + translate('page.content.selected')}`
                    : `${translate('page.content.selected') + ' ' + selected.length}`}
                </Typography>
              )}

              <Stack direction="row" gap={2} ml="auto">
                <Button onClick={handleOpen} variant="text" color="secondary">
                  {translate('button.cancel')}
                </Button>
                <Button onClick={handleOpen} variant="contained" autoFocus>
                  {translate('button.addMore')}
                </Button>
              </Stack>
            </Stack>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default AddExtraToCategoryModal;