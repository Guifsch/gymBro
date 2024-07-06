import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";


import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  padding: '20px',
  transform: "translate(-50%, -50%)",
  maxHeight: '800px',
  borderRadius: "2%",
overflow: "overlay",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const Calendar = ({ sets }) => {
  const calendarRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [externalEvents, setExternalEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [teste, setTest] = useState(null);
  const [image, setImage] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (sets) {
      setExternalEvents(sets);
    }
  }, [sets]);

  const handleEventReceive = (info) => {
    const { start, end, extendedProps } = info.event;
    const newEvent = {
      id: uuidv4(),
      name: info.event.extendedProps.name,
      start,
      end,
      ...extendedProps,
    };

    setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = calendarEvents.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.start, end: info.event.end }
        : event
    );
    setCalendarEvents(updatedEvents);
  };

  const handleEventResize = (info) => {
    const updatedEvents = calendarEvents.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.start, end: info.event.end }
        : event
    );
    setCalendarEvents(updatedEvents);
  };

  const handleSaveEvents = async () => {
    try {
      await axios.post("http://localhost:5000/events", calendarEvents);
      alert("Eventos salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar eventos:", error);
      alert("Erro ao salvar eventos.");
    }
  };

  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    if (draggableEl && externalEvents.length > 0) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => {
          const eventId = eventEl.getAttribute("data-event-id");
          const event = externalEvents.find((event) => event._id === eventId);
          return {
            id: event._id,
            name: event.name,
            extendedProps: event,
          };
        },
      });
    }
  }, [externalEvents]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(new Date(currentYear, currentMonth));
    }
  }, [currentMonth, currentYear]);

  const handleMonthChange = (event) => {
    setCurrentMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setCurrentYear(event.target.value);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    console.log(info, "selectedEvent")
    setOpenModal(true);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = calendarEvents.filter(
      (event) => event.id !== selectedEvent.id
    );
    setCalendarEvents(updatedEvents);
    setOpenModal(false);
  };

  const handleClose = () => {
    setImage(undefined)
    setOpenModal(false);
    setTest(null)
    setSelectedEvent(null); // Limpa o item selecionado ao fechar o modal
  };



  const handleGoBack = () => {
    setImage(undefined)

    setSelectedEvent(teste)
  };

const handleSetImage = (e) => {
  setTest(selectedEvent)
  setSelectedEvent(null)
   setImage(e)

 

  };
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const years = [];
  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 2, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          paddingRight: '16px',
        }}
      >
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEvents}
      
          >
            Salvar
          </Button>
        </Box>
        <FormControl
          variant="outlined"
          margin="normal"
          sx={{ marginLeft: "20px", marginBottom: 0 }}
        >
          <InputLabel>Mês</InputLabel>
          <Select value={currentMonth} onChange={handleMonthChange} label="Mês">
            {months.map((month, index) => (
              <MenuItem key={index} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          margin="normal"
          sx={{ marginLeft: "20px", marginBottom: 0  }}
        >
          <InputLabel>Ano</InputLabel>
          <Select value={currentYear} onChange={handleYearChange} label="Ano">
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          overflow: "overlay",
        }}
      >
        <Box
          id="external-events"
          sx={{ p: 2, bgcolor: "#f4f4f4", borderRadius: 2 }}
        >
          <Typography
            sx={{ display: "flex", justifyContent: "center" }}
            variant="h6"
            gutterBottom
          >
            Sets
          </Typography>
          {externalEvents.map((event) => (
            <Box key={event._id} className="fc-event" data-event-id={event._id}>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {event.name}
              </Typography>
              <Typography>{event.comment}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ flex: 1, ml: 2 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[ptBrLocale]}
            locale="pt-br"
            droppable={true}
            editable={true}
            events={calendarEvents}
            eventClick={handleEventClick}
            eventReceive={handleEventReceive}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={(arg) => (
              <Box>
                <Typography variant="body1" className="fc-event-title">
                  {arg.event.extendedProps.name}
                </Typography>
              </Box>
            )}
          />
        </Box>
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal} // Controla se o modal está aberto ou fechado
        onClose={handleClose} // Função para fechar o modal
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose} // Fecha o modal ao clicar no botão
            size="large"
            sx={{
              position: "absolute",
              top: "5px",
              right: "10px",
              zIndex: "999",
            }}
            aria-label="back"
            color="primary"
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
       {image && (
  <>
    <Button onClick={handleGoBack}>Teste</Button>
    <CardMedia
      component="img"
      sx={{
        objectFit: "contain",
        maxHeight: "500px",
        maxWidth: "500px",
        height: "100%",
        width: "100%",
      }}
      image={image}
    />
  </>
)}
{selectedEvent && (
  <>
    <Typography variant="body1" gutterBottom>
      ID: {selectedEvent.id}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Nome: {selectedEvent.name}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Comentário: {selectedEvent.comment}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Início: {selectedEvent.startStr}
    </Typography>
    {selectedEvent.selectedItems.map((item, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="body1" gutterBottom>
              Nome: {item.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Comentário: {item.comment}
            </Typography>
            <CardMedia
        
              component="img"
              sx={{
                objectFit: "contain",
                maxHeight: "50px",
                maxWidth: "50px",
                height: "100%",
                width: "100%",
              }}
              image={item.exercisePicture}
              onClick={() => {handleSetImage(item.exercisePicture)}}
            />
            {item.category && (
              <Typography variant="body1" gutterBottom>
                Categoria: {item.category[0].name}
              </Typography>
            )}
            {/* Renderize outros campos conforme necessário */}
          </Box>
        ))}
    <Button
      variant="contained"
      color="secondary"
      onClick={handleDeleteEvent}
    >
      Excluir Evento
    </Button>
  </>
)}
          </Box>
        </Box>
      </Modal>
      <Box mt={2}>
        <Typography variant="h6">Eventos no Calendário:</Typography>
        <pre>{JSON.stringify(calendarEvents, null, 2)}</pre>
      </Box>
    </Box>
  );
};

export default Calendar;