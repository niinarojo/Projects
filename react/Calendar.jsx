import {React} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import PropTypes from "prop-types";


function Calendar(props) {
  var appointmentInfo = props.eventsArr;

  var clickHandler = (e) => {
    const formattedAppointmentStartUTC = convertToFormattedUTC(e.event._instance.range.start);
    const formattedAppointmentEndUTC = convertToFormattedUTC(e.event._instance.range.end);
    var event = {
      id: e.event._def.publicId,
      appointmentTypeId: e.event._def.extendedProps.appointmentTypeId,
      clientId: e.event._def.extendedProps.clientId,
      locationId: e.event._def.extendedProps.locationId,
      notes: e.event._def.extendedProps.notes,
      appointmentStart: formattedAppointmentStartUTC,
      appointmentEnd: formattedAppointmentEndUTC,
      locationTypeId: e.event._def.extendedProps.locationTypeId,
      lineOne: e.event._def.extendedProps.lineOne,
      lineTwo: e.event._def.extendedProps.lineTwo,
      city: e.event._def.extendedProps.city,
      zip: e.event._def.extendedProps.zip,
      stateId: e.event._def.extendedProps.stateId,
      latitude: e.event._def.extendedProps.latitude,
      longitude: e.event._def.extendedProps.latitude,
      isConfirmed: e.event._def.extendedProps.isConfirmed,
    };
    props.handleEventClick(event);
  };

  const convertToFormattedUTC = (localDate) => {
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      }}
      initialView="dayGridMonth"
      editable={true}
      selectable={false}
      selectMirror={false}
      dayMaxEvents={true}
      events={appointmentInfo}
      eventBackgroundColor="#fcc534"
      eventClick={clickHandler}
    />
  );
}

Calendar.propTypes = {
  eventsArr: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      appointmentTypeId: PropTypes.number.isRequired,
      appointmentTypeName: PropTypes.string,
      clientId: PropTypes.number.isRequired,
      locationId: PropTypes.number,
      locationTypeId: PropTypes.number,
      title: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
      notes: PropTypes.string,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string,
      stateName: PropTypes.string,
      stateId: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      isConfirmed: PropTypes.bool,
    })
  ).isRequired,
  handleEventClick: PropTypes.func,
};

export default Calendar;
