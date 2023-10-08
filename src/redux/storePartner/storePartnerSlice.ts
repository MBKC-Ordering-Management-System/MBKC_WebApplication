import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StorePartner } from '@types';
import { StorageKeys } from 'constants/storageKeys';
import { getIsEditing, setLocalStorage } from 'utils';
import {
  createNewStorePartnerThunk,
  deleteStorePartnerThunk,
  getAllStorePartnersThunk,
  getStorePartnerDetailThunk,
  updateStatusStorePartnerThunk,
  updateStorePartnerThunk,
} from './storePartnerThunk';

interface StorePartnerState {
  isEditing: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  storePartners: StorePartner[];
  storePartner: StorePartner | null;
  totalPage: number;
  numberItems: number;
}

const getIsEditingInStorage =
  getIsEditing(StorageKeys.IS_EDIT_STORE_PARTNER) === true ? getIsEditing(StorageKeys.IS_EDIT_STORE_PARTNER) : false;

const initialState: StorePartnerState = {
  isEditing: getIsEditingInStorage,
  isLoading: false,
  isError: false,
  isSuccess: false,
  storePartners: [],
  storePartner: null,
  totalPage: 0,
  numberItems: 5,
};

export const createNewStorePartner = createAsyncThunk('store-partner/create-store-partner', createNewStorePartnerThunk);
export const getAllStorePartners = createAsyncThunk('store-partner/get-allsStores', getAllStorePartnersThunk);
export const getStorePartnerDetail = createAsyncThunk(
  'store-partner/get-store-partner-detail',
  getStorePartnerDetailThunk
);
export const updateStorePartner = createAsyncThunk('store-partner/update-store-partner', updateStorePartnerThunk);
export const updateStatusStorePartner = createAsyncThunk(
  'store-partner/update-status-store-partner',
  updateStatusStorePartnerThunk
);
export const deleteStore = createAsyncThunk('store-partner/delete-store-partner', deleteStorePartnerThunk);

const storePartnerSlice = createSlice({
  name: 'storePartner',
  initialState,
  reducers: {
    getStorePartnerDetail_local: (state, action) => {
      state.storePartner = action.payload;
    },
    setAddStorePartner: (state) => {
      state.isEditing = false;
      setLocalStorage(StorageKeys.IS_EDIT_STORE_PARTNER, false);
    },
    setEditStorePartner: (state, action) => {
      state.isEditing = true;
      state.storePartner = action.payload;
      setLocalStorage(StorageKeys.IS_EDIT_STORE_PARTNER, true);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createNewStorePartner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewStorePartner.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createNewStorePartner.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getAllStorePartners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllStorePartners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.storePartners = [...action.payload?.storePartners];
        state.totalPage = action.payload?.totalPage;
        state.numberItems = action.payload?.numberItems;
      })
      .addCase(getAllStorePartners.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getStorePartnerDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStorePartnerDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.storePartner = { ...action.payload };
      })
      .addCase(getStorePartnerDetail.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateStorePartner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStorePartner.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateStorePartner.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateStatusStorePartner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStatusStorePartner.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateStatusStorePartner.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(deleteStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStore.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteStore.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export const { getStorePartnerDetail_local, setAddStorePartner, setEditStorePartner } = storePartnerSlice.actions;
const storeReducer = storePartnerSlice.reducer;

export default storeReducer;
