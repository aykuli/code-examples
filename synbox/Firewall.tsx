import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import _ from 'lodash';
import axiosRoot, { AxiosResponse } from 'axios';
import { Grid, Typography, Link, Paper, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { Add, ExpandMore } from '@material-ui/icons';

import axios from '../../services/api';
import { Snackbar, SnackbarTypes } from '../../types';
import { useStyles } from './styles';
import { GET200_ApiSettingsFirewall } from '../../common-types';
import { FIREWALL_URL } from '../../routes/urls';
import { handleErrors } from '../../services/errorHandler';
import {
  FIREWALL_INPUT as INPUT,
  FirewallConfig,
  RuleEnum,
  getInitRule,
  getConfigFromServer,
  getConfigForServer,
  setFieldTypeErrToNull,
} from './helpers';
import { NavLink, Breadcrumbs, Divider } from '../../components/MaterialRestyledComponents';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import { FlexContainer } from '../../components/styled-components/FlexContainer';
import BackdropLight from '../../components/BackdropLight';
import ButtonGreen from '../../components/Buttons/ButtonGreen';
import { DefaultInputs, DockerRules } from './Inputs';

interface ReqState {
  load: boolean;
  save: boolean;
}
interface ExpandInterface {
  defaultRules?: boolean;
  rules?: boolean;
}

const Firewall: FC<WithTranslation> = ({ t }) => {
  const classes = useStyles();
  const [config, setConfig] = useState<FirewallConfig>({ defaultRules: [], rules: [] });
  const [reqState, setReqState] = useState<ReqState>({ load: true, save: false });
  const [errors, setErrors] = useState<any>({});
  const [snackbar, setSnackbar] = useState<Snackbar>({
    type: SnackbarTypes.success,
    msg: '',
    isShow: false,
  });
  const [expanded, setExpanded] = useState<ExpandInterface>({ defaultRules: true, rules: false });

  useEffect(() => {
    const source = axiosRoot.CancelToken.source();
    const getRules = async () => {
      try {
        const response: AxiosResponse<GET200_ApiSettingsFirewall> = await axios().get(FIREWALL_URL);
        const config = getConfigFromServer(response.data);
        setConfig(config);
      } catch (e) {
        console.error(e);
        handleErrors(e, setErrors);
        setSnackbar({ msg: t('errorCommon'), isShow: true, type: SnackbarTypes.error });
      } finally {
        setReqState((prev: ReqState) => ({ ...prev, load: false }));
      }
    };
    getRules();
    return () => source.cancel('Firewall request canceled');
  }, [t]);

  const handleAddRule = (type: RuleEnum) => {
    const newRule = getInitRule(type);
    const oldConfigs = config[type] || [];
    const newRules = [newRule, ...oldConfigs];
    setConfig((prev: FirewallConfig) => ({ ...prev, [type]: newRules }));
    setErrors((prev: any) => setFieldTypeErrToNull(prev, type));
  };

  const handleDeleteRule = (type: RuleEnum, index: number) => {
    const before = config[type].slice(0, index);
    const after = config[type].slice(index + 1);
    const newRules = [...before, ...after];
    setConfig((prev: FirewallConfig) => ({ ...prev, [type]: newRules }));
    setErrors((prev: any) => setFieldTypeErrToNull(prev, type));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, id, value } = e.target;
    const valToSplit = name || id;
    const splittedArr = valToSplit.split('.');
    const type = splittedArr[0] as RuleEnum;
    const index = Number(splittedArr[1]);
    const field = splittedArr[2] as INPUT;
    setErrors((prev: any) => setFieldTypeErrToNull(prev, type));

    const newRules = [...config[type]];
    let valuePorts: RegExpMatchArray | null = null;
    if ([INPUT.port, INPUT.ports].includes(field as INPUT)) {
      const regexp = /[0-9 ,]/g;
      valuePorts = e.target.value.match(regexp);
    }
    const valueToSet = valuePorts ? Array.from(valuePorts).join('') : value;
    const newRule = { ...newRules[index], [field]: valueToSet };
    newRules[index] = newRule;
    setConfig((prev: FirewallConfig) => ({ ...prev, [type]: newRules }));
  };

  const handleSave = async () => {
    setReqState((prev: ReqState) => ({ ...prev, save: true }));
    setErrors({});
    const configForServer = getConfigForServer(config);
    try {
      await axios().post(FIREWALL_URL, configForServer);
      setSnackbar({ msg: t('firewallSaveSuccess'), isShow: true, type: SnackbarTypes.success });
    } catch (e) {
      console.error(e);
      handleErrors(e, setErrors);
      setSnackbar({ msg: t('firewallSaveFail'), isShow: true, type: SnackbarTypes.error });
    } finally {
      setReqState((prev: ReqState) => ({ ...prev, save: false }));
    }
  };

  useEffect(() => {
    const expandFields: ExpandInterface = {};
    _.keysIn(errors).forEach(key => {
      const field = key.includes(RuleEnum.rules) ? RuleEnum.rules : null;
      if (field) {
        expandFields[field] = true;
      }
    });
    setExpanded(prev => ({ ...prev, ...expandFields }));
  }, [errors]);

  return (
    <>
      <div className={classes.container}>
        <Helmet title={t('services')} />
        <FlexContainer>
          <div>
            <Typography variant='h3' gutterBottom display='inline'>
              {t('Firewall')}
            </Typography>
            <Breadcrumbs aria-label='Breadcrumb' mt={2}>
              <Link component={NavLink} exact to='/settings' className={classes.breadcrumb}>
                {t('Settings')}
              </Link>
              <Link component={NavLink} exact to='/settings/system' className={classes.breadcrumb}>
                {t('system')}
              </Link>
              <Typography variant='body1' component='span' className={classes.breadcrumbCurr}>
                {t('Firewall')}
              </Typography>
            </Breadcrumbs>
          </div>
          <div style={{ position: 'relative' }}>
            <ButtonGreen
              variant='contained'
              disabled={reqState.load || reqState.save}
              onClick={handleSave}
              name='page-settings-system-firewall-save'
            >
              {t('save')}
            </ButtonGreen>
            {reqState.save ? <Loader size={20} /> : null}
          </div>
        </FlexContainer>

        <Grid container spacing={6} className={classes.gridContainer}>
          <Grid item xs={12} md={12} lg={12}>
            <Divider my={6} />
            <Paper className={classes.paperWithInnerPadding}>
              <Typography variant='h3' component='h3'>
                Firewall
              </Typography>
              <Accordion
                className={expanded.defaultRules ? '' : classes.accordion}
                expanded={expanded.defaultRules}
                onChange={() => setExpanded({ ...expanded, defaultRules: !expanded.defaultRules })}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={t('defaultRules')}
                  className={classes.accordionSumm}
                >
                  <Typography variant='h4' component='h4'>
                    {t('defaultRules')}
                  </Typography>
                  <ButtonGreen
                    style={{ padding: 6, minWidth: 30 }}
                    onClick={e => {
                      e.stopPropagation();
                      setExpanded({ ...expanded, defaultRules: true });
                      handleAddRule(RuleEnum.defaultRules);
                    }}
                    name='page-settings-system-firewall-add'
                  >
                    <Add />
                  </ButtonGreen>
                </AccordionSummary>
                <AccordionDetails style={{ display: 'block' }}>
                  {config?.defaultRules.map((rule, index) => {
                    return (
                      <DefaultInputs
                        key={index}
                        rule={rule}
                        index={index}
                        errors={errors}
                        onChange={handleChange}
                        onDeleteRule={() => handleDeleteRule(RuleEnum.defaultRules, index)}
                      />
                    );
                  })}
                </AccordionDetails>
              </Accordion>

              <Accordion
                className={expanded.rules ? '' : classes.accordion}
                expanded={expanded.rules}
                onChange={() => setExpanded({ ...expanded, rules: !expanded.rules })}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={t('Rules')}
                  className={classes.accordionSumm}
                >
                  <FlexContainer>
                    <Typography variant='h4' component='h4'>
                      {t('DockerRules')}
                    </Typography>
                    <ButtonGreen
                      style={{ padding: 6, minWidth: 30 }}
                      onClick={e => {
                        e.stopPropagation();
                        setExpanded({ ...expanded, rules: true });
                        handleAddRule(RuleEnum.rules);
                      }}
                      name='page-settings-system-firewall-docker-add'
                    >
                      <Add />
                    </ButtonGreen>
                  </FlexContainer>
                </AccordionSummary>
                <AccordionDetails style={{ display: 'block' }}>
                  {config?.rules.map((rule, index) => {
                    return (
                      <DockerRules
                        key={index}
                        rule={rule}
                        index={index}
                        errors={errors}
                        onChange={handleChange}
                        onDeleteRule={() => handleDeleteRule(RuleEnum.rules, index)}
                      />
                    );
                  })}
                </AccordionDetails>
              </Accordion>
              <BackdropLight open={reqState.load}>
                <Loader size={100} />
              </BackdropLight>
            </Paper>
          </Grid>
        </Grid>
        <Notification
          msg={snackbar.msg}
          alertType={snackbar.type}
          open={snackbar.isShow}
          onClose={() => setSnackbar(prev => ({ ...prev, msg: '', isShow: false }))}
        />
      </div>
    </>
  );
};

export default withTranslation('translations')(Firewall);
