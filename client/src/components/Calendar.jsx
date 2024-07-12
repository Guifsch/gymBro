import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { TextField } from "@mui/material";
import ImageWithPlaceholder from "../utils/imagePlaceHolderUntilLoad";
import axiosConfig from "../utils/axios";
import CardMedia from "@mui/material/CardMedia";
import { useDispatch } from "react-redux";
import {
  snackBarMessageSuccess,
  snackBarMessageError,
} from "../redux/snackbar/snackBarSlice";

import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  padding: "20px",
  transform: "translate(-50%, -50%)",
  borderRadius: "2%",
  overflow: "overlay",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  minWidth: "500px",
  maxWidth: "1000px",
  maxHeight: "800px",
};

const Calendar = ({ sets }) => {
  const calendarRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [externalEvents, setExternalEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggableShowContent, setDraggableShowContent] = useState(null);
  const [draggableShowContentBack, setDraggableShowContentBack] =
    useState(null);
  const [selectedEventBack, setSelectedEventBack] = useState(null);
  const [image, setImage] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const axiosInterceptor = axiosConfig();

  useEffect(() => {
    if (sets) {
      setExternalEvents(sets);
    }
  }, [sets]);

  const handleEventReceive = (info) => {
    const { start, extendedProps } = info.event;
    const newEvent = {
      id: uuidv4(),
      name: info.event.extendedProps.name,
      start,
      ...extendedProps,
    };

    setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = calendarEvents.map((event) =>
      event.id === info.event.id ? { ...event, start: info.event.start } : event
    );
    setCalendarEvents(updatedEvents);
  };

  const getCalendar = useCallback(async () => {
    try {
      const response = await axiosInterceptor.get(`/api/calendar/calendar`, {
        withCredentials: true,
      });
      const events = response.data[0].calendarItems.map((event) => ({
        ...event,
        id: event._id, // Ensure the ID is consistent
        start: new Date(event.start),
      }));
      setCalendarEvents(events);

      console.log(response, "responseresponseresponseresponseresponse");
    } catch (e) {
      console.log(e, "erro");
    }
  }, []);

  const handleSaveCalendar = async () => {
    let calendarItems = calendarEvents.map((event) => ({
      ...event,
      selectedItems: event.selectedItems.map((selected) => ({
        _id: selected._id,
      })),
    }));

    try {
      const response = await axiosInterceptor.post(
        `/api/calendar/calendar`,
        { calendarItems },
        { withCredentials: true }
      );

      console.log(response, "response");
      dispatch(snackBarMessageSuccess(response.data.message));
    } catch (e) {
      dispatch(snackBarMessageError(e.response.data.error));

      console.log(e, "erro");
    }
    getCalendar();
  };

  useEffect(() => {
    getCalendar();
  }, [getCalendar]);

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
    setSelectedEvent(info.event);
    setOpenModal(true);
  };

  const handleDraggableShowContent = (info) => {
    setDraggableShowContent(info);
    setDraggableShowContentBack(info);
    setOpenModal(true);
  };

  const handleDeleteEvent = () => {
    const updatedEvents = calendarEvents.filter(
      (event) => event.id !== selectedEvent.id
    );
    setCalendarEvents(updatedEvents);
    setSelectedEvent(null);
    setOpenModal(false);
  };

  const handleClose = () => {
    setImage(undefined);
    setOpenModal(false);
    setSelectedEventBack(null);
    setSelectedEvent(null);
    setDraggableShowContent(null);
    setDraggableShowContentBack(null);
  };

  const handleGoBack = () => {
    setImage(undefined);
    setSelectedEvent(selectedEventBack);
    setDraggableShowContent(draggableShowContentBack);
  };

  const handleSetImage = (e) => {
    setDraggableShowContent(null);
    setSelectedEventBack(selectedEvent);
    setSelectedEvent(null);
    setImage(e);
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
          paddingRight: "16px",
        }}
      >
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCalendar}
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
          sx={{ marginLeft: "20px", marginBottom: 0 }}
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
            <Box
              onClick={() => {
                handleDraggableShowContent(event);
              }}
              key={event._id}
              className="fc-event"
              data-event-id={event._id}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "bold"
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

      {/* Itens da esquerda do Draggable objects */}

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

          {draggableShowContent ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {image && (
                <>
                  <Button onClick={handleGoBack}>Voltar</Button>
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
              {draggableShowContent && (
                <>
                  <Typography variant="h4" gutterBottom sx={{paddingTop: '30px'}}>
                    <b>{draggableShowContent.name}</b>
                  </Typography>

                  {draggableShowContent.comment !== "" ? (
                    <TextField
                      id="comment"
                      label="Comentário"
                      multiline
                      type="comment"
                      value={draggableShowContent.comment}
                      maxRows={4}
                      sx={{
                        "& > div": { height: "100px" },
                        "& > label": { fontWeight: "bold", paddingX: "25px" },
                        width: "100%",
                        paddingX: "2%",
                      }}
                    />
                  ) : (
                    <div>teste</div>
                  )}

                  {/* Agrupe os itens por categoria */}
                  {Object.entries(
                    draggableShowContent.selectedItems.reduce((acc, item) => {
                      const category = item.category[0].name;
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(item);
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <Box key={category} sx={{ width: "100%", marginBottom: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          paddingX: "2%",
                          paddingTop: "2%",
                          fontWeight: "bold",
                        }}
                      >
                        {category}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {items.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              marginBottom: 2,
                              width: "33.3%",
                              paddingX: "2%",
                              paddingTop: "2%",
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "column",
                            }}
                          >
                            <TextField
                              value={item.name}
                              label="Exercício"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.rep}
                              label="Repetições"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.serie}
                              label="Serie"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.weight}
                              label="Peso"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />

                            {item.comment ? (
                              <TextField
                                value={item.comment}
                                label="Comentário"
                                autoComplete="on"
                                sx={{
                                  marginY: "3%",
                                  "& > label": { fontWeight: "bold" },
                                }}
                              />
                            ) : (
                              false
                            )}

                            {item.exercisePicture ? (
                              <Button
                                onClick={() => {
                                  handleSetImage(item.exercisePicture);
                                }}
                                variant="contained"
                              >
                                <b>Imagem</b>
                              </Button>
                            ) : (
                              false
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          ) : (
            // Itens do calendário
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {image && (
                <>
                  <Button onClick={handleGoBack}>Voltar</Button>

                  <ImageWithPlaceholder
                    src={image}
                    alt="Imagem do treino"
                    width="500px"
                    height="500px"
                  />
                </>
              )}
              {selectedEvent && (
                <>
                  <Typography variant="h4" gutterBottom sx={{paddingTop: '30px'}}>
                    <b>{selectedEvent.extendedProps.name}</b>
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeleteEvent}
                    sx={{ marginBottom: "20px" }}
                  >
                    Excluir Set
                  </Button>

                  {selectedEvent.extendedProps.comment !== "" ? (
                    <TextField
                      id="comment"
                      label="Comentário"
                      multiline
                      type="comment"
                      value={selectedEvent.extendedProps.comment}
                      maxRows={4}
                      sx={{
                        "& > div": { height: "100px" },
                        "& > label": { fontWeight: "bold", paddingX: "25px" },
                        width: "100%",
                        paddingX: "2%",
                      }}
                    />
                  ) : (
                    false
                  )}

                  {/* Agrupe os itens por categoria */}
                  {Object.entries(
                    selectedEvent.extendedProps.selectedItems.reduce(
                      (acc, item) => {
                        const category = item.category[0].name;
                        if (!acc[category]) {
                          acc[category] = [];
                        }
                        acc[category].push(item);
                        return acc;
                      },
                      {}
                    )
                  ).map(([category, items]) => (
                    <Box key={category} sx={{ width: "100%", marginBottom: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          paddingX: "2%",
                          paddingTop: "2%",
                          fontWeight: "bold",
                        }}
                      >
                        {category}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {items.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              marginBottom: 2,
                              width: "33.3%",
                              paddingX: "2%",
                              paddingTop: "2%",
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "column",
                            }}
                          >
                            <TextField
                              value={item.name}
                              label="Exercício"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.rep}
                              label="Repetições"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.serie}
                              label="Serie"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />
                            <TextField
                              value={item.weight}
                              label="Peso"
                              autoComplete="on"
                              sx={{
                                marginY: "3%",
                                "& > label": { fontWeight: "bold" },
                              }}
                            />

                            {item.comment ? (
                              <TextField
                                value={item.comment}
                                label="Comentário"
                                autoComplete="on"
                                sx={{
                                  marginY: "3%",
                                  "& > label": { fontWeight: "bold" },
                                }}
                              />
                            ) : (
                              false
                            )}

                            {item.exercisePicture ? (
                              <Button
                                onClick={() => {
                                  handleSetImage(item.exercisePicture);
                                }}
                                variant="contained"
                              >
                                <b>Imagem</b>
                              </Button>
                            ) : (
                              false
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}
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
