import { CreateKitchenCenterParams, ListParams } from '@types';
import { axiosClient, axiosFormData, setHeaderAuth } from 'api/axiosClient';
import { RoutesApiKeys } from 'constants/routesApiKeys';
import { setMessageError, setMessageSuccess } from 'redux/auth/authSlice';
import { PATH_ADMIN_APP } from 'routes/paths';
import { getAccessToken, getErrorMessage } from 'utils';
import { getAllKitchenCenters } from './kitchenCenterSlice';

export const getAllKitchenCentersThunk = async (params: ListParams, thunkAPI: any) => {
  const { optionParams, navigate } = params;
  const accessToken = getAccessToken();
  console.log(optionParams.keySearchName);
  if (accessToken) {
    setHeaderAuth(accessToken);
    try {
      const response = await axiosClient.get(RoutesApiKeys.GET_ALL_KITCHEN_CENTER(optionParams));
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error, navigate);
      thunkAPI.dispatch(setMessageError(errorMessage));
      return thunkAPI.rejectWithValue(error);
    }
  }
};

export const getKitchenCenterDetailThunk = async (params: any, thunkAPI: any) => {
  const { kitchenCenterId, navigate } = params;
  const accessToken = getAccessToken();
  if (accessToken) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    try {
      const response = await axiosClient.get(`/kitchencenters/${kitchenCenterId}`);
      console.log(response);
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error, navigate);
      thunkAPI.dispatch(setMessageError(errorMessage));
      return thunkAPI.rejectWithValue(error);
    }
  }
};

export const createNewKitchenCenterThunk = async (params: CreateKitchenCenterParams, thunkAPI: any) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    setHeaderAuth(accessToken);
    try {
      console.log('Logo: ', params.newKitchenCenter);
      const response = await axiosFormData.post('/kitchencenters', params.newKitchenCenter);
      if (response) {
        console.log(response);
        thunkAPI.dispatch(setMessageSuccess('Create kitchen center successfully'));
        params.navigate(PATH_ADMIN_APP.kitchenCenter.list);
      }
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error, params.navigate);
      thunkAPI.dispatch(setMessageError(errorMessage));
      return thunkAPI.rejectWithValue(error);
    }
  }
};

export const updateKitchenCenterThunk = async (params: any, thunkAPI: any) => {
  const { navigate, updateKitchenCenterOptions, kitchenCenterId } = params;
  console.log(updateKitchenCenterOptions);
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      const response = await axiosFormData.put(`/kitchencenters/${kitchenCenterId}`, updateKitchenCenterOptions);
      if (response) {
        thunkAPI.dispatch(setMessageSuccess('Update kitchen center successfully'));
      }
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error, navigate);
      thunkAPI.dispatch(setMessageError(errorMessage));
      return thunkAPI.rejectWithValue(error);
    }
  }
};

export const deleteKitchenCenterThunk = async (params: any, thunkAPI: any) => {
  const { navigate, kitchenCenterId } = params;
  const options = {
    itemsPerPage: 5,
    currentPage: 1,
    keySearchName: '',
  };
  const params_callback = {
    optionParams: options,
    navigate,
  };
  const accessToken = getAccessToken();
  console.log(kitchenCenterId);
  if (accessToken) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      const response = await axiosClient.delete(`/kitchencenters/${kitchenCenterId}`);
      if (response) {
        thunkAPI.dispatch(getAllKitchenCenters(params_callback));
        thunkAPI.dispatch(setMessageSuccess('Deleted sport center successfully'));
      }
      console.log(response);
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error, navigate);
      thunkAPI.dispatch(setMessageError(errorMessage));
      return thunkAPI.rejectWithValue(error);
    }
  }
};
