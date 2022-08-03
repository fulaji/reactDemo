import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
// import BasicDatatable from "../table/BasicDatatable";
import MessageDatatable from '../table/MessageDatatable';
import Swal from "sweetalert2";
import { createProperty, fetchPropertyDetail, fetchMediaDetail } from "../../../stores/ivrs/actions";
//redux
import { connect } from "react-redux";
import DaySettingIvr from './DaySettingIvr'

import "./style.css";
function IvrIndex(props) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [mediaFile, setMediaFile] = useState();
  const [getIvr, setGetIvr] = useState(false);
  const [medias, setMedias] = useState(false);

  useEffect(async () => {
    if (!getIvr) {
      setGetIvr(true)
      var ivr = await props.fetchPropertyDetail();
      var mediass = await props.fetchMediaDetail();
      setMedias(mediass)
      if(ivr){
        setIvr(ivr);
      } 
    }
  })
  const [state, setState] = useState({
		greeting: false,
		greeting_type: "text_to_speech",
    greeting_text: "",
    greeting_text_voice: 'Polly.Ivy',
		use_previously_greetings: false,
    greeting_audio: "",
    media_title: "",
    media: null,
    forward_status: false,
    forward_number: '',
    off_hours_status: false,
    off_hours_number: '',

    voicemail: false,
		voicemail_type: "text_to_speech",
    voicemail_text: "",
    voicemail_text_voice: 'Polly.Ivy',
		use_previously_voicemail: false,
    voicemail_audio: "",
    voicemail_media_title: "",
    voicemail_media: null,
    office_hours: [
      {day: "Monday", intime: '', outtime: '', status: false },
      {day: "Tuesday", intime: '', outtime: '', status: false },
      {day: "Wednesday", intime: '', outtime: '', status: false },
      {day: "Thursday", intime: '', outtime: '', status: false },
      {day: "Friday", intime: '', outtime: '', status: false },
      {day: "Saturday", intime: '', outtime: '', status: false },
      {day: "Sunday", intime: '', outtime: '', status: false },
    ]
	})

  const setIvr = (ivr) => {
    if(ivr.greeting == 'true'){
      ivr.greeting = true
      if(ivr.greeting_type == 'audio'){
        ivr.use_previously_greetings = true
      }
    }else{
      ivr.greeting = false
    }

    if(ivr.forward_status == 'true'){
      ivr.forward_status = true
    }else{
      ivr.forward_status = false
    }

    if(ivr.off_hours_status == 'true'){
      ivr.off_hours_status = true
    }else{
      ivr.off_hours_status = false
    }

    if(ivr.voicemail == 'true'){
      ivr.voicemail = true
      if(ivr.voicemail_type == 'audio'){
        ivr.use_previously_voicemail = true

      }
    }else{
      ivr.voicemail = false
    }

    ivr.office_hours = JSON.parse(ivr.office_hours)
    console.log(ivr.office_hours);
    setState(ivr);
  }

  const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setBtnLoading(true);

      if(state.greeting){
        console.log(state.greeting_type)
        if(state.greeting_type == 'text_to_speech'){
          if(state.greeting_text.trim() == ''){
            Swal.fire("Greeting Text is required", "", "error");
            setBtnLoading(false);
            return;
          }
        }else{
          if(state.use_previously_greetings){
            if(state.greeting_audio == ''){
              Swal.fire("Media is required", "", "error");
              setBtnLoading(false);
              return;
            }
          }else{
            if(state.media_title.trim() == ''){
              Swal.fire("Media title is required", "", "error");
              setBtnLoading(false);
              return;
            }
            if(!state.media){
              Swal.fire("Media is required", "", "error");
              setBtnLoading(false);
              return;
            }
            
          }
        }
      }
      if(state.forward_status && state.forward_number == ''){
        Swal.fire("Forward number is required", "", "error");
        setBtnLoading(false);
        return;
      }

      if(state.off_hours_status && state.off_hours_number == ''){
        Swal.fire("Forward number is required", "", "error");
        setBtnLoading(false);
        return;
      }

      if(state.voicemail){
        if(state.voicemail_type == 'text_to_speech'){
          if(state.voicemail_text.trim() == ''){
            Swal.fire("Voicemail Text is required", "", "error");
            setBtnLoading(false);
            return;
          }
        }else{
          if(state.use_previously_voicemail){
            if(state.voicemail_audio == ''){
              Swal.fire("Media is required", "", "error");
              setBtnLoading(false);
              return;
            }
          }else{
            if(state.voicemail_media_title.trim() != ''){
              Swal.fire("Voicemail Media title is required", "", "error");
              setBtnLoading(false);
              return;
            }
            if(!state.voicemail_media){
              Swal.fire("Voicemail Audio is required", "", "error");
              setBtnLoading(false);
              return;
            }
            
          }
        }
      }
      for(let x of state.office_hours){
        if(x.status){
          if(x.intime == '' || x.outtime == ''){
            Swal.fire("Start Time or End Time is required", "", "error");
            setBtnLoading(false);
            return;
          }
          var intime = new Date(`1/31/2011  ${x.intime}`);
          var outtime = new Date(`1/31/2011  ${x.outtime}`);
          if(intime.getTime() > outtime.getTime()){
            Swal.fire("Please enter valid End Time", "", "error");
            setBtnLoading(false);
            return;
          }
        }
      }
      // Swal.fire("Form submited", "", "success");
      // setBtnLoading(false);
      // return;

			let formData = new FormData();
			formData.append("greeting", `${state.greeting}`);
			formData.append("greeting_type", state.greeting_type);
			formData.append("greeting_text", state.greeting_text);
			formData.append("use_previously_greetings", state.use_previously_greetings);
			formData.append("greeting_audio", state.greeting_audio);
			formData.append("media_title", state.media_title);
			formData.append("media", state.media);

      formData.append("forward_status", `${state.forward_status}`);
			formData.append("forward_number", state.forward_number);
			formData.append("off_hours_status", state.off_hours_status);
			formData.append("off_hours_number", state.off_hours_number);
			formData.append("voicemail", state.voicemail);
			formData.append("voicemail_type", state.voicemail_type);
			formData.append("voicemail_text", state.voicemail_text);

      formData.append("use_previously_voicemail", `${state.use_previously_voicemail}`);
			formData.append("voicemail_audio", state.voicemail_audio);
			formData.append("voicemail_media_title", state.voicemail_media_title);
			formData.append("voicemail_media", state.voicemail_media);
      formData.append("office_hours",  JSON.stringify(state.office_hours));

      formData.append("voicemail_text_voice", state.voicemail_text_voice);
      formData.append("greeting_text_voice",  state.greeting_text_voice);
      

			await props.createProperty(formData);
			Swal.fire(`IVr saved successfully`, "", "success").then(() => {
				
			})

			
		} catch (err) {
      console.log(err)
			Swal.fire("Something went wrong", "", "error");
		} finally {
			setBtnLoading(false);
		}
	}

  const handleChangeChk = (chkValue) => {
    console.log(chkValue.target.checked)
    setState({ ...state, greeting: chkValue.target.checked })
    console.log(state)
  }

  const handleChangeChkForward = (chkValue) => {
    setState({ ...state, forward_status: chkValue.target.checked })
  }

  
  const handleChangeUsePreviously = (chkValue) => {
    console.log(chkValue.target.checked)
    setState({ ...state, use_previously_greetings: chkValue.target.checked })
    console.log(state)
  }

  const updateDaySetting = (data, i) => {
    console.log(data);
    console.log(i);
    var office_hours = state.office_hours;
    office_hours[i] = data;
    setState({ ...state, office_hours: office_hours })
    console.log(state.office_hours);
  }
  return (
    <>
      <div className='form-head page-titles d-flex  align-items-center'>
        <div className='mr-auto  d-lg-block'>
          <h2 className='text-black font-w600'>Phone Switch</h2>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item active'>
              <Link to='/order-list'>Dashboard</Link>
            </li>
            <li className='breadcrumb-item'>
              <Link to='/ivr'>Phone Switch</Link>
            </li>
          </ol>
        </div>
        {/* <div className='btn btn-primary rounded light mr-3'>
          Refresh
        </div> */}
      </div>
      <div className='row'>
        
        <div className='col-xl-12'>
          
        <div className=" m-b-20">
						<div className="">
						   	<div className="setpadd"> 
				                <div className="listgrid text-center">
				                	<form  id="add_number_form" method="post" enctype="multipart/form-data" onSubmit={handleSubmit}>
					                    <div className="forwardmidd bg-white shadow-lg">
					                        <div className="tab-content mt-2 ">
					                            <div role="tabpanel" className="tab-pane text-center active" id="tabbs1">
					                                <div className="tabbox">
					                                	<h5 className="tabboxtitle mb-3">Phone Switch</h5>
                                            <ul className="nav nav-tabs forwardtab" role="tablist"></ul>

                                              {/* ==============================greeting option==========================================   */}
					                                	  <div className="box greetings">
					                                    	<div className="boximg">
                                                    <div class="img pr-2">
                                                      <i class="las la-bullhorn fa-4x"></i>
                                                    </div>
                                                    
					                                            <div className="text1">&nbsp; &nbsp;GREET CALLER</div>
					                                            <div className="text2">&nbsp;&nbsp;&nbsp;&nbsp;Play a greetings message to the caller.</div>
					                                        </div>
                                                  <div className="float-right">
					                                            <label className="switch">
					                                              <span className="greetext2">Greet Caller
                                                        {state.greeting
                                                          ? ' on'
                                                          : ' off'
                                                        } 
                                                        </span>
					                                              {/* <input type="checkbox" name="voice_mail_status" onChange={(e) => setState({ ...state, greeting: e.target.value })}/> */}
					                                              <input type="checkbox" name="voice_mail_status" checked={state.greeting} onChange={(e) => handleChangeChk(e)}/>
                                                        <span className="slider"></span>
					                                            </label>
					                                        </div>
                                                  {state.greeting
                                                    ? (<div className="greetbox greetbox">
                                                        <div className="choose" id="chooseforvoice">
                                                              <div className="form-group">
                                                                  <label className="font-w400">Greeting type</label>
                                                                  <select className="form-control" name="greeting_type" value={state.greeting_type} onChange={(e) => setState({ ...state, greeting_type: e.target.value })}>
                                                                    <option value="text_to_speech">Text to speech</option>
                                                                    <option value="audio">Audio</option>
                                                                  </select>
                                                              </div>
                                                          </div>
                                                        
                                                        {state.greeting_type == 'audio'
                                                          ? (<div className="audio_class">
                                                              <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={state.use_previously_greetings} onChange={(e) => handleChangeUsePreviously(e)}/>
                                                                <label class="form-check-label" for="flexCheckDefault">
                                                                  Use previously recorded greetings?
                                                                </label>
                                                              </div>
                                                              { state.use_previously_greetings  
                                                                ? ( <div className="choose" id="choose1" >
                                                                        <div className="form-group">
                                                                            <label className="font-w400">Choose Previous Media</label>
                                                                            <select className="form-control" name="greetings" required value={state.greeting_audio} onChange={(e) => setState({ ...state, greeting_audio: e.target.value })}>
                                                                            {medias.map((object, i) => <option value={object.media}>{object.title}</option>)} 
                                                                            </select>
                                                                        </div>
                                                                    </div> )
                                                                : (<div className="upload" id="upload1">
                                                                      <div className="form-group">
                                                                            <label className="font-w400">Media Title</label>
                                                                            <input type="text" className="form-control" name="media_title"  value={state.media_title} onChange={(e) => setState({ ...state, media_title: e.target.value })} 
                                                                            required
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="font-w400">Upload New Recording</label>
                                                                            <div className="uploadiv">
                                                                                Select audio file. Only .mp3 file allowed.
                                                                                <input type="file" className="form-control" name="greetings_media"
                                                                                required
                                                                              data-bv-notempty-message="The greeting media is required"
                                                                              data-bv-file="true"
                                                                              data-bv-file-extension="mp3"
                                                                              data-bv-file-message="Please upload only mp3 file. "
                                                                              accept=".mp3" onChange={(e) => setState({ ...state, media: e.target.files[0] })} />
                                                                                <span className="browse">Browse File</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>)     
                                                                }
                                                              </div>)

                                                          :(<div className='text_class'>
                                                              <div>
                                                                  <div className="form-group">
                                                                      <label className="font-w400">Text</label>
                                                                      <textarea className="form-control" placeholder='Enter Text here...' required value={state.greeting_text} onChange={(e) => setState({ ...state, greeting_text: e.target.value })}></textarea>
                                                                  </div>
                                                              </div>

                                                              <div className="form-row">
                                                                <div className="form-group col-md-12">
                                                                  <label>Select Voice</label>
                                                                  <select className="form-control"
                                                                      required
                                                                      value={state.greeting_text_voice} 
                                                                      onChange={(e) => setState({ ...state, greeting_text_voice: e.target.value })}>
                                                                          <option value="Polly.Ivy">Polly.Ivy</option>
                                                                          <option value="Polly.Joanna">Polly.Joanna</option>
                                                                          <option value="Polly.Kendra">Polly.Kendra</option>
                                                                          <option value="Polly.Kimberly">Polly.Kimberly</option>
                                                                          <option value="Polly.Salli">Polly.Salli</option>
                                                                          <option value="Polly.Joey">Polly.Joey</option>
                                                                          <option value="Polly.Justin">Polly.Justin</option>
                                                                          <option value="Polly.Kevin">Polly.Kevin</option>
                                                                          <option value="Polly.Matthew">Polly.Matthew</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                            </div>)
                                                        }
                                                      </div> )
                                                    : ('')
                                                  }
					                                    </div>
                                              {/* ==============================greeting option==========================================   */}

                                              {/* ==============================forward option==========================================   */}
                                              <div className="box greetings">
					                                    	<div className="boximg">
                                                    <div class="img">
                                                      <i class="las la-phone-volume fa-4x"></i>
                                                    </div>
                                                    
					                                            <div className="text1">&nbsp;&nbsp; FORWARDING </div>
					                                            <div className="text2">&nbsp;&nbsp;&nbsp;&nbsp;Calls will be forwarded to a single number.</div>
					                                        </div>
                                                  <div className="float-right">
					                                            <label className="switch">
					                                              <span className="greetext2">Forwarding 
                                                        {state.forward_status
                                                          ? ' on'
                                                          : ' off'
                                                        } </span>
					                                              {/* <input type="checkbox" name="voice_mail_status" onChange={(e) => setState({ ...state, greeting: e.target.value })}/> */}
					                                              <input type="checkbox" name="voice_mail_status" checked={state.forward_status} onChange={(e) => handleChangeChkForward(e)}/>
                                                        <span className="slider"></span>
					                                            </label>
					                                        </div>
                                                  {state.forward_status
                                                    ? (<div className="form-group ">
                                                    <div className="row">
                                                      <div className="col-md-8">
                                                            <label className="font-w400">Forward number</label>
                                                            <input type="number" name="forward_number" className="form-control" placeholder="Forward number" value={state.forward_number}  onChange={(e) => setState({ ...state, forward_number: e.target.value })}
                                                            required />
                                                          </div>
                                                        
                                                      </div>
                                                    </div> )
                                                    : ('')
                                                  }
					                                    </div>
                                              {/* ==============================forward option==========================================   */}

                                              {/*===============================office hours========================================= */}
                                              <div className="box greetings">
					                                    	<div className="boximg">
                                                    <div class="img pr-2">
                                                      <i class="las la-cog fa-4x"></i>
                                                    </div>
                                                    <div className="text1">&nbsp;&nbsp;OFFICE HOURS</div>
					                                          <div className="text2">&nbsp;&nbsp;&nbsp;setting of office hours</div>
					                                        </div>
                                                  {/* {state.office_hours.map(function(object, i){
                                                      (<DaySettingIvr obj={object} onHide={(e)=>updateDaySetting(e, i)} key={i} />)

                                                  })} */}
                                                  {state.office_hours.map((object, i) => <DaySettingIvr object={object} onHide={(e)=>updateDaySetting(e, i)} key={i} />)}
					                                    </div>
                                              {/*===============================office hours========================================= */}
                                              

                                              {/* ==============================off hours setting==========================================   */}
                                              <div className="box greetings">
					                                    	<div className="boximg">
                                                    <div class="img">
                                                      <i class="las la-power-off fa-4x"></i> 
                                                    </div>
                                                    <div className="text1">&nbsp;&nbsp; OFF HOURS SETTING </div>
                                                    <div className="text2">&nbsp;&nbsp;&nbsp;&nbsp;Calls will be forwarded to a single number.</div>
					                                        </div>
                                                  <div className="float-right">
					                                            <label className="switch">
					                                              <span className="greetext2">Status 
                                                        {state.off_hours_status
                                                          ? ' on'
                                                          : ' off'
                                                        } </span>
					                                              {/* <input type="checkbox" name="voice_mail_status" onChange={(e) => setState({ ...state, greeting: e.target.value })}/> */}
					                                              <input type="checkbox" name="voice_mail_status" checked={state.off_hours_status} onChange={(e) => setState({ ...state, off_hours_status: e.target.checked })} />
                                                        <span className="slider"></span>
					                                            </label>
					                                        </div>
                                                  {state.off_hours_status
                                                    ? (<div className="form-group ">
                                                    <div className="row">
                                                      <div className="col-md-8">
                                                            <label className="font-w400">Forward number</label>
                                                            <input type="number" name="single_forward_number" className="form-control" placeholder="Forward number" 
                                                            required value={state.off_hours_number} onChange={(e) => setState({ ...state, off_hours_number: e.target.value })} />
                                                          </div>
                                                        
                                                      </div>
                                                    </div> )
                                                    : ('')
                                                  }
					                                    </div>
                                              {/* ==============================off hours setting==========================================   */}
                                              
                                              {/*===============================voicemail option========================================= */}
                                              <div className="box greetings">
					                                    	<div className="boximg">
                                                    <div class="img pr-2">
                                                      <i class="las la-microphone fa-4x"></i>
                                                    </div>
                                                    <div className="text1">VOICEMAIL</div>
					                                          <div className="text2">When the recording script is received, send a voice mail</div>
					                                        </div>
                                                  <div className="float-right">
					                                            <label className="switch">
					                                              <span className="greetext2">Voicemail
                                                        {state.voicemail
                                                          ? ' on'
                                                          : ' off'
                                                        } 
                                                        </span>
					                                              {/* <input type="checkbox" name="voice_mail_status" onChange={(e) => setState({ ...state, greeting: e.target.value })}/> */}
					                                              <input type="checkbox" name="voice_mail_status" checked={state.voicemail} onChange={(e) => setState({ ...state, voicemail: e.target.checked })}/>
                                                        <span className="slider"></span>
					                                            </label>
					                                        </div>
                                                  {state.voicemail
                                                    ? (<div className="greetbox greetbox">
                                                        <div className="choose" id="chooseforvoice">
                                                              <div className="form-group">
                                                                  <label className="font-w400">Voicemail type</label>
                                                                  <select className="form-control" name="greeting_type" value={state.voicemail_type} onChange={(e) => setState({ ...state, voicemail_type: e.target.value })}>
                                                                    <option value="text_to_speech">Text to speech</option>
                                                                    <option value="audio">Audio</option>
                                                                  </select>
                                                              </div>
                                                          </div>
                                                        
                                                        {state.voicemail_type == 'audio'
                                                          ? (<div className="audio_class">
                                                              <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" checked={state.use_previously_voicemail} value="" id="flexCheckDefault2" onChange={(e) => setState({ ...state, use_previously_voicemail: e.target.checked })} />
                                                                <label class="form-check-label" for="flexCheckDefault2">
                                                                  Use previously recorded audio?
                                                                </label>
                                                              </div>
                                                              { state.use_previously_voicemail  
                                                                ? ( <div className="choose" id="choose1" >
                                                                        <div className="form-group">
                                                                            <label className="font-w400">Choose Previous Audio</label>
                                                                            <select className="form-control" name="greetings" id="greetings" value={state.voicemail_audio} onChange={(e) => setState({ ...state, voicemail_audio: e.target.value })}>
                                                                              {medias.map((object, i) => <option value={object.media}>{object.title}</option>)}
                                                                            </select>
                                                                        </div>
                                                                    </div> )
                                                                : (<div className="upload" id="upload1">
                                                                      <div className="form-group">
                                                                            <label className="font-w400">Media Title</label>
                                                                            <input type="text" className="form-control" name="media_title"  value={state.voicemail_media_title} onChange={(e) => setState({ ...state, voicemail_media_title: e.target.value })} 
                                                                            required
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label className="font-w400">Upload New Audio</label>
                                                                            <div className="uploadiv">
                                                                                Select audio file. Only .mp3 file allowed.
                                                                                <input type="file" className="form-control" name="greetings_media" 
                                                                                required
                                                                              accept=".mp3" onChange={(e) => setState({ ...state, voicemail_media: e.target.files[0] })} />
                                                                                <span className="browse">Browse File</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>)     
                                                                }
                                                              </div>)

                                                          :(<div className='text_class'>
                                                              <div>
                                                                  <div className="form-group">
                                                                      <label className="font-w400">Text</label>
                                                                      <textarea className="form-control" placeholder='Enter Text here...' value={state.voicemail_text} onChange={(e) => setState({ ...state, voicemail_text: e.target.value })} required></textarea>
                                                                  </div>
                                                                  <div className="form-row">
                                                                <div className="form-group col-md-12">
                                                                  <label>Select Voice</label>
                                                                  <select className="form-control"
                                                                      required
                                                                      value={state.voicemail_text_voice} 
                                                                      onChange={(e) => setState({ ...state, voicemail_text_voice: e.target.value })}>
                                                                          <option value="Polly.Ivy">Polly.Ivy</option>
                                                                          <option value="Polly.Joanna">Polly.Joanna</option>
                                                                          <option value="Polly.Kendra">Polly.Kendra</option>
                                                                          <option value="Polly.Kimberly">Polly.Kimberly</option>
                                                                          <option value="Polly.Salli">Polly.Salli</option>
                                                                          <option value="Polly.Joey">Polly.Joey</option>
                                                                          <option value="Polly.Justin">Polly.Justin</option>
                                                                          <option value="Polly.Kevin">Polly.Kevin</option>
                                                                          <option value="Polly.Matthew">Polly.Matthew</option>
                                                                  </select>
                                                                </div>
                                                              </div>
                                                              </div>
                                                            </div>)
                                                        }
                                                      </div> )
                                                    : ('')
                                                  }
					                                    </div>
                                              {/*===============================voicemail option========================================= */}
                                              
					                                </div>
					                            </div>
					                        </div>
                                  <div className="forwardmidd_btn">
                                      <button className="btn btn-success" type="submit" disabled={btnLoading}>
                                        Save 
                                      </button>
                                  </div>
					                    </div>
					                    
					                </form>
				                </div>
				    		</div>
						</div>
					</div>
          
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state) => ({
  ivr: state.ivrs.property,
});
const mapDispatchToProps = {
  createProperty,
  fetchPropertyDetail,
  fetchMediaDetail
};
export default connect(mapStateToProps, mapDispatchToProps)(IvrIndex);