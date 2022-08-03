import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
// import BasicDatatable from "../table/BasicDatatable";
import MessageDatatable from '../table/MessageDatatable';
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";

function DaySettingIvr(props) {
    console.log(props.object);
    const [state, setState] = useState(props.object);
    useEffect(() => {
        setState(props.object);
      }, [props.object])
    const handleChangeChk = (event) => {
        var updatedValue = state;
        updatedValue.status = event.target.checked;
        setState({ ...state, status: event.target.checked })
        props.onHide(updatedValue);
    }

    const ChangeIntime = (event) => {
        var updatedValue = state;
        updatedValue.intime = event.target.value;
        setState({ ...state, intime: event.target.value })
        props.onHide(updatedValue);
    }

    const ChangeOuttime = (event) => {
        var updatedValue = state;
        updatedValue.outtime = event.target.value;
        setState({ ...state, outtime: event.target.value })
        props.onHide(updatedValue);
    }
    return (
        <div class="card border shadow-sm overflow-hidden">
        <div class="card-content">
          <div class="card-body cleartfix">
            <div class="media align-items-stretch">
              
              <div class="media-body">
                <h4>{state.day}</h4>
              </div>
              <div class="align-self-center">
                <label className="switch">
                    <span className="greetext2">Status
                        {state.status
                            ? ' on'
                            : ' off'
                        } 
                    </span>
                    <input type="checkbox" checked={state.status} name="voice_mail_status" onChange={(e) => handleChangeChk(e)}/>
                    <span className="slider"></span>
                </label>
              </div>
            </div>
            {state.status
                ? <div class="d-flex justify-content-between mt-2">
                    <div class="media-body flex-fill pr-2">
                        <div className="form-group">
                            <label className="font-w400">Start Time</label>
                            <input type="time" className="form-control" name="intime"  value={state.intime} onChange={(e) => ChangeIntime(e)} 
                            required
                            />
                        </div>
                    </div>
                    <div class="align-self-center flex-fill pl-2">
                        <div class="media-body">
                            <div className="form-group">
                                <label className="font-w400">End time</label>
                                <input type="time" className="form-control" name="outtime"  value={state.outtime} onChange={(e) => ChangeOuttime(e)} 
                                required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                : ''
            }
          </div>
        </div>
      </div>
        // <ul class="list-group border mb-1">
        //     <li class="list-group-item d-flex justify-content-between align-items-center">
        //         Cras justo odio
        //         <span class="badge bg-primary badge-pill">14</span>
        //     </li>
        // </ul>
    );
}


const mapStateToProps = (state) => ({

});
const mapDispatchToProps = {
    // fetchMessages,
};
export default connect(mapStateToProps, mapDispatchToProps)(DaySettingIvr);