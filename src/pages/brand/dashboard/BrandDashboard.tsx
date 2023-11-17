/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Container, Grid, Stack, Typography } from '@mui/material';
// @mui icon
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SummarizeIcon from '@mui/icons-material/Summarize';
// redux
import { getAllCategories, getAllExtraCategories } from 'redux/category/categorySlice';
import { useAppDispatch, useAppSelector } from 'redux/configStore';
import { getAllProducts } from 'redux/product/productSlice';
import { getAllStores } from 'redux/store/storeSlice';
// section
import { AppCurrentIncomes, AppWidgetSummaryOutline, ListNewStores, ListProductStatistics } from 'sections/dashboard';
// interface
import { ListParams } from 'common/@types';
import { Color } from 'common/enums';
import { CategoryType } from 'common/models';
//
import { Helmet } from 'components';
import { useLocales } from 'hooks';

function BrandDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();
  const { translate } = useLocales();

  const { numberItems: totalStoreItems, isLoading: isLoadingStore } = useAppSelector((state) => state.store);
  const { numberItems: totalProductItems, isLoading: isLoadingProduct } = useAppSelector((state) => state.product);
  const {
    numberItems: totalCategoryItems,
    numberExtraItems,
    isLoading: isLoadingCategory,
  } = useAppSelector((state) => state.category);

  const params: ListParams = {
    optionParams: {
      itemsPerPage: 5,
      currentPage: 1,
    },
    navigate,
  };

  const paramCategories: ListParams = {
    optionParams: {
      type: CategoryType.NORMAL,
    },
    navigate,
  };

  const paramExtraCategories: ListParams = {
    optionParams: {
      type: CategoryType.EXTRA,
    },
    navigate,
  };

  useEffect(() => {
    dispatch<any>(getAllStores(params));
    dispatch<any>(getAllCategories(paramCategories));
    dispatch<any>(getAllExtraCategories(paramExtraCategories));
    dispatch<any>(getAllProducts(params));
  }, []);

  return (
    <>
      <Helmet title={translate('page.title.brandManagement')} />

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {translate('common.welcome')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummaryOutline
              title={translate('page.dashboard.titleSummary', { model: translate('model.lowercase.stores') })}
              total={totalStoreItems}
              isLoading={isLoadingStore}
              icon={<RestaurantMenuIcon fontSize="large" />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummaryOutline
              title={translate('page.dashboard.titleSummary', { model: translate('model.lowercase.normalCategories') })}
              total={totalCategoryItems}
              isLoading={isLoadingCategory}
              color={Color.INFO}
              icon={<SummarizeIcon fontSize="large" />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummaryOutline
              title={translate('page.dashboard.titleSummary', { model: translate('model.lowercase.extraCategories') })}
              total={numberExtraItems}
              isLoading={isLoadingCategory}
              color={Color.WARNING}
              icon={<LanOutlinedIcon fontSize="large" />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummaryOutline
              title={translate('page.dashboard.titleSummary', { model: translate('model.lowercase.products') })}
              total={totalProductItems}
              isLoading={isLoadingProduct}
              color={Color.SUCCESS}
              icon={<DinnerDiningIcon fontSize="large" />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} sm={6} md={12}>
            <AppCurrentIncomes
              title={translate('page.title.storeRevenue')}
              subheader={translate('page.content.storeRevenue')}
              chartData={[
                { label: 'Jan', value: 400 },
                { label: 'Feb', value: 430 },
                { label: 'Mar', value: 448 },
                { label: 'Apr', value: 470 },
                { label: 'May', value: 200 },
                { label: 'Jun', value: 580 },
                { label: 'July', value: 690 },
                { label: 'Aug', value: 1100 },
                { label: 'Sep', value: 1200 },
                { label: 'Oct', value: 1380 },
                { label: 'Nov', value: 1380 },
                { label: 'Dec', value: 2000 },
              ]}
            />
          </Grid>
        </Grid>

        <Stack gap={5} mt={5}>
          <ListNewStores pathname={pathname} />
          <ListProductStatistics />
        </Stack>
      </Container>
    </>
  );
}

export default BrandDashboard;
