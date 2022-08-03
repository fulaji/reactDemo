import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Card } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { useRouteMatch } from "react-router";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Dropdown } from "react-bootstrap";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";

//redux
import { connect } from "react-redux";
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../../../stores/properties/actions";
import { fetchAllUsers } from "../../../../stores/users/actions";
import Swal from "sweetalert2";
const EventCalendar = (props) => {
  const history = useHistory();
  const match = useRouteMatch();
  const calendarComponentRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [state, setState] = useState({
    calendarEvents: [],
    events: [
      { title: "Event 1", id: "1" },
      { title: "Event 2", id: "2" },
      { title: "Event 3", id: "3" },
      { title: "Event 4", id: "4" },
      { title: "Event 5", id: "5" },
    ],
    note: "",
    selectedDate: "",
    appointmentTime: new Date(),
    assignedTo: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState({});
  /**
   * adding dragable properties to external events through javascript
   */
  // componentDidMount() {
  //    let draggableEl = document.getElementById("external-events");
  //    new Draggable(draggableEl, {
  //       itemSelector: ".fc-event",
  //       eventData: function (eventEl) {
  //          let title = eventEl.getAttribute("title");
  //          let id = eventEl.getAttribute("data");
  //          return {
  //             title: title,
  //             id: id,
  //          };
  //       },
  //    });
  // }

  /**
   * when we click on event we are displaying event details
   */
  const eventClick = (eventClick) => {
    let appointmentId = eventClick.event.id;
    let appointmentTemp = props.appointments.filter(
      (appoint) => appoint.id === appointmentId
    );
    if (appointmentTemp.length > 0) {
      setSelectedAppointment(appointmentTemp[0]);
      setShowViewModal(true);
    } else {
      Swal.fire("Invalid event", "", "warning");
    }
  };

  const dateClick = (eventClick) => {
    setShowModal(true);
    setState({ ...state, selectedDate: eventClick.dateStr });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setBtnLoading(true);
      let formData = new FormData();
      formData.append("note", state.note);
      formData.append("appointment_date", state.selectedDate);
      formData.append(
        "appointment_time",
        moment(state.appointmentTime).format("HH:mm:ss")
      );
      formData.append("team_member", state.assignedTo);
      if (match?.params?.id !== "all") {
        formData.append("property_id", match?.params?.id);
      }
      if (selectedAppointment?.id) {
        formData.append("id", selectedAppointment.id);
        await props.updateAppointment(formData, match?.params?.id);
      } else {
        await props.createAppointment(formData, match?.params?.id);
      }
      Alert.fire(
        `Appointment ${
          selectedAppointment?.id ? "updated" : "created"
        } successfully`,
        "",
        "success"
      ).then(() => {
        setShowModal(false);
        setSelectedAppointment({});
        history.goBack();
      });
    } catch (err) {
    } finally {
      setBtnLoading(false);
    }
  };
  const handleRemoveAppointment = async () => {
    Swal.fire({
      title: "Do you want to delete this appointment?",
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await props.deleteAppointment(selectedAppointment.id);
          Swal.fire("Appointment Deleted Successfully!", "", "success").then(
            () => {
              setShowModal(false);
              setSelectedAppointment({});
            }
          );
        } catch {
          Swal.fire("Something went wrong!", "", "error");
        }
      }
    });
  };
  useEffect(() => {
    if (match?.params?.id) {
      props.fetchAppointments({ property_id: match?.params?.id });
    }
  }, [match?.params]);
  useEffect(() => {
    let eventsTemp = [];
    props.appointments.map((appointment) => {
      let dateArr = appointment.appointment_date.split("-");
      let timeArr = appointment.appointment_time.split(":");
      eventsTemp.push({
        title: appointment.note.substring(0, 10),
        start: new Date(
          dateArr[0],
          dateArr[1] - 1,
          dateArr[2],
          timeArr[0],
          timeArr[1],
          timeArr[2]
        ),
        id: appointment.id,
      });
    });
    setState({
      ...state,
      calendarEvents: eventsTemp,
    });
  }, [props.appointments]);
  useEffect(() => {
    if (selectedAppointment?.id) {
      setState({
        ...state,
        note: selectedAppointment.note,
        selectedDate: selectedAppointment.appointment_date,
        appointmentTime: moment(
          selectedAppointment.appointment_time,
          "HH:mm:ss"
        ).toDate(),
        assignedTo: String(selectedAppointment.team_member),
      });
    } else {
      setState({
        ...state,
        note: "",
        selectedDate: "",
        assignedTo: "",
        appointmentTime: new Date(),
      });
    }
  }, [selectedAppointment]);
  useEffect(() => {
    props.fetchAllUsers();
  }, []);
  return (
    <div className="animated fadeIn demo-app">
      <Row>
        {/* <Col lg={3}>
                  <Card>
                     <div class="card-header border-0 pb-0">
                        <h4 class="text-black fs-20 mb-0">Events</h4>
                     </div>
                     <Card.Body>
                        <div id="external-events">
                           {this.state.events.map((event) => (
                              <div
                                 className="fc-event mt-0 ml-0 mb-2 btn btn-block btn-primary"
                                 title={event.title}
                                 data={event.id}
                                 key={event.id}
                              >
                                 {event.title}
                              </div>
                           ))}
                        </div>
                     </Card.Body>
                  </Card>
               </Col> */}

        <Col lg={12}>
          <Card>
            <Card.Body>
              <div className="demo-app-calendar" id="mycalendartest">
                <FullCalendar
                  defaultView="dayGridMonth"
                  header={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                  }}
                  // displayEventTime={false}
                  rerenderDelay={10}
                  eventDurationEditable={false}
                  editable={true}
                  droppable={true}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  ref={calendarComponentRef}
                  weekends={state.calendarWeekends}
                  events={state.calendarEvents}
                  // drop={this.drop}
                  eventClick={eventClick}
                  dateClick={(value) => {
                    dateClick(value);
                  }}
                  // selectable={true}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal className="modal fade" show={showModal} centered {...props}>
        <form onSubmit={handleSubmit}>
          <div className="modal-content" style={{ minWidth: "50vw" }}>
            <div className="modal-header">
              <h5 className="modal-title">
                {typeof selectedAppointment?.id === "string"
                  ? "Edit Event"
                  : "Add New Event"}
              </h5>
              <Button
                variant=""
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setSelectedAppointment({});
                  setShowModal(false);
                }}
              >
                <span>×</span>
              </Button>
            </div>
            <Modal.Body>
              <div className="card">
                <div className="card-body">
                  <div className="basic-form">
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label>Appointment Time</label>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <TimePicker
                            autoOk
                            label=""
                            value={state.appointmentTime}
                            onChange={(value) => {
                              setState({
                                ...state,
                                appointmentTime: value,
                              });
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                      <div className="form-group col-md-12">
                        <label>Assigned to</label>
                        <select
                          className="form-control input-default"
                          onChange={(e) =>
                            setState({ ...state, assignedTo: e.target.value })
                          }
                          value={state.assignedTo}
                        >
                          <option value="">Select user</option>
                          {props.users.map((user, i) => (
                            <option value={user.id} key={i}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-12">
                        <label>Property Notes</label>
                        <textarea
                          required
                          cols="30"
                          rows="10"
                          className="form-control input-default"
                          onChange={(e) =>
                            setState({
                              ...state,
                              note: e.target.value,
                            })
                          }
                          value={state.note}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {typeof selectedAppointment?.id === "string" && (
                <Button
                  variant="danger"
                  type="button"
                  disabled={btnLoading}
                  onClick={() => handleRemoveAppointment()}
                >
                  Remove Event
                </Button>
              )}
              <Button variant="primary" type="submit" disabled={btnLoading}>
                {typeof selectedAppointment?.id === "string"
                  ? "Update"
                  : "Submit"}
              </Button>
            </Modal.Footer>
          </div>
        </form>
      </Modal>

      <Modal className="modal fade" show={showViewModal} centered {...props}>
        <form onSubmit={handleSubmit}>
          <div className="modal-content" style={{ minWidth: "50vw" }}>
            <div className="modal-header">
              <h5 className="modal-title">Appointment Details</h5>
              <Button
                variant=""
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setSelectedAppointment({});
                  setShowViewModal(false);
                }}
              >
                <span>×</span>
              </Button>
            </div>
            <Modal.Body>
              <div className="card">
                <div className="card-body">
                  <div className="basic-form">
                    <div className="form-row">
                      {selectedAppointment.owner_first_name?.length > 0 && (
                        <div className="form-group col-md-12">
                          <strong>Owner</strong>
                          <p>{`${selectedAppointment.owner_first_name} ${selectedAppointment.owner_last_name}`}</p>
                        </div>
                      )}
                      <div className="form-group col-md-12">
                        <strong>Appointment Date</strong>
                        <p>{selectedAppointment.appointment_date}</p>
                      </div>
                      <div className="form-group col-md-12">
                        <strong>Appointment Time</strong>
                        <p>{selectedAppointment.appointment_time}</p>
                      </div>
                      <div className="form-group col-md-12">
                        <strong>Property Notes</strong>
                        <p>{selectedAppointment.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setShowModal(true);
                }}
              >
                Edit Property
              </Button>
              <Link to={`/property-details/${selectedAppointment.property_id}`}>
                <Button variant="info" type="button">
                  View Property
                </Button>
              </Link>
              {/* <Button
                        variant="success"
                        type="button"
                     >
                        Call Owner
                     </Button> */}
              <Dropdown className="input-group-prepend">
                <Dropdown.Toggle
                  variant=""
                  className="btn btn-success"
                  type="button"
                  data-toggle="dropdown"
                >
                  Call Owner
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu">
                  {selectedAppointment?.contact_no
                    ?.split(", ")
                    .map((num, i) => (
                      <Dropdown.Item
                        className="dropdown-item"
                        to="#"
                        onClick={() => {
                           window.open(`tel:${num}`, '_self')
                        }}
                        key={i}
                      >
                        {num}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Footer>
          </div>
        </form>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  appointments: state.properties.appointments,
  users: state.users.allUsers,
});
const mapDispatchToProps = {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchAllUsers,
};
export default connect(mapStateToProps, mapDispatchToProps)(EventCalendar);
