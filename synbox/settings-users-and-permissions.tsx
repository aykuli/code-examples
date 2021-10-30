import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { NavLink as RouterNavLink, LinkProps, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Grid, Link, Breadcrumbs as MuiBreadcrumbs, Divider as MuiDivider, Typography, Box } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import AddIcon from '@material-ui/icons/Add';

import { USERS_AND_PERMISSIONS_URL } from '../../routes/urls';
import { useStyles } from './styles';
import ButtonGreen from '../../components/Buttons/ButtonGreen';
import UsersTable from './tables/UsersTable';
import RolesTable from './tables/RolesTable';
import ScopesTable from './tables/ScopesTable';

const NavLink = React.forwardRef<LinkProps, any>((props, ref) => <RouterNavLink innerRef={ref} {...props} />);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const PermissionSettings = ({ t, location }: WithTranslation & RouteComponentProps): JSX.Element => {
  const classes = useStyles();
  const pathes = location.pathname.split('/');
  const pageType = pathes.includes('scopes') ? 'scopes' : pathes.includes('roles') ? 'roles' : 'users';

  return (
    <>
      <Helmet title={t(pageType)} />
      <Typography variant='h3' gutterBottom display='inline'>
        {t(pageType)}
      </Typography>

      <Breadcrumbs aria-label='Breadcrumb' mt={2}>
        <Link component={NavLink} exact to='/settings' className={classes.breadcrumb}>
          {t('Settings')}
        </Link>
        <Link component={NavLink} exact to={USERS_AND_PERMISSIONS_URL} className={classes.breadcrumb}>
          {t('usersPermissions')}
        </Link>
        <Typography variant='body1' component='span' className={classes.breadcrumbCurr}>
          {t(pageType)}
        </Typography>
      </Breadcrumbs>
      <Box display='flex' justifyContent='flex-end' marginBottom='40px'>
        <Link
          component={NavLink}
          exact
          to={`/settings/users-and-permissions/${pageType}/add`}
          style={{ textDecoration: 'none' }}
        >
          <ButtonGreen autoFocus name='page-settings-users-and-permissions-add'>
            <AddIcon />
            {`${t('add')} ${t(pageType === 'scopes' ? 'scope' : pageType === 'roles' ? 'role' : 'userTo')}`}
          </ButtonGreen>
        </Link>
      </Box>
      <Divider my={6} />
      <Grid container spacing={6} className={classes.gridContainer}>
        <Grid item xs={12} md={12} lg={12}>
          {pageType === 'scopes' ? <ScopesTable /> : pageType === 'roles' ? <RolesTable /> : <UsersTable />}
        </Grid>
      </Grid>
    </>
  );
};

export default withTranslation('translations')(PermissionSettings);
