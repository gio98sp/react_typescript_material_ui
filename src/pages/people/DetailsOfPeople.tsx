import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ToolbarDetails } from '../../shared/components';
import { VTextField } from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePagina';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';

interface IFormData {
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}

export const DetailsOfPeople = () => {
  const { id = 'nova' } = useParams<'id'>();

  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      PessoasService.getById(Number(id)).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate('/pessoas');
        } else {
          setName(result.nomeCompleto);
          formRef.current?.setData(result);
        }
      });
    }
  }, [id]);

  const handleSave = (data: IFormData) => {
    setIsLoading(true);
    if (id === 'nova') {
      PessoasService.create(data).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          navigate(`/pessoas/detalhe/${result}`);
        }
      });
    } else {
      PessoasService.updateById(Number(id), { id: Number(id), ...data }).then(
        (result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          }
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente apagar?')) {
      PessoasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          navigate('/pessoas');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      title={id === 'nova' ? 'Nova Pessoa' : name}
      toolbar={
        <ToolbarDetails
          textNewButton="Nova"
          showSaveAndBackButton
          showDeleteButton={id !== 'nova'}
          showNewButton={id !== 'nova'}
          handleClickSaveButton={() => formRef.current?.submitForm()}
          handleClickSaveAndBackButton={() => formRef.current?.submitForm()}
          handleClickDeleteButton={() => handleDelete(Number(id))}
          handleClickNewButton={() => navigate('/pessoas/detalhe/nova')}
          handleClickBackButton={() => navigate('/pessoas')}
        />
      }
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Box
          margin={1}
          display={'flex'}
          flexDirection={'column'}
          component={Paper}
          variant="outlined"
        >
          <Grid container direction={'column'} padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Nome completo"
                  name="nomeCompleto"
                  disabled={isLoading}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Email"
                  name="email"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label="Cidade"
                  name="cidadeId"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </LayoutBaseDePagina>
  );
};
