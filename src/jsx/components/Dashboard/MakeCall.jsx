
import Plivo from 'plivo-browser-sdk'


import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

// import Autocomplete from "./AutoComplete";
//redux
import { connect } from "react-redux";
import { sendMessage } from "../../../stores/messages/actions";
import { fetchProperties } from "../../../stores/properties/actions";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const MakeCall = (props) => {
  console.log(props.number);
	const [btnLoading, setBtnLoading] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  const [plivoSdk, setPlivoSdk] = useState(false);
  // var [userDuration2, setUserDuration] = useState(false);
  const [timerStatus, setTimerStatus] = useState(false);
  const [minute, setMinute] = useState(0);
  const [seconds, setseconds] = useState(0);
  const [Countries, setCountries] = useState([]);
	const [state, setState] = useState({
		message: "",
		prospect: [],
	})

  useEffect(() => {
      if (!timerStatus) {
        makeCall();
      }
      //console.log(timerStatus)
      //console.log(props.callStatus)
      if(props.callStatus){
       creteCall()
      }
  }, [props.callStatus])
  

    //var [plivoBrowserSdk, setplivoBrowserSdk] = useState({});
    var userDuration2 = false;
    const startTimer = () => {
      
      var value = 0;
      userDuration2 = setInterval(() => {
        //console.log(value)
          var h = parseInt(value / 3600);
          var m = parseInt(value / 60);
          var s = value % 60;
          h = h < 10 ? "0" + h : h;
          m = m < 10 ? "0" + m : m;
          s = s < 10 ? "0" + s : s;
          setMinute(m);
          setseconds(s);
          value++;
      }, 1000);
      // setUserDuration(userDuration2)
    }

    // const stopTimer = () => {
      
    // }
    var plivoBrowserSdk = null;
    const makeCall = () =>{
        setTimerStatus(true)
        
          var options = {
            "debug":'OFF',
            "permOnClick":true,
            "enableTracking":true,
            "closeProtection":true,
            "maxAverageBitrate":48000
            };
          plivoBrowserSdk = new Plivo(options);
          setPlivoSdk(plivoBrowserSdk)
          //setplivoBrowserSdk(new Plivo());
          // setplivoBrowserSdk(plivoBrowserSdk)
          plivoBrowserSdk.client.on('onWebrtcNotSupported', onWebrtcNotSupported);
          plivoBrowserSdk.client.on('onLogin', onLogin);
          plivoBrowserSdk.client.on('onLogout', onLogout);
          plivoBrowserSdk.client.on('onLoginFailed', onLoginFailed);
          // plivoBrowserSdk.client.on('onCallRemoteRinging', onCallRemoteRinging);
          //plivoBrowserSdk.client.on('onIncomingCallCanceled', onIncomingCallCanceled);
          plivoBrowserSdk.client.on('onCallFailed', onCallFailed);
          plivoBrowserSdk.client.on('onCallAnswered', onCallAnswered);
          plivoBrowserSdk.client.on('onCallTerminated', onCallTerminated);
          plivoBrowserSdk.client.on('onCalling', onCalling);
          //plivoBrowserSdk.client.on('onIncomingCall', onIncomingCall);
          //plivoBrowserSdk.client.on('onMediaPermission', onMediaPermission);
          //plivoBrowserSdk.client.on('mediaMetrics',mediaMetrics);
          //plivoBrowserSdk.client.on('audioDeviceChange',audioDeviceChange);
          //plivoBrowserSdk.client.on('onConnectionChange', onConnectionChange);
          //plivoBrowserSdk.client.on('volume', volume);
          plivoBrowserSdk.client.setRingTone(true);
          plivoBrowserSdk.client.setRingToneBack(true);
          console.log('initPhone ready!')
          // if(isLogin){
          //   creteCall();
          // }else{
            plivoBrowserSdk.client.login('myequity482313368461799269', 'Winning2022!');
          //}
        
      }
      const creteCall = () => {
        startTimer();
          var to = props.number;
          if(to.length == 10){
            to = `1${to}`
          }
          var extraHeaders={},
          customCallerId = '+15104057575'; // get the dynamic caller id
          if(customCallerId) {
            extraHeaders = {'X-PH-callerId': customCallerId, 'X-PH-number':to, 'X-PH-id':props.property.id };
          }
          
          if(!plivoBrowserSdk){
            makeCall()
          }
          plivoBrowserSdk.client.call(to, extraHeaders);
      }

      const onWebrtcNotSupported = () => {
        console.log('webrtc not supported');
      }
      const onLogin = () => {
        setisLogin(true);
        //setInterval(() => {
          // creteCall();
         // }, 5000);
       console.log('on login'); 
      }
      const onLoginFailed = () => {
        console.log('on onLoginFailed'); 
      }
      const onLogout = () => {
        console.log('on onLogout'); 
      }

      const hangupCall = () => {
        plivoSdk.client.hangup()
        // console.log('cancle call');
        clearInterval(userDuration2);
        
        //plivoBrowserSdk.client.logout();
        //plivoBrowserSdk = false;
        //setTimerStatus(false);
        // plivoBrowserSdk.client.logout()
        props.onHide();
      }

      const onCallTerminated = (hangupInfo, callInfo) => {
        console.log('call hangup')
        clearInterval(userDuration2);
        //setTimeout(myGreeting, 3000)
        //plivoBrowserSdk.client.logout();
        //plivoBrowserSdk = false;
        // plivoBrowserSdk.client.logout()
        //setTimerStatus(false);
        props.onHide();
      }

      const onCallRemoteRinging = () => {
        console.log('on onCallRemoteRinging'); 
      }
    
      const onIncomingCallCanceled = () => {
        console.log('on onIncomingCallCanceled'); 
      }
    
      const onCallFailed = () => {
        console.log('on onCallFailed'); 
       
        clearInterval(userDuration2);
        props.onHide();
      }
      const onCallAnswered = () => {
        console.log('on onCallAnswered'); 
      }
    
    
      const onCalling = () => {
        console.log('on onCalling'); 
      }
    
    
      const onIncomingCall = () => {
        console.log('on onIncomingCall'); 
      }
    
      const onMediaPermission = () => {
        console.log('on onMediaPermission'); 
      }
    
      const mediaMetrics = () => {
        console.log('on mediaMetrics'); 
      }
    
    
      const audioDeviceChange = () => {
        console.log('on audioDeviceChange'); 
      }
    
      const onConnectionChange = () => {
        console.log('on onConnectionChange'); 
      }
      const volume = (event) => {
        // console.log(event)
        console.log('on volume'); 
      }
    
      

	const reset = () =>{
		setState({
			...state,
			message: "",
			prospect: [],
		})
	}
	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
            //console.log(state.prospect);
            if(state.prospect && state.prospect.length > 0){
                setBtnLoading(true);
                let formData = {To:state.prospect,  Message:state.message, From:"+11234567890"}
                var data = await props.sendMessage(formData);
                Swal.fire(`Message send successfully`, "", "success").then(() => {
                    reset();
                    props.onHide();
                })
            }else{
                Swal.fire("Please select any number!", "", "error");
            }
			
		} catch (err) {
			Swal.fire("Something went wrong", "", "error");
		} finally {
			setBtnLoading(false);
		}
	}


	return (
		<Modal className="modal fade" show={props.visible} centered {...props} backdrop="static">
			<form onSubmit={handleSubmit}>
				<div className="modal-content" style={{ minWidth: "50vw" }}>
					<div className="modal-header">
						<h5 className="modal-title">Call</h5>
						<Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => props.onHide()}>
							<span>×</span>
						</Button>
					</div>
					<Modal.Body>
						<div className="card">
							<div className="card-body">
              <center className="">
                  <h4 className="mb-4">Outgoing call</h4>
                  <div className="">
                      <p className="font-weight-bold caller_name" >
                          {`${props.property.owner_first_name} ${props.property.owner_last_name}`}
                      </p>
                      <p className="font-weight-bold caller_number">
                        {props.number} 
                      </p>
                  </div>
                  
                  <h4 className="mb-4">{minute}:{seconds}</h4>
                  
                  <div className="btn btn-danger rounded light mr-3"
                    onClick={() => hangupCall()}>   
                    <i class="las la-phone-slash"></i> Hangup
                  </div>
                  {/* <div className="btn btn-success rounded light mr-3"
                    onClick={() => startTimer()}>   
                    <i class="las la-phone"></i> Pickup
                  </div> */}
              </center>
							</div>
						</div>
					</Modal.Body>
				</div>
			</form>
		</Modal>
	)
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
	sendMessage, fetchProperties
};
export default connect(mapStateToProps, mapDispatchToProps)(MakeCall);