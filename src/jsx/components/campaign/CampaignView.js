import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";

import DataTable from 'react-data-table-component';

//** Import Image */
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import Select from 'react-select'

import { GOOGLE_KEY } from "../../../config/index";
import Swal from "sweetalert2";
//redux
import { connect } from "react-redux";
import { fetchPropertyDetails, updateProperty, fetchActivities, deleteActivity } from "../../../stores/campaigns/actions";
import moment from "moment";

function CampaignView(props) {
  console.log(props);
  const [showSendMessageModel, setShowSendMessageModel] = useState(false);
  const [showMakeCall, setShowMakeCall] = useState(false);
  const [callStatus, setCallStatus] = useState(false)
  const [loading, setLoading] = useState(false);
  const [editPropertyVisible, setEditPropertyVisible] = useState(false);
  const [activityLogVisible, setActivityLogVisible] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState({});

  const columns = [
    {
        name: 'Name',
        selector: row => { return row.pro_id
          ? (<Link target="_blank" to={`/property-details/${row.pro_id}`}>
              {row.owner}
          </Link>)
          : ( `UNKNOWN` )
      },
    },
    {
        name: 'Number',
        selector: row => row.number,
    },
    {
        name: 'From number',
        selector: row => row.fromnumber,
    },
    {
        name: 'Status',
        selector: row => { return row.CallStatus === 'pending' ? (<span class="badge rounded-pill bg-warning text-white">{row.CallStatus}</span>)
          : row.CallStatus === 'completed' ? (<span class="badge rounded-pill bg-success text-white">{row.CallStatus}</span>)
          : row.CallStatus === 'busy' ? (<span class="badge rounded-pill bg-danger text-white">{row.CallStatus}</span>)
          : row.CallStatus === 'no-answer' ? (<span class="badge rounded-pill bg-danger text-white">{row.CallStatus}</span>)
          : (<span class="badge rounded-pill bg-primary text-white">{row.CallStatus}</span>)
        },
    },
    {
        name: 'Transfer',
        selector: row => { return row.transfer &&  row.transfer == 'true'
          ? (<span class="badge rounded-pill bg-success text-white">Yes</span> )
          : (<span class="badge rounded-pill bg-danger text-white">No</span> )
        },
    },
];
  const formatForecastingStage = (stage) => {
    switch (stage) {
      case "prospect":
        return "Prospect"
      case "contractSent":
        return "Contract Sent"
      case "offerMade":
        return "Offer Made"
      case "negotiation":
        return "Negotiation"
      case "closed":
        return "Closed"
      case "followUp":
        return "Follow-up"
      case "doNotContact":
        return "Do Not Contact"
      default:
        return stage;
    }
  }
  const handleFetchProperty = async (id) => {
    try {
      setLoading(true);
      await props.fetchPropertyDetails(id);
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }
 
 
 
  useEffect(() => {
    let id = props.match?.params?.id;
    if (typeof id === "string") {
      handleFetchProperty(id)
    }
  }, [props.match])
  useEffect(() => {
    if (props.property?.id) {
      setSelectedOption({
        value: props.property.forecasting_stage,
        label: formatForecastingStage(props.property.forecasting_stage)
      })
      props.fetchActivities({ property_id: props.property.id })
    }
  }, [props.property])

  const makeCall = () =>{
    setCallStatus(true);
    setShowMakeCall(true);
  }

  const onHideCall = () => {
    console.log('hide call')
    console.log(props.property.id);
    handleFetchProperty(props.property.id)
    setCallStatus(false);
    setShowMakeCall(false)
  }

  const onHideMessage = () => {
    setShowSendMessageModel(false)
    handleFetchProperty(props.property.id)
  }
  
  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <span class="spinner-border spinner-border-lg text-primary" role="status" aria-hidden="true">
          </span>
        </div>
      ) : (
        <>
          {props.property?.id ? (
            <>
              <div className="form-head page-titles d-flex  align-items-center">
                <div className="mr-auto  d-lg-block">
                  <h2 className="text-black font-w600">Campaign Report</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item active">
                      <Link to="/campaign">Campaign</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/campaign">{props.property.title}</Link>
                    </li>
                  </ol>
                </div>
                
                {/* <div
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
                </div> */}
                
              </div>
              <div className="row">
                <div className="col-xl-3 col-xxl-4">
                  <div className="row">
                    {/* <div className="col-xl-12">
                      <div className="card bg-primary text-center">
                        <div className="card-body">
                          <h2 className="fs-30 text-white">{moment(props.property.sale_date).format("DD/MM/YYYY")}</h2>
                          
                        </div>
                      </div>
                    </div> */}
                    <div className="col-xl-12 col-lg-12">
                      <div className="card text-center">
                        <div className="card-body">
                            {/* campaign detail code */}
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <b>Title</b>
                                    <span>{props.property?.title}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <b>Forward Number </b>
                                    <span>{props.property?.forward_number}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <b>Voice</b>
                                    <span>{props.property?.voice}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <b>Created At</b>
                                    <span>{props.property?.created_at}</span>
                                </li>
                            </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12 col-lg-12">
                      <div className="card text-center">
                        <div className="card-header">
                            Voice Text
                        </div>
                        <div className="card-body">
                           <p>
                            {props.property?.text}
                           </p>
                            
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div className="col-xl-9 col-xxl-8">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header mb-0 border-0 pb-0">
                          <h3 className="fs-20 text-black mb-0">Campaign Report</h3>
                        </div>
                        <div className="card-body">
                          <div>
                            {/* report table code  */}


                            <div className="card-body" >
                              
                                  {/* <table class="table table-hover table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th scope="col">Number</th>
                                      <th scope="col">From number</th>
                                      <th scope="col">Status</th>
                                      <th scope="col">Transfer</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {props.activities.map((activity, key) => (
                                        <tr class="table-active">
                                        <th scope="row">
                                            {activity.pro_id
                                                ? (<Link target="_blank" to={`/property-details/${activity.pro_id}`}>
                                                    {activity.owner}
                                                </Link>)
                                                : ( `UNKNOWN` )
                                            }
                                            
                                        </th>
                                        <th scope="row">{activity.number}</th>
                                        <td>{activity.fromnumber}</td>
                                        <td>{activity.CallStatus}</td>
                                        <td>{activity.transfer &&  activity.transfer == 'true'
                                                ? ('Yes')
                                                : ('No')
                                            }
                                        </td>
                                        </tr>
                                    ))}
                                  </tbody>
                                </table> */}
                                <DataTable
                                    columns={columns}
                                    data={props.activities}
                                    pagination 
                                />
                            </div>

                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="form-head page-titles d-flex  align-items-center">
              <div className="mr-auto  d-lg-block">
                <h2 className="text-black font-w600 text-uppercase">No Campaign Found!</h2>
              </div>
            </div>
          )}
        </>
      )}
      {/* <ActivityLogModal
        visible={activityLogVisible}
        onHide={() => {
          setSelectedActivity({})
          setActivityLogVisible(false)
        }}
        property={props.property}
        activity={selectedActivity}
      /> */}
      

    </>
  );
}
const mapStateToProps = (state) => ({
  property: state.campaigns.message,
  activities: state.campaigns.activities,
});
const mapDispatchToProps = {
  fetchPropertyDetails,
  updateProperty,
  fetchActivities,
  deleteActivity
};
export default connect(mapStateToProps, mapDispatchToProps)(CampaignView);