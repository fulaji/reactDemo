import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import BasicDatatable from "../table/BasicDatatable";
import { Dropdown } from 'react-bootstrap'
import CSVReader from 'react-csv-reader'
import swal from "sweetalert";
import moment from "moment";
import { CSVLink } from "react-csv";
import $ from "jquery";
import Swal from "sweetalert2";
import AddProspectModal from './AddProspectModal';
import { Bar } from 'react-chartjs-2';

import SendMessageModel from '../../layouts/nav/SendMessageModel';
import CreateCampaign from '../campaign/CreateCampaign';

//redux
import { connect } from "react-redux";
import { fetchProperties, importProperties, propertySetPage, deleteBulkProperty, fetchStats } from "../../../stores/properties/actions";

function OrderList(props) {
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0
          },
        },
      ],
    },
    legend: {
    	display: false
    },
  };

  const [showSendMessageModel, setShowSendMessageModel] = useState(false);
  const [showCreateCampaignModel, setShowCreateCampaignModel] = useState(false);

  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvType, setCsvType] = useState("");
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [chartDataFCStage, setChartDataFCStage] = useState({
    labels: ['Prospect', 'Contract Sent', 'Offer Made', 'Negotiation', 'Closed', 'Follow-Up', 'Do Not Contact'],
    datasets: [
      {
        label: '',
        data: [0,0,0,0,0,0,0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)',
          'rgba(192, 192, 192, 0.4)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(192, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  })
  const [chartDataAppointmentMade, setChartDataAppointmentMade] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [0,0,0,0,0,0,0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)',
          'rgba(192, 192, 192, 0.4)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(192, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  })
  const [chartDataPropertiesContacted, setChartDataPropertiesContacted] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [0,0,0,0,0,0,0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)',
          'rgba(192, 192, 192, 0.4)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(192, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  })
  const [chartDataDealsClosed, setChartDataDealsClosed] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [0,0,0,0,0,0,0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)',
          'rgba(192, 192, 192, 0.4)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(192, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  })
  const hideCreateCampaign = () =>{
    setShowCreateCampaignModel(false);
    //handleFetchProperties();
    // handleRefreshProperties();
  };
  const hideSendSms = () =>{
    setShowSendMessageModel(false);
    handleRefreshProperties();
  }
  const handleFetchProperties = async () => {
    try {
      setLoading(true);
      await props.fetchProperties({ limit: props.limit, offset: props.offset });
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // handleFetchProperties()
    props.fetchStats();
  }, [])
  const handleImportProperties = async (data) => {
    try {
      setImporting(true);
      if (data.length > 1) {
        let payload = [];
        data.shift();
        if(csvType === "PR"){
          data.map((row, i) => {
            if (row.length > 1) {
              if (/\d/.test(row[0]) && /[a-zA-Z]/.test(row[0])) { //check for valid radar_id
                payload.push({
                  "radar_id": row[0] || "N/A",
                  "apn": row[1] || "N/A",
                  "county": row[2] || "N/A",
                  "address": row[3] || "N/A",
                  "city": row[4] || "N/A",
                  "state": row[5],
                  "zip": row[6] || "N/A",
                  "owner": row[7] || "N/A",
                  "owner_first_name": row[8],
                  "owner_last_name": row[9],
                  "owner_spouse_name": row[10] || "N/A",
                  "owner2": row[11] || "N/A",
                  "owner_address": row[12] || "N/A",
                  "owner_city": row[13] || "N/A",
                  "owner_state": row[14] || "N/A",
                  "owner_zip": row[15] || "N/A",
                  // "primary_residence": row[16] || 0,
                  "primary_residence":0,
                  "property_type": row[16] || "N/A",
                  "units": row[17] || 0,
                  "sqft": row[18] || 0,
                  "year_built": row[19] || "N/A",
                  "beds": row[20] || 0,
                  "baths": row[21] || 0,
                  "lot_size": row[22] || 0,
                  "pool": row[23] || 0,
                  "stories": row[24] || 0,
                  "estimated_value": row[25] || 0,
                  "estimated_total_loan_balance": row[26] || 0,
                  "assessed_value": row[27] || 0,
                  "assessed_year": row[28] || "N/A",
                  "annual_taxes": row[29] || 0,
                  "forecloser_stage": row[30] || "N/A",
                  "recording_date": moment(row[31].trim(),"MM/DD/YYYY").format("YYYY-MM-DD") || "N/A",
                  "trustee": row[32] || "N/A",
                  "trustee_sale_num": row[33] || "N/A",
                  "trustee_phone": row[33] || "N/A",
                  "sale_date": moment(row[34].trim(),"MM/DD/YYYY").format("YYYY-MM-DD") || "N/A",
                  "sale_time": row[35] || "N/A",
                  // "sale_time": moment(row[35]).format("HH:mm:ss") || "N/A",
                  "sale_place": row[36] || "N/A",
                  "postponement_reason": row[37] || "N/A",
                  "published_bid": row[38] || "N/A",
                  "opening_bid": row[39] || "N/A",
                  "winning_bid": row[40] || "N/A",
                  "default_amount": row[41] || 0,
                  "default_as_of": moment(row[44].trim(),"MM/DD/YYYY").format("YYYY-MM-DD") || "N/A",
                  "fc_estimated_loan_position": row[43] || "N/A",
                  "fc_loan_date": moment(row[45].trim(),"MM/DD/YYYY").format("YYYY-MM-DD") || "N/A",
                  "fc_loan_doc_num": "N/A",
                  // "fc_loan_doc_num": row[47] || 0,
                  "fc_loan_amount": row[44] || 0,
                  "fc_loan_lender_name": row[46] || "N/A",
                  "first_loan_lender": row[47] || "N/A",
                  "first_loan_date": moment(row[48].trim(),"MM/DD/YYYY").format("YYYY-MM-DD") || "N/A",
                  "first_loan_amount": row[49] || 0,
                  // "second_loan_lender": row[53] || "N/A",
                  // "second_loan_date": moment(row[54],"DD/MM/YYYY").format("YYYY-MM-DD") || "N/A",
                  // "second_loan_amount": row[55] || 0,
                  // "listed_for_sale": row[56] || 0,
                  // "listing_price": row[57] || 0,
                  "second_loan_lender": "N/A",
                  "second_loan_date": "N/A",
                  "second_loan_amount": "N/A",
                  "listed_for_sale": "N/A",
                  "listing_price": "N/A",
                  "source": csvType
                })
              }
            }
          })
        }else{
          data.map((row, i) => {
            if (row.length > 1) {
              if (/[a-zA-Z]/.test(row[0]) && row[0]?.length) { //check for valid radar_id
                payload.push({
                  "owner_first_name": row[0],
                  "owner_last_name": row[1],
                  "owner_email": row[2] || "N/A",
                  "contact_no": row[3],
                  "owner_address": row[4] || "N/A",
                  "owner_city": row[5] || "N/A",
                  "owner_state": row[6] || "N/A",
                  "owner_zip": row[7] || "N/A",
                  "source": csvType
                })
              }
            }
          })
        }
        // console.log(payload)
        await props.importProperties({payload, type: csvType});
        swal("Properties imported successfully", "", "success");
        (document.getElementById('csv_import')).value = '';
      }
    } catch (err) {
      console.log(err)
      swal("Something went wrong!", "Please check your CSV template", "error")
    } finally {
      setImporting(false);
    }
  }
  const handleRefreshProperties = async () => {
    try {
      setLoading(true);
      await props.fetchProperties({ limit: props.limit, offset: 0 });
      props.propertySetPage({
        activePage: 1,
        offset: 0
      })
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }
  const handleDeleteBulk = async() =>{
    Swal.fire({
      title: 'Do you want to delete these properties?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
      icon: "warning"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try{
          setDeleting(true);
          let propertyIds = props.selectedProperties.map(property=>property.id).join(",");
          let formData = new FormData();
          formData.append("ids", propertyIds)
          await props.deleteBulkProperty(formData)
          Swal.fire('Properties Deleted Successfully!', '', 'success');
        }catch{
          Swal.fire('Something went wrong!', '', 'error');
        }finally{
          setDeleting(false);
        }
      }
    })
  }
  const getLastSevenDays = () =>{
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
              'Friday', 'Saturday', 'Sunday'];
    var goBackDays = 7;
    var today = new Date();
    var daysSorted = [];
    for(var i = 0; i < goBackDays; i++) {
      var newDate = new Date(today.setDate(today.getDate() - 1));
      daysSorted.push(days[newDate.getDay()]);
    }
    daysSorted.reverse();
    return daysSorted;
  }
  const getLastSevenDates = () =>{
    var goBackDays = 7;
    var today = new Date();
    var datesSorted = [];
    datesSorted.push({date: new Date(), count: 0});
    for(var i = 0; i < goBackDays-1; i++) {
      var newDate = new Date(today.setDate(today.getDate() - 1));
      datesSorted.push({date: newDate, count: 0});
    }
    datesSorted.reverse();
    return datesSorted;
  }
  useEffect(() => {
    let tempData = [];
    if (props.selectedProperties?.length) {
      let headers = Object.keys(props.selectedProperties[0]);
      tempData.push(headers);
      props.selectedProperties.map(property => {
        tempData.push(Object.values(property))
      })
      setCsvData([...tempData])
    }
  }, [props.selectedProperties])
  useEffect(()=>{
    let lastSevenDays = getLastSevenDays();
    if(props.stats?.forecasting_count?.length){
      let prospectCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "prospect")
      let contractSentCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "contractSent")
      let offerMadeCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "offerMade")
      let negotiationCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "negotiation")
      let closedCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "closed")
      let followUpCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "followUp")
      let doNotContactCount = props.stats.forecasting_count.filter(stat =>stat.forecasting_stage === "doNotContact")
      
      if(prospectCount.length){
        prospectCount = parseInt(prospectCount[0].total_properties);
      }else{
        prospectCount = 0;
      }

      if(contractSentCount.length){
        contractSentCount = parseInt(contractSentCount[0].total_properties);
      }else{
        contractSentCount = 0;
      }

      if(offerMadeCount.length){
        offerMadeCount = parseInt(offerMadeCount[0].total_properties);
      }else{
        offerMadeCount = 0;
      }

      if(negotiationCount.length){
        negotiationCount = parseInt(negotiationCount[0].total_properties);
      }else{
        negotiationCount = 0;
      }

      if(closedCount.length){
        closedCount = parseInt(closedCount[0].total_properties);
      }else{
        closedCount = 0;
      }

      if(followUpCount.length){
        followUpCount = parseInt(followUpCount[0].total_properties);
      }else{
        followUpCount = 0;
      }

      if(doNotContactCount.length){
        doNotContactCount = parseInt(doNotContactCount[0].total_properties);
      }else{
        doNotContactCount = 0;
      }

      setChartDataFCStage({
        ...chartDataFCStage,
        datasets:[{
          ...chartDataFCStage.datasets[0],
          data:[prospectCount, contractSentCount, offerMadeCount, negotiationCount, closedCount, followUpCount, doNotContactCount]
        }]
      })
    }
    if(props.stats?.appointments_count?.length){
      let lastSevenDatesAC = getLastSevenDates();
      lastSevenDatesAC.map((dateObj)=>{
        let matched = props.stats?.appointments_count.filter(item => moment(item.created_on).format("YYYY-MM-DD") === moment(dateObj.date).format("YYYY-MM-DD"));
        if(matched.length){
          let sum = 0
          matched.map((item)=>{
            sum += parseInt(matched[0].appointments_count)
          })
          dateObj.count = sum
        }
      })
      setChartDataAppointmentMade({
        ...chartDataAppointmentMade,
        labels: lastSevenDays,
        datasets:[{
          ...chartDataAppointmentMade.datasets[0],
          data:lastSevenDatesAC.map(dateObj => dateObj.count)
        }]
      })
    }else{
      setChartDataAppointmentMade({
        ...chartDataAppointmentMade,
        labels: lastSevenDays,
      })
    }
    if(props.stats?.contacted_count?.length){
      let lastSevenDatesCC = getLastSevenDates();
      lastSevenDatesCC.map((dateObj)=>{
        let matched = props.stats?.contacted_count.filter(item => moment(item.created_on).format("YYYY-MM-DD") === moment(dateObj.date).format("YYYY-MM-DD"));
        if(matched.length){
          let sum = 0
          matched.map((item)=>{
            sum += parseInt(matched[0].contacted_count)
          })
          dateObj.count = sum
        }
      })
      setChartDataPropertiesContacted({
        ...chartDataPropertiesContacted,
        labels: lastSevenDays,
        datasets:[{
          ...chartDataPropertiesContacted.datasets[0],
          data:lastSevenDatesCC.map(dateObj => dateObj.count)
        }]
      })
    }else{
      setChartDataPropertiesContacted({
        ...chartDataPropertiesContacted,
        labels: lastSevenDays,
      })
    }
    if(props.stats?.closed_count?.length){
      let lastSevenDatesClsCount = getLastSevenDates();
      lastSevenDatesClsCount.map((dateObj)=>{
        let matched = props.stats?.closed_count.filter(item => moment(item.created_on).format("YYYY-MM-DD") === moment(dateObj.date).format("YYYY-MM-DD"));
        if(matched.length){
          let sum = 0
          matched.map((item)=>{
            sum += parseInt(matched[0].closed_count)
          })
          dateObj.count = sum
        }
      })
      setChartDataDealsClosed({
        ...chartDataDealsClosed,
        labels: lastSevenDays,
        datasets:[{
          ...chartDataDealsClosed.datasets[0],
          data:lastSevenDatesClsCount.map(dateObj => dateObj.count)
        }]
      })
    }else{
      setChartDataDealsClosed({
        ...chartDataDealsClosed,
        labels: lastSevenDays,
      })
    }
  }, [props.stats])
  return (
    <>
      <div className='form-head page-titles d-flex  align-items-center'>
        <div className='mr-auto  d-lg-block'>
          <h2 className='text-black font-w600'>Property List</h2>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item active'>
              <Link to='/order-list'>Dashboard</Link>
            </li>
            <li className='breadcrumb-item'>
              <Link to='/order-list'>Property List ({props.totalProperties})</Link>
            </li>
          </ol>
        </div>
        {props.selectedProperties.length > 0 && (
          <div className='btn btn-danger rounded mr-3' onClick={()=>handleDeleteBulk()}>
            {deleting ? (
              <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            ) : (
              <i className='flaticon-381-trash mr-0' />
            )}
          </div>
        )}
        {/* start bulk sms and call button  */}
        {props.selectedProperties.length > 0 && (
          <div className='btn btn-primary rounded light mr-3' onClick={() => setShowSendMessageModel(true)}>
            <i class="las la-comments"></i> Bulk message
          </div>
        )}

        {props.selectedProperties.length > 0 && (
          <div className='btn btn-primary rounded light mr-3' onClick={() => setShowCreateCampaignModel(true)}>
            <i class="las la-phone"></i> Phone Campaign
          </div>
        )}
        {/* end bulk sms and call button  */}
         <div className='btn btn-primary rounded light mr-3' onClick={() => setShowProspectModal(true)}>
          Add Prospect
        </div>
        <CSVLink
          filename={`my_property_finder_${Date.now()}.csv`}
          data={csvData}
          className='btn btn-primary rounded mr-3'
          onClick={() => {
            if (props.selectedProperties?.length > 0) {
              return true;
            } else {
              return false;
            }
          }}
        >
          <i className='flaticon-381-download mr-0' />
        </CSVLink>
        <div className='btn btn-primary rounded light mr-3' onClick={() => handleRefreshProperties()}>
          Refresh
        </div>
        {/* <label for="csv_import">
          <div className='btn btn-primary rounded'>
            {importing ? (
              <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            ) : (
              <i className='flaticon-381-upload mr-0' />
            )}
            <CSVReader
              onFileLoaded={(data) => handleImportProperties(data)}
              onError={(err) => console.log(err)}
              inputId="csv_import"
              inputStyle={{ display: "none" }}
              disabled={importing}
            />
            
          </div>
        </label> */}
        <Dropdown className="input-group-prepend">
          <Dropdown.Toggle
            variant=""
            className="btn btn-primary rounded"
            type="button"
            data-toggle="dropdown"
          >
            {importing ? (
              <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            ) : (
              <i className='flaticon-381-upload mr-0' />
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item className="dropdown-item" to="#" onClick={() => {
              setCsvType("PR");
              $("#csv_import").trigger("click");
            }}>
              PR
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" to="#" onClick={() => {
              setCsvType("PD");
              $("#csv_import").trigger("click");
            }}>
              PD
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <CSVReader
          onFileLoaded={(data) => handleImportProperties(data)}
          onError={(err) => console.log(err)}
          inputId="csv_import"
          inputStyle={{ display: "none" }}
          disabled={importing}
        />
      </div>
      <div className='row'>
        {/* <div className='col-xl-2 col-xxl-6 col-md-6'>
          <div className='card'>
            <div className='card-body' style={{padding: "0.8rem"}}>
              <div className='media align-items-center'>
                <div className='media-body'>
                  <h2 className='fs-20 text-black font-w600'>{props.totalProperties}</h2>
                  <span className='fs-14 text-black'>Total Properties</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className='col-xl-3 col-xxl-6 col-md-6'>
          <div className='card'>
            <div className='card-body' style={{padding: "0.8rem"}}>
              <div className='media align-items-center'>
                <div className='media-body'>
                  {/* <h2 className='fs-20 text-black font-w600'>{props.stats?.appointments_count}</h2> */}
                  <Bar data={chartDataAppointmentMade} options={options} />
                  <span className='fs-14 text-black'>Appointments Made <br />(Last 7 Days)</span>
                </div>
                {/* <div className='bg-primary rounded p-3'>
                  <i className="fa fa-home text-white" style={{ fontSize: 25 }} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xl-3 col-xxl-6 col-md-6'>
          <div className='card'>
            <div className='card-body' style={{padding: "0.8rem"}}>
              <div className='media align-items-center'>
                <div className='media-body'>
                  {/* <h2 className='fs-20 text-black font-w600'>{props.stats?.contacted_count}</h2> */}
                  <Bar data={chartDataPropertiesContacted} options={options} />
                  <span className='fs-14 text-black'>Properties Contacted <br />(Last 7 Days)</span>
                </div>
                {/* <div className='bg-primary rounded p-3'>
                  <i className="fa fa-home text-white" style={{ fontSize: 25 }} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xl-3 col-xxl-6 col-md-6'>
          <div className='card'>
            <div className='card-body' style={{padding: "0.8rem"}}>
              <div className='media align-items-center'>
                <div className='media-body'>
                  {/* <h2 className='fs-20 text-black font-w600'>{props.stats?.closed_count}</h2> */}
                  <Bar data={chartDataDealsClosed} options={options} />
                  <span className='fs-14 text-black'>Deals Closed <br />(Last 7 Days)</span>
                </div>
                {/* <div className='bg-primary rounded p-3'>
                  <i className="fa fa-home text-white" style={{ fontSize: 25 }} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xl-3 col-xxl-6 col-md-6'>
          <div className='card'>
            <div className='card-body' style={{padding: "0.8rem"}}>
              <div className='media align-items-center'>
                <div className='media-body'>
                  <Bar data={chartDataFCStage} options={options} />
                  {/* <h2 className='fs-20 text-black font-w600'>0</h2> */}
                  <span className='fs-14 text-black'>Forecasting by Stage</span>
                </div>
                {/* <div className='bg-primary rounded p-3'>
                  <i className="fa fa-home text-white" style={{ fontSize: 25 }} />
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='col-xl-12'>
          <div className='table-responsive table-hover fs-14'>
            <BasicDatatable loading={loading} fetchProperties={() => handleFetchProperties()} />
          </div>
        </div>
      </div>
      <AddProspectModal 
        visible={showProspectModal}
        onHide={()=>setShowProspectModal(false)}
      />

        <SendMessageModel 
          visible={showSendMessageModel}
          properties={props.selectedProperties}
          onHide={()=> hideSendSms()}
        />

      <CreateCampaign 
          visible={showCreateCampaignModel}
          properties={props.selectedProperties}
          onHide={()=> hideCreateCampaign()}
        />

    </>
  )
}
const mapStateToProps = (state) => ({
  totalProperties: state.properties.totalProperties,
  limit: state.properties.limit,
  offset: state.properties.offset,
  selectedProperties: state.properties.selectedProperties,
  stats: state.properties.stats
});
const mapDispatchToProps = {
  fetchProperties,
  importProperties,
  propertySetPage,
  deleteBulkProperty,
  fetchStats
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);