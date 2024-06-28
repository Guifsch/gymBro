import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  ListSubheader,
  Checkbox,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import axiosConfig from '../utils/axios';

// Estilo do modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

// Função para determinar o estilo de um item na lista com base na sua seleção
function getStyles(name, selectedItems, theme) {
  return {
    fontWeight: selectedItems.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    backgroundColor: selectedItems.indexOf(name) === -1 ? 'inherit' : theme.palette.action.selected,
  };
}

export default function ModalWorkoutSerie({ openSerieModal, handleCloseSerieModal }) {
  const theme = useTheme(); // Hook do tema do Material-UI para usar estilos do tema
  const [selectedItems, setSelectedItems] = useState([]); // Estado para armazenar os itens selecionados
  const [groupedWorkouts, setGroupedWorkouts] = useState({}); // Estado para armazenar os exercícios agrupados por categoria
  
  const axiosInterceptor = axiosConfig(); // Configuração do axios para fazer requisições

  // Função para buscar os exercícios da API e agrupar por categoria
  const getWorkout = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/workout/workouts`, {
        withCredentials: true,
      });
      const workouts = response.data.workouts;

      // Agrupando os exercícios por categoria
      const groupedByCategory = workouts.reduce((acc, workout) => {
        const categoryName = workout.category[0].name;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(workout);
        return acc;
      }, {});

      setGroupedWorkouts(groupedByCategory); // Atualiza o estado com os exercícios agrupados
      console.log(workouts, "workouts");
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  // useEffect para buscar os exercícios quando o componente é montado
  useEffect(() => {
    getWorkout();
  }, [getWorkout]);


  useEffect(() => {
    console.log(selectedItems, "selectedItems")
    }, [selectedItems]);


      // Função para lidar com o clique em um item da lista
      const handleItemClick = (id) => {
        setSelectedItems((prev) => {
          if (prev.includes(id)) {
            // Remove o item se ele já estiver selecionado
            return prev.filter((item) => item !== id);
          } else {
            // Adiciona o item se ele não estiver selecionado
            return [...prev, id];
          }
        });
      };

  const getWorkoutNameById = (id) => {
    for (const category of Object.values(groupedWorkouts)) {
      for (const workout of category) {
        if (workout._id === id) {
          return workout.name;
        }
      }
    }
    return '';
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openSerieModal} // Controla se o modal está aberto ou fechado
      onClose={handleCloseSerieModal} // Função para fechar o modal
    >
      <Box sx={style}>
        <IconButton
          onClick={handleCloseSerieModal} // Fecha o modal ao clicar no botão
          size="large"
          sx={{
            position: 'absolute',
            top: '5px',
            right: '10px',
            zIndex: '999',
          }}
          aria-label="back"
          color="primary"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '250px', marginTop: '3%' }}>
          <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="select-label">Workouts</InputLabel>
              <Select
                labelId="select-label" // ID do label para acessibilidade
                multiple
                value={selectedItems} // Itens selecionados
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => (
                      <Chip key={id} label={getWorkoutNameById(id)} /> // Renderiza chips para cada item selecionado
                    ))}
                  </Box>
                )}
              >
                {Object.keys(groupedWorkouts).map((category) => (
                  <div key={category}>
                    <ListSubheader>{category}</ListSubheader>
                    {groupedWorkouts[category].map((workout) => (
                      <MenuItem
                        key={workout._id}
                        value={workout._id}
                        style={getStyles(workout._id, selectedItems, theme)} // Define o estilo com base na seleção
                        onClick={() => handleItemClick(workout._id)} // Lida com o clique no item
                      >
                        <Checkbox
                          checked={selectedItems.indexOf(workout._id) > -1} // Marca o checkbox se o item estiver selecionado
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={workout.name} />
                      </MenuItem>
                    ))}
                  </div>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}