import { Checkbox, IconButton, Skeleton, Stack, TableBody, TableCell, TableRow } from '@mui/material';

interface ExtraToCategoryRowSkeletonProps {
  length: number;
  showAction?: boolean;
}

function ExtraToCategoryRowSkeleton({ length, showAction = false }: ExtraToCategoryRowSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: length ? length : 5 }).map((_, index: any) => (
        <TableRow
          hover
          tabIndex={-1}
          sx={showAction ? { cursor: 'pointer', height: '72.89px' } : { cursor: 'pointer' }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              inputProps={{
                'aria-labelledby': `enhanced-table-checkbox-${index}`,
              }}
            />
          </TableCell>

          <TableCell scope="row" component="th" padding="none" width={80}>
            <Skeleton variant="circular" width={40} height={40} />
          </TableCell>
          <TableCell component="th" scope="row">
            <Skeleton />
          </TableCell>
          <TableCell align="left">
            <Skeleton />
          </TableCell>

          <TableCell align="left">
            <Skeleton variant="rounded" width={100} height={24} />
          </TableCell>
          {showAction && (
            <TableCell align="right">
              <Stack direction="row" alignItems="center" justifyContent="right">
                <Skeleton variant="rounded" width={30} height={14} />
                <IconButton color="inherit">
                  <Skeleton variant="circular" width={28} height={28} />
                </IconButton>
              </Stack>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default ExtraToCategoryRowSkeleton;
