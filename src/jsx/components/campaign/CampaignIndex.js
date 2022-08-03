import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
// import BasicDatatable from "../table/BasicDatatable";
import CampaignDatatable from '../table/CampaignDatatable';
import Swal from "sweetalert2";
import CreateCampaign from './CreateCampaign';
//redux
import { connect } from "react-redux";
import {
  fetchMessages
} from "../../../stores/campaigns/actions";
function MessageLog(props) {
  const [loading, setLoading] = useState(false);
  const [showCreateCampaignModel, setShowCreateCampaignModel] = useState(false);
  const hideCreateCampaign = () =>{
    setShowCreateCampaignModel(false);
    handleFetchProperties();
    // handleRefreshProperties();
  };

  const handleFetchProperties = async () => {
    try {
      setLoading(true);
      await props.fetchMessages({ limit: props.limit, offset: props.offset });
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='form-head page-titles d-flex  align-items-center'>
        <div className='mr-auto  d-lg-block'>
          <h2 className='text-black font-w600'>Campaigns</h2>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item active'>
              <Link to='/order-list'>Dashboard</Link>
            </li>
            <li className='breadcrumb-item'>
              <Link to='/campaign'>Campaigns</Link>
            </li>
          </ol>
        </div>
        {/* <div className='btn btn-primary rounded light mr-3' onClick={() => setShowCreateCampaignModel(true)}>
          Add Campaign
        </div> */}
        {/* <div className='btn btn-primary rounded light mr-3'>
          Refresh
        </div> */}

        
      </div>
      <div className='row'>
        
        <div className='col-xl-12'>
          <div className='table-responsive table-hover fs-14'>
            <CampaignDatatable loading={loading}  fetchMessages={() => handleFetchProperties()} />
          </div>
        </div>
      </div>

      <CreateCampaign 
          visible={showCreateCampaignModel}
          // properties={props.selectedProperties}
          onHide={()=> hideCreateCampaign()}
        />
    </>
  )
}
const mapStateToProps = (state) => ({
  totalProperties: state.campaigns.totalProperties,
  limit: state.campaigns.limit,
  offset: state.campaigns.offset,
  selectedProperties: state.campaigns.selectedProperties,
});
const mapDispatchToProps = {
    fetchMessages,
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageLog);