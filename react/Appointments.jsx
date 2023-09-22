import {React, useEffect, useState} from "react";
import Calendar from "./Calendar";
import appointmentService from "services/appointmentService";
import Offcanvas from "react-bootstrap/Offcanvas";
import AppointmentForm from "./AppointmentForm";
import {Card} from "react-bootstrap";

function Appointments() {
  const [appointments, setAppointments] = useState({
    appointmentsArray: [],
    mappedAppointments: [],
  });
  const [showForm, setShowForm] = useState(false);

  const [isUpdateForm, setIsUpdateForm] = useState(false);

  const [clickedEventItem, setClickedEventItem] = useState({
    id: null,
    appointmentTypeId: null,
    clientId: null,
    locationId: null,
    notes: "",
    appointmentStart: "",
    appointmentEnd: "",
    locationTypeId: null,
    lineOne: "",
    lineTwo: "",
    city: "",
    zip: "",
    stateId: null,
    latitude: null,
    longitude: null,
    isConfirmed: false,
  });

  _logger(clickedEventItem);

  const addFormHandeler = () => {
    setShowForm(true);
    setIsUpdateForm(false);
  };

  const updateFormHandeler = () => {
    setShowForm(true);
    setIsUpdateForm(true);
  };

  const hideFunction = () => {
    setShowForm(false);
    setIsUpdateForm(false);
  };

  const getCurrentCalender = () => {
    appointmentService.getByUserId(0, 1000).then(onGetByUserIdSuccess).catch(onGetByUserIdError);
  };

  useEffect(() => {
    getCurrentCalender();
  }, []);

  const onGetByUserIdSuccess = (response) => {
    let appointmentsArr = response.item.pagedItems;
    setAppointments((prevState) => {
      const clone = {...prevState};
      clone.appointmentsArray = appointmentsArr;
      clone.mappedAppointments = appointmentsArr.map(mapAppointment);
      return clone;
    });
  };

  const eventColor = (appointmentTypeId) => {
    var color = "";
    switch (appointmentTypeId) {
      case 1:
        color = "#ff8c00";
        break;
      case 2:
        color = "#B42A0D";
        break;
      case 3:
        color = "#3866C8";
        break;
      case 4:
        color = "#516742";
        break;
      default:
        color = "#fcc534";
    }
    return color;
  };

  const mapAppointment = (item) => {
    var newItem = {
      id: item.id,
      appointmentTypeId: item.appointmentType.id,
      appointmentTypeName: item.appointmentType.name,
      clientId: item.client.id,
      locationId: item.location.id,
      locationTypeId: item.location.locationType.id,
      title: item.client.firstName + " " + item.client.lastName,
      start: item.appointmentStart + "Z",
      end: item.appointmentEnd + "Z",
      notes: item.notes,
      lineOne: item.location.lineOne,
      lineTwo: item.location.lineTwo,
      city: item.location.city,
      zip: item.location.zip,
      stateName: item.location.state.name,
      stateId: item.location.state.id,
      latitude: item.location.latitude,
      longitude: item.location.longitude,
      isConfirmed: item.isConfirmed,
      color: eventColor(item.appointmentType.id),
    };
    return newItem;
  };

  const onGetByUserIdError = (err) => {
    _logger("error", err);
  };

  var appointmentClickHandler = (e) => {
    setClickedEventItem((prevState) => {
      const clone = {...prevState};
      clone.id = e.id.toString();
      clone.appointmentTypeId = e.appointmentTypeId.toString();
      clone.clientId = e.clientId.toString();
      clone.locationId = e.locationId.toString();
      clone.notes = e.notes;
      clone.appointmentStart = e.appointmentStart.toString();
      clone.appointmentEnd = e.appointmentEnd.toString();
      clone.locationTypeId = e.locationTypeId.toString();
      clone.lineOne = e.lineOne;
      clone.lineTwo = e.lineTwo;
      clone.city = e.city;
      clone.zip = e.zip;
      clone.stateId = e.stateId.toString();
      clone.latitude = e.latitude.toString();
      clone.longitude = e.longitude.toString();
      clone.isConfirmed = e.isConfirmed;
      _logger("click", clone);
      return clone;
    });
    updateFormHandeler();
  };

  return (
    <div>
      <h1 className="mb-1 h2 fw-bold mb-4">Appointments</h1>
      <div className="d-flex justify-content-end">
        <button
          name="addButton"
          type="button"
          className="btn btn-primary btn-sm mb-2"
          onClick={addFormHandeler}>
          New Appointment
        </button>
      </div>
      <Card className="bg-white p-3">
        <Calendar
          handleEventClick={appointmentClickHandler}
          eventsArr={appointments.mappedAppointments}
        />
      </Card>
      <Offcanvas show={showForm} onHide={hideFunction}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {isUpdateForm ? "Update Appointment" : "Add Appointment"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isUpdateForm ? (
            <AppointmentForm
              reRenderCal={getCurrentCalender}
              closeForm={hideFunction}
              isUpdateForm={true}
              appointmentData={clickedEventItem}
            />
          ) : (
            <AppointmentForm
              reRenderCal={getCurrentCalender}
              closeForm={hideFunction}
              isUpdateForm={false}
            />
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
export default Appointments;
