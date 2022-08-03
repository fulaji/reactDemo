import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//** Import Image */
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import Select from "react-select";
import avatar1 from "../../../images/avatar/1.jpg";
import map from "../../../images/map.jpg";
import customers10 from "../../../images/customers/10.jpg";
import customers11 from "../../../images/customers/11.jpg";
import customers12 from "../../../images/customers/12.jpg";
import FrontViewSlider from "../Omah/PropertyDetails/FrontViewSlider";
import ImageGallery from "../Omah/PropertyDetails/ImageGallery";
import { GOOGLE_KEY } from "../../../config/index";
import EditProperty from "./EditProperty";
import ActivityLogModal from "./ActivityLogModal";
import Swal from "sweetalert2";
import SingleMessageModel from "./SingleMessageModel";
import MakeCall from "./MakeCall"
import Category from "../category/Category";
//redux
import { connect } from "react-redux";
import {
  fetchPropertyDetails,
  updateProperty,
  fetchActivities,
  deleteActivity,
  createActivity,
  fetchOneActivities,
  getNumberProperty
} from "../../../stores/properties/actions";
import moment from "moment";

function PropertyDetails(props) {
  const [showSendMessageModel, setShowSendMessageModel] = useState(false);
  const [showMakeCall, setShowMakeCall] = useState(false);
  const [makeCallNumber, setMakeCallNumber] = useState('');
  const [callStatus, setCallStatus] = useState(false)
  const [loading, setLoading] = useState(false);
  const [editPropertyVisible, setEditPropertyVisible] = useState(false);
  const [activityLogVisible, setActivityLogVisible] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState({});
  const options = [
    { value: "prospect", label: "Prospect" },
    { value: "contractSent", label: "Contract Sent" },
    { value: "offerMade", label: "Offer Made" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed", label: "Closed" },
    { value: "followUp", label: "Follow-up" },
    { value: "doNotContact", label: "Do Not Contact" },
  ];

  const formatForecastingStage = (stage) => {
    switch (stage) {
      case "prospect":
        return "Prospect";
      case "contractSent":
        return "Contract Sent";
      case "offerMade":
        return "Offer Made";
      case "negotiation":
        return "Negotiation";
      case "closed":
        return "Closed";
      case "followUp":
        return "Follow-up";
      case "doNotContact":
        return "Do Not Contact";
      default:
        return stage;
    }
  };
  const handleFetchProperty = async (id) => {
    try {
      setLoading(true);
      await props.fetchPropertyDetails(id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const getPropertyImage = () => {
    return `https://maps.googleapis.com/maps/api/streetview?size=1080x400&location=${props.property?.address} ${props.property?.city} ${props.property?.state} ${props.property?.zip}&key=${GOOGLE_KEY}`;
  };
  const getPropertyStaticMap = () => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${props.property?.address} ${props.property?.city} ${props.property?.state} ${props.property?.zip}&markers=color:red%7Clabel:%7C${props.property?.address} ${props.property?.city} ${props.property?.state} ${props.property?.zip}&zoom=17&size=600x400&key=${GOOGLE_KEY}&map_id=80807fa7334920b9`;
  };
  const renderContacts = () => {
    let contactsArr = props.property?.contact_no?.split(", ");
    let jsx = [];
    if (Array.isArray(contactsArr)) {
      contactsArr.map(contact => {
        jsx.push(
          <a
            href="javascript:void(0)"
            onClick={() => makeCall(contact)}
            className="btn btn-outline-primary d-block rounded mb-2"
          >
            <i className="las la-phone scale5 mr-2" />
            {contact}
          </a>
        )
      })
      return jsx;
    }
  }
  // const renderContacts = () => {
  //   let contactsArr = props.property?.contact_no?.split(", ");
  //   let jsx = [];
  //   if (Array.isArray(contactsArr)) {
  //     contactsArr.map((contact) => {
  //       jsx.push(
  //         <a
  //           href={`tel:${contact}`}
  //           className="btn btn-outline-primary d-block rounded mb-2"
  //         >
  //           <i className="las la-phone scale5 mr-2" />
  //           {contact}
  //         </a>
  //       );
  //     });
  //     return jsx;
  //   }
  // };
  const onHideCall = () => {
    console.log('hide call')
    console.log(props.property.id);
    handleFetchProperty(props.property.id)
    setCallStatus(false);
    setShowMakeCall(false)
  }
  const makeCall = (number) =>{
    setMakeCallNumber(number);
    setCallStatus(true);
    setShowMakeCall(true);
  }
  const onHideMessage = () => {
    setShowSendMessageModel(false)
    handleFetchProperty(props.property.id)
  }
  const handleChangeForecastingStage = async (value) => {
    setSelectedOption(value);
    let formData = new FormData();
    for (let key in props.property) {
      if (key === "forecasting_stage") {
        formData.append("forecasting_stage", value.value);
      } else {
        formData.append(key, props.property[key]);
      }
    }
    let oldFCStage = props.property.forecasting_stage;
    await props.updateProperty(formData, {
      ...props.property,
      forecasting_stage: value,
    });
    Swal.fire("Forecasting stage changed successfully!", "", "success").then(()=>{
      let formData = new FormData();
      formData.append("property_id", props.property.id);
      formData.append("activity_type", "Forecasting Stage");
      formData.append("relation_to_owner", "N/A");
      formData.append("on_market", 0);
      formData.append("contact_name", value.label);
      formData.append("situation_insight", "N/A");
      formData.append("note", `Forecasting stage updated from "${formatForecastingStage(oldFCStage)}" to "${value.label}"`);
      props.createActivity(formData, props.property.id);
    });
  };
  const formatActivityType = (activityType) => {
    switch (activityType) {
      case "call_out":
        return "Call Out";
      case "call_in":
        return "Call In";
      case "email":
        return "Email";
      case "text":
        return "Text";
      case "Receive_text":
          return "Receive text";
      case "receive_text":
        return "Receive text";
      case "recording":
          return "Voicemail";
      default:
        return activityType;
    }
    // switch (activityType) {
    //   case "call_out":
    //     return "Call Out";
    //   case "call_in":
    //     return "Call In";
    //   case "email":
    //     return "Email";
    //   case "text":
    //     return "Text";
    //   case "appointment":
    //     return "Appointment";
    //   default:
    //     return activityType;
    // }
  };
  const handleFetchNumberProperty = async (propertieId) => {
    setLoading(true);
     const getData = await props.getNumberProperty({id: propertieId});
     if(getData){
      const featchData = await props.fetchPropertyDetails(propertieId);
      if(featchData){
        setLoading(false);
      }
     }else{
      setLoading(false);
     }
  };
  const handleDeleteActivity = (activityId) => {
    Swal.fire({
      title: "Do you want to delete this activity?",
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await props.deleteActivity(activityId, props.property.id);
        } catch {
          Swal.fire("Something went wrong!", "", "error");
        }
      }
    });
  };
  useEffect(() => {
    let id = props.match?.params?.id;
    if (typeof id === "string") {
      handleFetchProperty(id);
    }


    let voicemail = props.match?.params?.voicemail;
    if (typeof voicemail === "string") {
      setTimeout( async () => {
        var activity = await props.fetchOneActivities(voicemail);
        setSelectedActivity(activity);
        setActivityLogVisible(true);
      }, 500);
    }

  }, [props.match]);
  useEffect(() => {
    if (props.property?.id) {
      setSelectedOption({
        value: props.property.forecasting_stage,
        label: formatForecastingStage(props.property.forecasting_stage),
      });
      props.fetchActivities({ property_id: props.property.id });
    }
  }, [props.property]);
  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <span
            class="spinner-border spinner-border-lg text-primary"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      ) : (
        <>
          {props.property?.id ? (
            <>
              <div className="form-head page-titles d-flex  align-items-center">
                <div className="mr-auto  d-lg-block">
                  <h2 className="text-black font-w600">Property Details</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item active">
                      <Link to="/property-details">Property</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/property-details">
                        {props.property.address} {props.property.city}
                      </Link>
                    </li>
                  </ol>
                </div>
                <div
                  className="btn btn-primary rounded light mr-3"
                  onClick={() => handleFetchNumberProperty(props.property?.id)}
                          >   
                  <i class="las la-cloud-download-alt scale5 mr-2"></i> Fetch numbers
                  {/* <i class="las la-comment scale5 mr-2"></i>  */}
                </div>
                <div
                  className="btn btn-primary rounded light mr-3"
                  onClick={() => setShowSendMessageModel(true)}
                          >   
                  <i class="las la-comment scale5 mr-2"></i> Send Message
                </div>
                <div
                  onClick={() => setEditPropertyVisible(true)}
                  className="btn btn-primary rounded mr-3"
                >
                  Update Info
                </div>
                <div
                  className="btn btn-primary rounded light mr-3"
                  onClick={() => handleFetchProperty(props.property?.id)}
                >
                  Refresh
                </div>
                {/* <Link to="/property-details" className="btn btn-primary rounded">
                  <i className="flaticon-381-settings-2 mr-0" />
                </Link> */}
              </div>
              <div className="row">
                <div className="col-xl-3 col-xxl-4">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card bg-primary text-center">
                        <div className="card-body">
                          <h2 className="fs-30 text-white">
                            {moment(props.property.sale_date).format(
                              "MM-DD-YYYY"
                              // "DD/MM/YYYY"
                            )}
                          </h2>
                          {/* <span className="text-white font-w300">
                            ${props.property.estimated_value}
                          </span> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12">
                      <div className="card text-center">
                        <div className="card-body">
                          <div style={{ marginBottom: 30 }}>
                            <Select
                              defaultValue={selectedOption}
                              onChange={(value) =>
                                handleChangeForecastingStage(value)
                              }
                              options={options}
                              placeholder="Forecasting Stages"
                            />
                          </div>
                          {/* <div className="position-relative mb-3 d-inline-block">
                            <img src={avatar1} alt="" className="rounded" width={140} />
                            <Link to="/app-profile" className="profile-icon">
                              <i className="las la-cog" />
                            </Link>
                          </div> */}
                          <h4 className="text-black fs-20 font-w600">
                            {props.property?.owner}
                            {/* {props.property?.owner_first_name} {props.property?.owner_last_name} */}
                          </h4>
                          <span className="mb-3 text-black d-block">Owner</span>
                          {/* <p>
                            {props.property?.owner_address}{props.property?.owner_city ? `, ${props.property.owner_city}` : ""}{props.property?.owner_state ? `, ${props.property.owner_state}` : ""}{props.property?.owner_zip ? `, ${props.property.owner_zip}` : ""}
                          </p> */}
                          {/* <ul className="property-social">
                            <li>
                              <Link to="/property-details">
                                <i className="lab la-instagram" />
                              </Link>
                            </li>
                            <li>
                              <Link to="/property-details">
                                <i className="lab la-facebook-f" />
                              </Link>
                            </li>
                            <li>
                              <Link to="/property-details">
                                <i className="lab la-twitter" />
                              </Link>
                            </li>
                          </ul> */}
                        </div>
                        <div className="card-footer border-0 pt-0">
                          <a
                            href={
                              "https://www.myfirstam.com/Security/Login?ReturnUrl=%2F"
                            }
                            className="btn btn-outline-primary d-block rounded mb-2"
                            target="_blank"
                          >
                            <i className="las la-user-check scale5 mr-2" />
                            Verify Owner
                          </a>
                        </div>
                        <div className="card-footer border-0 pt-0">
                          {renderContacts()}
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-6 col-md-6">
                      <div className="card">
                        <div className="card-header mb-0 border-0">
                          <h3 className="fs-20 text-black">
                            Property Location
                          </h3>
                        </div>
                        <div className="card-body pt-0 text-center">
                          <img src={getPropertyImage()} className="mw-100" />
                        </div>
                        <div className="card-body pt-0 text-center">
                          <img
                            src={getPropertyStaticMap()}
                            alt=""
                            className="mw-100"
                          />
                        </div>
                        {showLightbox && (
                          <Lightbox
                            images={[
                              {
                                url: getPropertyImage(),
                                title: "Property Image",
                              },
                              {
                                url: getPropertyStaticMap(),
                                title: "Property Location",
                              },
                            ]}
                            onClose={() => setShowLightbox(false)}
                            allowReset={false}
                            allowZoom={false}
                            allowRotate={false}
                          />
                        )}
                        <div className="card-footer border-0 p-0">
                          <button
                            onClick={() => setShowLightbox(true)}
                            className="btn btn-primary d-block rounded"
                            style={{ width: "100%" }}
                          >
                            View in Full Screen
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-6 col-md-6">
                      <div className="card">
                        <div className="card-header mb-0 border-0 pb-0">
                          <h3 className="fs-20 text-black mb-0">
                            Activity Log
                          </h3>
                        </div>
                        <div className="card-body pt-4">
                          <div className="media mb-3 mb-sm-4">
                            <div className="media-body">
                              <button
                                className="btn btn-outline-primary d-block rounded mb-2"
                                style={{ textAlign: "left", width: "100%" }}
                                onClick={() =>
                                  props.history.push(
                                    `/app-calender/${props.property.id}`
                                  )
                                }
                              >
                                <i className="las la-calendar-check scale5 mr-2" />
                                Schedule Appointment
                              </button>
                              <button
                                className="btn btn-outline-primary d-block rounded mb-2"
                                style={{ textAlign: "left", width: "100%" }}
                                onClick={() => setActivityLogVisible(true)}
                              >
                                <i className="las la-clipboard-list scale5 mr-2" />
                                Log Activity
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: -20 }}>
                          {
                            <div className="card-body">
                              {props.activities.map((activity, key) => (
                                <div className="media mb-3 mb-sm-4" key={key}>
                                  <div className="media-body">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <h4 className="fs-16 font-w600 mb-0">
                                        <div
                                          className="text-black"
                                          onClick={() => {
                                            if(activity.activity_type === "appointment"){
                                              props.history.push(
                                                `/app-calender/${props.property.id}`
                                              )
                                            }else{
                                              setSelectedActivity(activity);
                                              setActivityLogVisible(true);
                                            }
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {activity.contact_name} (
                                          {formatActivityType(
                                            activity.activity_type
                                          )}
                                          )
                                        </div>
                                      </h4>
                                      <div
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleDeleteActivity(activity.id)
                                        }
                                      >
                                        <i
                                          className="las la-trash scale5 mr-2"
                                          style={{ color: "#f00" }}
                                        />
                                      </div>
                                    </div>
                                    {activity.activity_type ===
                                      "appointment" && (
                                      <div className="fs-14 d-block mb-2">
                                        {activity.note?.length > 20 ? `${activity.note.substr(0, 20)}[...]` : activity.note}
                                      </div>
                                    )}
                                    {activity.activity_type === "Forecasting Stage" && (
                                      <div className="fs-14 d-block mb-2">
                                      {activity.note}
                                    </div>
                                    )}
                                    <div className="fs-14 d-block mb-2">
                                      {activity.activity_type === "appointment"
                                        ? activity.created_on
                                        : activity.updated_on}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          }
                        </div>
                        {/* {(props.property.owner_first_name?.length > 0
                          ||
                          props.property.owner_last_name?.length > 0) ? (
                          <div className="card-body pt-4">
                            <div className="media mb-3 mb-sm-4">
                              <div className="media-body">
                                <h4 className="fs-16 font-w600 mb-0">
                                  <Link to="/review" className="text-black">
                                    {props.property.owner_first_name} {props.property.owner_last_name}
                                  </Link>
                                </h4>
                                <span className="fs-14 d-block mb-2">
                                  {moment(props.property.sale_date).format("YYYY-MM-DD")}
                                </span>
                              </div>
                            </div>
                            <div className="media mb-3 mb-sm-4">
                              <div className="media-body">
                                <h4 className="fs-16 font-w600 mb-0">
                                  <Link to="/review" className="text-black">
                                    {props.property.owner2}
                                  </Link>
                                </h4>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="card-body pt-4">
                            <div className="media mb-3 mb-sm-4">
                              <div className="media-body">
                                <span className="fs-14 d-block mb-2">
                                  No owner history found
                                </span>
                              </div>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-xxl-8">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body">
                          {/*<div className="front-view-slider mb-sm-5 mb-3 owl-carousel">
                         <FrontViewSlider />
                      </div> */}

                          <div>
                            <Link
                              to="/property-details"
                              className="btn btn-primary rounded mb-4"
                            >
                              Type {props.property.property_type}
                            </Link>
                            <div className="d-md-flex d-block mb-sm-5 mb-3">
                              <div className="mr-auto mb-md-0 mb-4">
                                <h3 className="font-w600 text-black">
                                  {props.property.address},{" "}
                                  {props.property.city}, {props.property.state},{" "}
                                  {props.property.county}, {props.property.zip}
                                </h3>
                                <div style={{ marginTop: 30 }}>
                                  <div className="btn btn-primary light rounded mr-2 mb-sm-3 mb-3">
                                    {/* <i className="las la-check-circle" /> */}
                                    Property Type:{" "}
                                    {props.property.property_type}
                                  </div>
                                  <div className="btn btn-primary light rounded mr-2 mb-sm-3 mb-2">
                                    {/* <i className="las la-check-circle" /> */}
                                    Square Feet: {props.property.sqft}
                                  </div>
                                  <div className="btn btn-primary light rounded mr-2 mb-sm-3 mb-2">
                                    {/* <i className="las la-check-circle" /> */}
                                    Lot Size: {props.property.lot_size}
                                  </div>
                                  <div className="btn btn-primary light rounded mr-2 mb-sm-3 mb-2">
                                    {/* <i className="las la-check-circle" /> */}
                                    Estimated Value: $
                                    {parseFloat(
                                      props.property.estimated_value
                                    )?.toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                    })}
                                  </div>
                                  <div className="btn btn-primary light rounded mr-2 mb-sm-3 mb-2">
                                    {/* <i className="las la-check-circle" /> */}
                                    Units: {props.property.units}
                                  </div>
                                  <div className="btn btn-primary light rounded mr-2 mb-sm-3 mb-2">
                                    {/* <i className="las la-check-circle" /> */}
                                    Foreclosure Stage:{" "}
                                    {props.property.forecloser_stage}
                                  </div>
                                </div>
                                {/* <span className="fs-18">
                                  <svg
                                    width={26}
                                    height={26}
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M10.9475 4.78947C8.94136 4.78947 7.02346 5.55047 5.61418 6.89569C4.20599 8.23987 3.42116 10.056 3.42116 11.9426C3.42116 14.7033 5.29958 17.3631 7.32784 19.4068C8.3259 20.4124 9.32653 21.2351 10.0786 21.8068C10.434 22.077 10.7326 22.29 10.9475 22.4389C11.1623 22.29 11.4609 22.077 11.8163 21.8068C12.5684 21.2351 13.569 20.4124 14.5671 19.4068C16.5954 17.3631 18.4738 14.7033 18.4738 11.9426C18.4738 10.056 17.689 8.23987 16.2808 6.89569C14.8715 5.55047 12.9536 4.78947 10.9475 4.78947ZM10.9475 23.2632C10.5801 23.8404 10.58 23.8403 10.5797 23.8401L10.5792 23.8398L10.5774 23.8387L10.5718 23.835L10.5517 23.8221C10.5345 23.8109 10.5097 23.7948 10.4779 23.7737C10.4143 23.7317 10.3224 23.6701 10.2063 23.5901C9.97419 23.43 9.64481 23.1959 9.25054 22.8962C8.46315 22.2977 7.41114 21.4333 6.35658 20.3707C4.27957 18.278 2.05273 15.2776 2.05273 11.9426C2.05273 9.67199 2.99797 7.50121 4.66932 5.90583C6.33959 4.31148 8.59845 3.42105 10.9475 3.42105C13.2965 3.42105 15.5554 4.31148 17.2256 5.90583C18.897 7.50121 19.8422 9.67199 19.8422 11.9426C19.8422 15.2776 17.6154 18.278 15.5384 20.3707C14.4838 21.4333 13.4318 22.2977 12.6444 22.8962C12.2501 23.1959 11.9207 23.43 11.6886 23.5901C11.5725 23.6701 11.4806 23.7317 11.417 23.7737C11.3979 23.7864 11.3814 23.7972 11.3675 23.8063C11.3582 23.8124 11.3501 23.8176 11.3432 23.8221L11.3232 23.835L11.3175 23.8387L11.3158 23.8398L11.3152 23.8401C11.315 23.8403 11.3148 23.8404 10.9475 23.2632ZM10.9475 23.2632L11.3148 23.8404C11.0907 23.983 10.8043 23.983 10.5801 23.8404L10.9475 23.2632Z"
                                      fill="#666666"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M10.9474 10.2632C9.81378 10.2632 8.89479 11.1822 8.89479 12.3158C8.89479 13.4494 9.81378 14.3684 10.9474 14.3684C12.0811 14.3684 13.0001 13.4494 13.0001 12.3158C13.0001 11.1822 12.0811 10.2632 10.9474 10.2632ZM7.52637 12.3158C7.52637 10.4264 9.05802 8.89474 10.9474 8.89474C12.8368 8.89474 14.3685 10.4264 14.3685 12.3158C14.3685 14.2052 12.8368 15.7368 10.9474 15.7368C9.05802 15.7368 7.52637 14.2052 7.52637 12.3158Z"
                                      fill="#666666"
                                    />
                                  </svg>
                                  {props.property.state}, {props.property.zip}, {props.property.country}
                                </span> */}
                              </div>
                              <div className="ml-md-4 text-md-right">
                                <p className="fs-14 text-black mb-1 mr-1">
                                  Estimated Price
                                </p>
                                <h4 className="fs-24 text-primary">
                                  $
                                  {parseFloat(
                                    props.property.estimated_value
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </h4>
                              </div>
                            </div>
                            <h4 className="text-black fs-20 font-w600">
                              Description
                            </h4>
                            <div className="card property-features">
                              <ul>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Square ft: {props.property.sqft}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Lot size: {props.property.lot_size}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Year built: {props.property.year_built}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Units: {props.property.units}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Forecloser stage:{" "}
                                  {props.property.forecloser_stage}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Postponement reason:{" "}
                                  {props.property.postponement_reason}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Estimated total loan balance: $
                                  {parseFloat(
                                    props.property.estimated_total_loan_balance
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Default amount: $
                                  {parseFloat(
                                    props.property.default_amount
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Published bid: $
                                  {parseFloat(
                                    props.property.published_bid
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Opening bid: $
                                  {parseFloat(
                                    props.property.opening_bid
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  FC loan amount: $
                                  {parseFloat(
                                    props.property.fc_loan_amount
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Listing price: $
                                  {parseFloat(
                                    props.property.listing_price
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Assessed value: $
                                  {parseFloat(
                                    props.property.assessed_value
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  First loan amount: $
                                  {parseFloat(
                                    props.property.first_loan_amount
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Second loan amount: $
                                  {parseFloat(
                                    props.property.second_loan_amount
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  APN: {props.property.apn}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  County: {props.property.county}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Assessed year: {props.property.assessed_year}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Annual taxes: $
                                  {parseFloat(
                                    props.property.annual_taxes
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Recording date:{" "}
                                  {props.property.recording_date}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Trustee: {props.property.trustee}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Trustee phone: {props.property.trustee_phone}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Sale place: {props.property.sale_place}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Winning bid: $
                                  {parseFloat(
                                    props.property.winning_bid
                                  )?.toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  FC loan lender name:{" "}
                                  {props.property.fc_loan_lender_name}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  FC estimated loan position:{" "}
                                  {props.property.fc_estimated_loan_position}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  FC loan date: {props.property.fc_loan_date}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  FC loan doc num:{" "}
                                  {props.property.fc_loan_doc_num}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  First loan date:{" "}
                                  {props.property.first_loan_date}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Second loan lender:{" "}
                                  {props.property.second_loan_lender}
                                </li>
                                <li>
                                  <i class="las la-dot-circle"></i>
                                  Second loan date:{" "}
                                  {props.property.second_loan_date}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body image-gallery-body">
                          <div className="image-gallery owl-carousel">
                            <ImageGallery />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-xl-12">
                      <div className="card property-features">
                        <div className="card-header border-0 pb-0">
                          <h3 className="fs-20 text-black mb-0">
                            Property Features
                          </h3>
                        </div>
                        <div className="card-body">
                          <div className="mb-sm-5 mb-2">
                            <span className="btn btn-primary light rounded mr-2 mb-sm-0 mb-2">
                              <svg
                                className="mr-2"
                                width={28}
                                height={19}
                                viewBox="0 0 28 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M23.1 8.03846C25.7498 8.03846 28 10.2859 28 13.1538V17.5385H25.9V19H24.5V17.5385H3.5V19H2.1V17.5385H0V13.1538C0 10.3876 2.17398 8.03846 4.9 8.03846H23.1ZM21.7 0C23.5821 0 25.2005 1.57962 25.2 3.65385L25.2005 7.14522C24.5639 6.78083 23.8517 6.57692 23.1 6.57692L21.7 6.57618C21.7 5.32466 20.7184 4.38462 19.6 4.38462H15.4C14.8622 4.38462 14.3716 4.59567 14.0001 4.94278C13.629 4.59593 13.1381 4.38462 12.6 4.38462H8.4C7.24044 4.38462 6.30038 5.36575 6.3 6.57619L4.9 6.57692C4.14851 6.57692 3.43653 6.7807 2.8 7.14488V3.65385C2.8 1.68899 4.3096 0 6.3 0H21.7ZM12.6 5.84579C12.9799 5.84579 13.3 6.21117 13.3 6.57692L7.7 6.57618C7.7 6.12909 8.04101 5.84615 8.4 5.84615L12.6 5.84579ZM19.6 5.85107C19.9961 5.84578 20.2996 6.20175 20.3 6.57618H14.7C14.7 6.1227 15.041 5.84615 15.4 5.84615L19.6 5.85107Z"
                                  fill="#3B4CB8"
                                />
                              </svg>
                              {props.property.beds} Bedroom
                            </span>
                            <span className="btn btn-primary light rounded mr-2 mb-sm-0 mb-2">
                              <svg
                                className="mr-2"
                                width={19}
                                height={22}
                                viewBox="0 0 19 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19 10.4211L18.6388 12.249C18.0616 15.1706 15.4406 17.3684 12.5829 17.3684H11.6923L13.4082 22H2.28779V10.4211H19ZM5.14753 0C6.68536 0 8.00727 1.29706 8.00727 2.89474V7.52632H18.8743V8.68421H8.00727V9.26316H1.1439L1.14378 11.0001C0.481336 10.4964 0 9.64309 0 8.68421V2.89474C0 1.33809 1.25234 0 2.85974 0H5.14753Z"
                                  fill="#3B4CB8"
                                />
                              </svg>
                              {props.property.baths} Bathroom
                            </span>
                            {props.property?.pool === 1 && (
                              <span className="btn btn-primary light rounded mr-2 mb-sm-0 mb-2">
                                <i className="las la-check-circle" />
                                Swimming pool
                              </span>
                            )}
                            {props.property?.stories > 0 && (
                              <span className="btn btn-primary light rounded mr-2 mb-sm-0 mb-2">
                                <i className="las la-check-circle" />
                                {props.property?.stories} Stories
                              </span>
                            )}
                            {props.property?.listed_for_sale === 1 && (
                              <span className="btn btn-primary light rounded mr-2 mb-sm-0 mb-2">
                                <i className="las la-check-circle" />
                                Listed for sale
                              </span>
                            )}
                          </div>
                          {/*<ul>
                            {props.property?.pool === 1 && (
                              <li>
                                <i className="las la-check-circle" />
                                Swimming pool
                              </li>
                            )}
                            {props.property?.stories > 0 && (
                              <li>
                                <i className="las la-check-circle" />
                                {props.property?.stories} stories
                              </li>
                            )}
                            {props.property?.listed_for_sale === 1 && (
                              <li>
                                <i className="las la-check-circle" />
                                Listed for sale
                              </li>
                            )}
                             <li>
                              <i className="las la-check-circle" />
                              Terrace
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Radio
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Grill
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Cable TV
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Air conditioning
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Cofee pot
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Balcony
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Computer
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Parquet
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Internet
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Towelwes
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Roof terrace
                            </li>
                            <li>
                              <i className="las la-check-circle" />
                              Oven
                            </li> 
                          </ul>*/}
                        </div>
                      </div>
                    </div>
                    
                    {/* <div className="col-xl-12">
                      <div className="card property-features">
                        <div className="card-header border-0 pb-0">
                          <h3 className="fs-20 text-black mb-0">
                            Property
                          </h3>
                        </div>
                        <div className="card-body">
                          <Category></Category>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="form-head page-titles d-flex  align-items-center">
              <div className="mr-auto  d-lg-block">
                <h2 className="text-black font-w600 text-uppercase">
                  No Property Found!
                </h2>
              </div>
            </div>
          )}
        </>
      )}
      <EditProperty
        visible={editPropertyVisible}
        onHide={() => setEditPropertyVisible(false)}
        property={props.property}
      />
      <ActivityLogModal
        visible={activityLogVisible}
        onHide={() => {
          setSelectedActivity({});
          setActivityLogVisible(false);
        }}
        property={props.property}
        activity={selectedActivity}
      />
      <SingleMessageModel property={props.property} visible={showSendMessageModel}
        onHide={()=>onHideMessage()}/>
      
      <MakeCall property={props.property} number={makeCallNumber} visible={showMakeCall}
            onHide={()=>onHideCall()} callStatus={callStatus}/>  
    </>
  );
}
const mapStateToProps = (state) => ({
  property: state.properties.property,
  activities: state.properties.activities,
});
const mapDispatchToProps = {
  fetchPropertyDetails,
  updateProperty,
  fetchActivities,
  deleteActivity,
  createActivity,
  fetchOneActivities,
  getNumberProperty
};
export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetails);
