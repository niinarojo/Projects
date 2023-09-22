import React, {useEffect, useState} from "react";
import {Formik, Field, Form, ErrorMessage} from "formik";
import lookUpService from "services/lookUpService";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import appointmentSchema from "schemas/appointmentSchema";
import appointmentService from "services/appointmentService";
import clientService from "services/clientService";
import PropTypes from "prop-types";
import toastr from "toastr";

function AppointmentForm(props) {
  const [formData, setFormData] = useState({
    id: null,
    appointmentTypeId: "",
    clientId: "",
    locationId: null,
    notes: null,
    appointmentStart: new Date(),
    appointmentEnd: new Date(),
    location: {
      locationTypeId: null,
      lineOne: null,
      lineTwo: null,
      city: null,
      zip: null,
      stateId: null,
      latitude: 1,
      longitude: 1,
    },

    isConfirmed: false,
  });

  const [lookUps, setLookUps] = useState({
    appointmentTypes: [],
    mappedAppointmentTypes: [],
    states: [],
    mappedStates: [],
    locationTypes: [],
    mappedLocationTypes: [],
  });

  // default formtype is addForm. true === updateFrom
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [clients, setClients] = useState({
    clients: [],
    mappedClients: [],
  });

  const [showLocationFields, setShowLocationFields] = useState(false);

  useEffect(() => {
    handleShowLocation(props?.appointmentData?.appointmentTypeId);
    setShowUpdateForm(props.isUpdateForm);
    lookUpService
      .lookUp(["AppointmentTypes", "States", "LocationTypes"])
      .then(lookUpSuccess)
      .catch(lookUpError);
    clientService.getByUserId(0, 1000).then(onClientsuccess).catch(onClientError);

    if (showUpdateForm) {
      setFormData((prevState) => {
        let clone = {...prevState};
        _logger("setFormData clone", clone);
        clone.id = props?.appointmentData?.id;
        clone.appointmentTypeId = props?.appointmentData?.appointmentTypeId;
        clone.clientId = props?.appointmentData?.clientId;
        clone.locationId = props?.appointmentData?.locationId;
        clone.notes = props?.appointmentData?.notes;
        clone.appointmentStart = props.appointmentData.appointmentStart;
        clone.appointmentEnd = props.appointmentData.appointmentEnd;
        clone.location.locationTypeId = props?.appointmentData?.locationTypeId;
        clone.location.lineOne = props?.appointmentData?.lineOne;
        clone.location.lineTwo = props?.appointmentData?.lineTwo;
        clone.location.city = props?.appointmentData?.city;
        clone.location.zip = props?.appointmentData?.zip;
        clone.location.stateId = props?.appointmentData?.stateId;
        clone.location.latitude = props?.appointmentData?.latitude;
        clone.location.longitude = props?.appointmentData?.longitude;
        clone.isConfirmed = props?.appointmentData?.isConfirmed;
        return clone;
      });
    }
  }, [showUpdateForm]);

  const lookUpSuccess = (response) => {
    const {appointmentTypes, states, locationTypes} = response.item;
    setLookUps((prevState) => {
      let type = {...prevState};
      type.appointmentTypes = appointmentTypes;
      type.mappedAppointmentTypes = appointmentTypes.map(mapAppointmentTypes);
      type.states = states;
      type.mappedStates = states.map(mapStates);
      type.locationTypes = locationTypes;
      type.mappedLocationTypes = locationTypes.map(mapLocationTypes);
      return type;
    });
  };

  const onClientsuccess = (response) => {
    setClients((prevState) => {
      let clone = {...prevState};
      clone.clients = response.item.pagedItems;
      clone.mappedClients = response.item.pagedItems.map(mapClients);
      return clone;
    });
  };

  const onClientError = (err) => {
    _logger("client error", err);
  };

  const lookUpError = (error) => {
    _logger(error);
  };

  const mapClients = (client) => {
    return (
      <option value={client.id} key={`client${client.id}`}>
        {`${client.firstName} ${client.lastName}`}
      </option>
    );
  };
  const mapAppointmentTypes = (appointmentType) => {
    return (
      <option value={appointmentType.id} key={`appointmentType_${appointmentType.id}`}>
        {appointmentType.name}
      </option>
    );
  };

  const mapStates = (state) => {
    return (
      <option value={state.id} key={`state_${state.id}`}>
        {state.name}
      </option>
    );
  };

  const mapLocationTypes = (locationType) => {
    return (
      <option value={locationType.id} key={`locationType_${locationType.id}`}>
        {locationType.name}
      </option>
    );
  };

  const handleSubmit = (values) => {
    _logger("handle submit values", values);
    // add service
    if (!showUpdateForm) {
      const cloneValues = {...values};
      var payload = {};
      payload.appointmentTypeId = cloneValues.appointmentTypeId;
      payload.ClientId = cloneValues.clientId;
      payload.notes = cloneValues.notes;
      payload.appointmentStart = cloneValues.appointmentStart[0];
      payload.appointmentEnd = cloneValues.appointmentEnd[0];
      if (showLocationFields) {
        payload.location = {
          locationTypeId: cloneValues.location.locationTypeId,
          lineOne: cloneValues.location.lineOne,
          lineTwo: cloneValues.location.lineTwo,
          city: cloneValues.location.city,
          zip: cloneValues.location.zip,
          stateId: cloneValues.location.stateId,
          latitude: cloneValues.location.latitude,
          longitude: cloneValues.location.longitude,
        };
      }

      appointmentService
        .addAppointment(payload)
        .then(onAddAppointmentSuccess)
        .catch(onAddAppointmentError);
    }
    // update service
    else {
      const startTime = values.appointmentStart;
      var isoStartDate = new Date(startTime).toISOString();
      const endTime = values.appointmentEnd;
      var isoEndDate = new Date(endTime).toISOString();
      const clone = {...values};
      var appointmentId = clone.id;
      var updatePayload = {};
      updatePayload.appointmentTypeId = clone.appointmentTypeId;
      updatePayload.ClientId = clone.clientId;
      updatePayload.notes = clone.notes;
      updatePayload.locationId = clone.locationId;
      updatePayload.isConfirmed = clone.isConfirmed;
      updatePayload.appointmentStart = isoStartDate;
      updatePayload.appointmentEnd = isoEndDate;
      if (showLocationFields) {
        updatePayload.location = {
          locationTypeId: clone.location.locationTypeId,
          lineOne: clone.location.lineOne,
          lineTwo: clone.location.lineTwo,
          city: clone.location.city,
          zip: clone.location.zip,
          stateId: clone.location.stateId,
          latitude: clone.location.latitude,
          longitude: clone.location.longitude,
        };
      }
      appointmentService
        .updateAppointment(updatePayload, appointmentId)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    }
  };

  const onDeleteClicked = (e) => {
    const appointmentId = e.id;
    appointmentService
      .removeAppointment(appointmentId, appointmentId)
      .then(onDeleteSuccess)
      .catch(onDeleteError);
  };

  const onAddAppointmentSuccess = (response) => {
    _logger("add appointment Success", response);
    toastr.success("New appointment added");
    props.reRenderCal();
    props.closeForm();
  };

  const onUpdateSuccess = (response) => {
    _logger("update success", response);
    toastr.success("Appointment updated");
    props.reRenderCal();
    props.closeForm();
  };

  const onDeleteSuccess = (response) => {
    _logger("delete success", response);
    toastr.success("Appointment deleted");
    props.reRenderCal();
    props.closeForm();
  };

  const onAddAppointmentError = (err) => {
    _logger("add appointment error", err);
    toastr.error("Make sure all you have filled in the form with correct information.");
  };

  const onUpdateError = (err) => {
    _logger("update error", err);
  };

  const onDeleteError = (err) => {
    _logger("onDeleteError", err);
  };

  const handleShowLocation = (value) => {
    value === "1" || value === 1 ? setShowLocationFields(true) : setShowLocationFields(false);
  };

  return (
    <React.Fragment>
      <div className="container">
        <Formik
          enableReinitialize={true}
          initialValues={formData}
          validationSchema={appointmentSchema}
          onSubmit={handleSubmit}>
          {({values, setFieldValue}) => (
            <Form>
              <div className="form-group">
                <label htmlFor="notes" className="mb-1">
                  Client
                </label>
                <Field component="select" name="clientId" className="form-control">
                  <option value="">Please select client</option>
                  {clients.mappedClients}
                </Field>
                <ErrorMessage name="clientId" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label htmlFor="appointmentType" className="mb-1">
                  Appointment Type
                </label>
                <Field
                  onChange={(e) => {
                    handleShowLocation(e.target.value);
                    setFieldValue("appointmentTypeId", e.target.value);
                  }}
                  component="select"
                  name="appointmentTypeId"
                  className="form-control mb-3">
                  <option value="">Please select appointment type</option>
                  {lookUps.mappedAppointmentTypes}
                </Field>
                <ErrorMessage name="appointmentTypeId" component="div" className="text-danger" />
              </div>
              {showLocationFields && (
                <div>
                  <div className="form-group mt-2">
                    <label htmlFor="location.locationTypeId">Address Type</label>
                    <Field
                      component="select"
                      name="location.locationTypeId"
                      className="form-control">
                      <option value="">Please select address type</option>
                      {lookUps.mappedLocationTypes}
                    </Field>
                    <ErrorMessage
                      name="location.locationTypeId"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location.lineOne">Address</label>
                    <Field type="text" name="location.lineOne" className="form-control" />
                    <ErrorMessage name="location.lineOne" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location.lineTwo"></label>
                    <Field type="text" name="location.lineTwo" className="form-control" />
                    <ErrorMessage name="location.lineTwo" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location.city">City</label>
                    <Field type="text" name="location.city" className="form-control" />
                    <ErrorMessage name="location.city" component="div" className="text-danger" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location.stateId">State</label>
                    <Field component="select" name="location.stateId" className="form-control">
                      <option value="0">State</option>
                      {lookUps.mappedStates}
                    </Field>
                    <ErrorMessage name="location.stateId" component="div" className="text-danger" />
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor="location.zip">Zip Code</label>
                    <Field type="text" name="location.zip" className="form-control" />
                    <ErrorMessage name="location.zip" component="div" className="text-danger" />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="appointmentStart" className="mt-3">
                  Start
                </label>
                <Flatpickr
                  className="form-control"
                  data-enable-time
                  value={new Date(values.appointmentStart)}
                  data-utc
                  onChange={(date) => setFieldValue("appointmentStart", date)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="appointmentEnd">End</label>
                <Flatpickr
                  className="form-control"
                  data-enable-time
                  data-utc
                  value={new Date(values.appointmentEnd)}
                  onChange={(date) => setFieldValue("appointmentEnd", date)}
                />
              </div>
              {showUpdateForm && (
                <div className="form-check">
                  <Field type="checkbox" name="isConfirmed" className="form-check-input" />
                  <label htmlFor="isConfirmed" className="form-check-label">
                    Is confirmed
                  </label>
                </div>
              )}
              <div className="form-group mb-3">
                <label htmlFor="notes" className="mt-3 mb-1">
                  Notes
                </label>
                <Field component="textarea" name="notes" className="form-control"></Field>
              </div>
              <button type="submit" className="btn btn-primary btn-sm mt-1">
                {showUpdateForm ? "Update" : "Submit"}
              </button>
              {showUpdateForm && (
                <button
                  type="button"
                  className="btn btn-warning btn-sm mt-1 float-end"
                  onClick={() => {
                    onDeleteClicked(values);
                  }}
                  name="delete">
                  Delete
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
}

AppointmentForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  appointmentData: PropTypes.shape({
    id: PropTypes.string,
    appointmentTypeId: PropTypes.string,
    clientId: PropTypes.string,
    locationId: PropTypes.string,
    notes: PropTypes.string,
    appointmentStart: PropTypes.string,
    appointmentEnd: PropTypes.string,
    locationTypeId: PropTypes.string,
    lineOne: PropTypes.string,
    lineTwo: PropTypes.string,
    city: PropTypes.string,
    zip: PropTypes.string,
    stateId: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    isConfirmed: PropTypes.bool,
  }),
  reRenderCal: PropTypes.func,
  closeForm: PropTypes.func,
};

export default AppointmentForm;
