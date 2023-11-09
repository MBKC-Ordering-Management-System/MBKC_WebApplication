import { Role } from 'common/enums';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from 'redux/configStore';
import { getAccessToken } from 'utils';
import { PATH_ERROR } from './paths';

function BrandRouter() {
  const location = useLocation();
  const accessToken = getAccessToken();

  const { isAuthenticated, userAuth } = useAppSelector((state) => state.auth);

  return isAuthenticated && accessToken && userAuth?.roleName === Role.BRAND_MANAGER ? (
    <Outlet />
  ) : (
    <Navigate to={PATH_ERROR.noPermission} state={{ from: location }} />
  );
}

export default BrandRouter;
