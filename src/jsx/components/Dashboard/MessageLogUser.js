import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
// import BasicDatatable from "../table/BasicDatatable";
import MessageDatatable from '../table/MessageDatatable';
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";
import { fetchMessages } from "../../../stores/messages/actions"

function MessageLogUser(props) {
  const [loading, setLoading] = useState(false);
  const handleFetchMessages = async () => {
    console.log('get messages');
    try {
      setLoading(true);
      await props.fetchMessages({ limit: props.limit, offset: props.offset });
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // handleFetchMessages()
  }, [])
  
  const handleRefreshMessages= async () => {
    try {
      setLoading(true);
      await props.fetchMessages({ limit: props.limit, offset: 0 });
      props.messageSetPage({
        activePage: 1,
        offset: 0
      })
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }
//   const handleDeleteBulk = async() =>{
//     Swal.fire({
//       title: 'Do you want to delete these messages?',
//       showDenyButton: true,
//       confirmButtonText: `Yes`,
//       denyButtonText: `No`,
//       icon: "warning"
//     }).then(async(result) => {
//       if (result.isConfirmed) {
//         try{
//           setDeleting(true);
//           let propertyIds = props.selectedMessages.map(property=>property.id).join(",");
//           let formData = new FormData();
//           formData.append("ids", propertyIds)
//           await props.deleteBulkProperty(formData)
//           Swal.fire('Messages Deleted Successfully!', '', 'success');
//         }catch{
//           Swal.fire('Something went wrong!', '', 'error');
//         }finally{
//           setDeleting(false);
//         }
//       }
//     })
//   }
  useEffect(() => {
    let tempData = [];
    console.log('load data')
    if (props.selectedMessages?.length) {
      let headers = Object.keys(props.selectedMessages[0]);
      tempData.push(headers);
      props.selectedMessages.map(property => {
        
        tempData.push(Object.values(property))
      })
      // setCsvData([...tempData])
    }
  }, [props.selectedMessages])
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
        {/* {props.selectedMessages.length > 0 && (
          <div className='btn btn-danger rounded mr-3' onClick={()=>handleDeleteBulk()}>
            {deleting ? (
              <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
            ) : (
              <i className='flaticon-381-trash mr-0' />
            )}
          </div>
        )} */}
        <div className='btn btn-primary rounded light mr-3' onClick={() => handleRefreshMessages()}>
          Refresh
        </div>
      </div>
      <div className='row'>
        
        <div className='col-xl-12'>
          <div className='table-responsive table-hover fs-14'>
            <MessageDatatable loading={loading} fetchMessages={() => handleFetchMessages()} />
          </div>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state) => ({
  totalMessages: state.messages.totalMessages,
  limit: state.messages.limit,
  offset: state.messages.offset,
  selectedMessages: state.messages.selectedMessages,
});
const mapDispatchToProps = {
    fetchMessages,
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageLogUser);