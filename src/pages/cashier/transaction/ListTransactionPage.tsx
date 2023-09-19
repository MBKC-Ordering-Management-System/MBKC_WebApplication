import { useLocation } from 'react-router-dom';
//
import { Page } from 'components';
import { PATH_CASHIER_APP } from 'routes/paths';

function ListTransactionPage() {
  const { pathname } = useLocation();

  return (
    <>
      <Page title="List Order" pathname={pathname} navigateDashboard={PATH_CASHIER_APP.root}>
        <div>ListTransactionPage</div>{' '}
      </Page>
    </>
  );
}

export default ListTransactionPage;
