import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
// import BasicDatatable from "../table/BasicDatatable";
import MessageDatatable from '../table/MessageDatatable';
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";

function MessageLog(props) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className='form-head page-titles d-flex  align-items-center'>
        <div className='mr-auto  d-lg-block'>
          <h2 className='text-black font-w600'>Messages</h2>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item active'>
              <Link to='/order-list'>Dashboard</Link>
            </li>
            <li className='breadcrumb-item'>
              <Link to='/messages'>Messages</Link>
            </li>
          </ol>
        </div>
        <div className='btn btn-primary rounded light mr-3'>
          Refresh
        </div>
      </div>
      <div className='row'>
        
        <div className='col-xl-12'>
          <div className='table-responsive table-hover fs-14'>
            <MessageDatatable />
          </div>
        </div>
        
      </div>
    </>
  )
}
const mapStateToProps = (state) => ({

});
const mapDispatchToProps = {
    // fetchMessages,
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageLog);