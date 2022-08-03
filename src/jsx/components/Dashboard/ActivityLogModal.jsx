import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";
import { createActivity, updateActivity } from "../../../stores/properties/actions";

const ActivityLogModal = (props) => {
	console.log(props);
	const [btnLoading, setBtnLoading] = useState(false);
	const [state, setState] = useState({
		activity_type: "",
		relation_to_owner: "",
		on_market: "",
		contact_name: "",
		situation_insight: "",
		note: ""
	})
	const reset = () =>{
		setState({
			...state,
			activity_type: "",
			relation_to_owner: "",
			on_market: "",
			contact_name: "",
			situation_insight: "",
			note: ""
		})
	}
	const downloadFile = (url,sid=0) => {
		fetch(url, {
		method: 'GET',
		headers: {
		'Content-Type': 'audio/mpeg',
		},
	})
  .then((response) => response.blob())
  .then((blob) => {
    // Create blob link to download
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `recording_${sid}.mp3`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  });
	}
	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setBtnLoading(true);
			let formData = new FormData();
			for (let key in state) {
				formData.append(key, state[key]);
			}
			formData.append("property_id", props.property.id);
			if(props.activity?.id){
				formData.append("id", props.activity.id);
				await props.updateActivity(formData, props.property.id);
			}else{
				await props.createActivity(formData, props.property.id);
			}
			reset();
			Swal.fire(`Activity ${props.activity?.id ? "updated": "created"} successfully`, "", "success").then(() => {
				props.onHide();
			})
		} catch (err) {
			Swal.fire("Something went wrong", "", "error");
		} finally {
			setBtnLoading(false);
		}
	}
	useEffect(()=>{
		if(props.activity?.id){
			setState({
				...state,
				activity_type: props.activity.activity_type,
				relation_to_owner: props.activity.relation_to_owner,
				on_market: props.activity.on_market,
				contact_name: props.activity.contact_name,
				situation_insight: props.activity.situation_insight,
				note: props.activity.note
			})
		}else{
			reset();
		}
	}, [props.activity])
	return (
		<Modal className="modal fade" show={props.visible} centered {...props}>
			<form onSubmit={handleSubmit}>
				<div className="modal-content" style={{ minWidth: "50vw" }}>
					<div className="modal-header">
						<h5 className="modal-title">Activity Log</h5>
						<Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => props.onHide()}>
							<span>×</span>
						</Button>
					</div>
					<Modal.Body>
						<div className="card">
							<div className="card-body">
								<div className="basic-form">
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Activity types</label>
											<select
												className="form-control input-default"
												required
												onChange={(e) => setState({
													...state,
													activity_type: e.target.value
												})}
												value={state.activity_type}
											>
												<option value="" selected disabled>Choose...</option>
												<option value="call_out">Call Out</option>
												<option value="call_in">Call In</option>
												<option value="email">Email</option>
												<option value="receive_text">Receive Text</option>
												<option value="recording">Voicemail</option> 
												<option value="text">Text</option>
											</select>
										</div>
										<div className="form-group col-md-6">
											<label>
												{props.activity?.activity_type == 'recording'
												 ? ('caller Name')
												 : ('Contact Name')
											 } </label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Contact Name"
												required
												value={state.contact_name}
												onChange={(e) => setState({ ...state, contact_name: e.target.value })}
											/>
										</div>
									</div>
									{/* <div className="form-row"> */}
									{props.activity?.activity_type == 'receive_text' || props.activity?.activity_type == 'text' || props.activity?.activity_type == 'recording'
										? ('')
										: (<div className="form-row">
												<div className="form-group col-md-6">
													<label>Relationship to owner</label>
													<select
														className="form-control input-default"
														required
														onChange={(e) => setState({
															...state,
															relation_to_owner: e.target.value
														})}
														value={state.relation_to_owner}
													>
														<option value="" selected disabled>Choose...</option>
														<option value="owner">Owner - Authorized Party</option>
														<option value="spouse">Spouse</option>
														<option value="family">Family - Other</option>
														<option value="other">Other - Unknown</option>
													</select>
												</div>
												<div className="form-group col-md-6">
													<label>Situation Insights</label>
													<select
														className="form-control input-default"
														required
														onChange={(e) => setState({
															...state,
															situation_insight: e.target.value
														})}
														value={state.situation_insight}
													>
														<option value="" selected disabled>Choose...</option>
														<option value="foreclosure">Foreclosure</option>
														<option value="probate">Probate</option>
														<option value="other">Other</option>
													</select>
												</div>
											</div>)
									}
										{/* <div className="form-group col-md-6">
											<label>Relationship to owner</label>
											<select
												className="form-control input-default"
												required
												onChange={(e) => setState({
													...state,
													relation_to_owner: e.target.value
												})}
												value={state.relation_to_owner}
											>
												<option value="" selected disabled>Choose...</option>
												<option value="owner">Owner - Authorized Party</option>
												<option value="spouse">Spouse</option>
												<option value="family">Family - Other</option>
												<option value="other">Other - Unknown</option>
											</select>
										</div> */}
										{/* <div className="form-group col-md-6">
											<label>Situation Insights</label>
											<select
												className="form-control input-default"
												required
												onChange={(e) => setState({
													...state,
													situation_insight: e.target.value
												})}
												value={state.situation_insight}
											>
												<option value="" selected disabled>Choose...</option>
												<option value="foreclosure">Foreclosure</option>
												<option value="probate">Probate</option>
												<option value="other">Other</option>
											</select>
										</div> */}
									{/* </div> */}
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>On Market</label>
											<div className="custom-control custom-checkbox pl-2 ml-3">
												<div>
													<input
														type="radio"
														className="custom-control-input"
														id="on_market_1"
														name="on_market"
														onChange={(e) => setState({
															...state,
															on_market: 1
														})}
														checked={state.on_market == 1}
													/>
													<label
														className="custom-control-label"
														htmlFor="on_market_1"
													>Yes</label>
												</div>
												<div>
													<input
														type="radio"
														className="custom-control-input"
														id="on_market_2"
														name="on_market"
														onChange={(e) => setState({
															...state,
															on_market: 0
														})}
														checked={state.on_market == 0}
													/>
													<label
														className="custom-control-label"
														htmlFor="on_market_2"
													>No</label>
												</div>
											</div>
										</div>
										<div className="form-group col-md-6">
											{/* <label>Property Notes</label>
											<textarea
												cols="30"
												rows="10"
												placeholder="Property Notes"
												className="form-control input-default"
												onChange={(e) => setState({
													...state,
													note: e.target.value
												})}
												value={state.note}
											></textarea> */}
											<label>
												{props.activity?.activity_type == 'receive_text' || props.activity?.activity_type == 'text' || props.activity?.activity_type == 'recording'
													? (<span>
														{props.activity?.activity_type == 'recording'
															? ('Voicemail')
															: ('Message')
														}
													</span>)
													: (
														<div>
															{props.activity?.activity_type == 'call_out' || props.activity?.activity_type == 'call_in'
															?(
																<div>
																	<div>
																		{props.activity?.recodingtype == 'callrecording' && props.activity?.note
																		?('Recording')
																		:('')
																		}
																	</div>
																	<div>
																		{props.activity?.recodingtype == 'recording' && props.activity?.note
																		?('Voicemail')
																		:('')
																		}
																		</div>
																</div>

																
															)
															:(
																'Property Notes'
															)
															}
														</div>
													)
												}
											</label>
											{props.activity?.activity_type == 'recording'
												? (<div><audio controls>
													<source src={state.note} type="audio/ogg" />
													<source src={state.note} type="audio/mpeg" />
													Your browser does not support the audio tag.
												  </audio></div>)
												: (
													<div>
														{props.activity?.activity_type == 'call_out' || props.activity?.activity_type == 'call_in'
														?(
															
															<div>
																{props.activity?.recodingtype == 'callrecording' && props.activity?.note
																	?(
																		<div>
																			<audio controls>
																				<source src={state.note} type="audio/ogg" />
																				<source src={state.note} type="audio/mpeg" />
																				Your browser does not support the audio tag.
																			</audio>
																			<a
																				href="javascript:void(0)"
																				onClick={() => downloadFile(state.note, props.activity?.id)}
																				className="btn btn-outline-primary d-block rounded mb-2"
																			>
																				<i className="las la-download scale5 mr-2" />
																				Download
																			</a>
																		</div>
																	)
																	:('')
																}

																{props.activity?.recodingtype == 'recording' && props.activity?.note
																	?(
																		<div>
																			<audio controls>
																				<source src={state.note} type="audio/ogg" />
																				<source src={state.note} type="audio/mpeg" />
																				Your browser does not support the audio tag.
																			</audio>
																			{/* <button className="btn btn-primary">Download</button> */}
																			<a
																				href="javascript:void(0)"
																				onClick={() => downloadFile(state.note, props.activity?.id)}
																				className="btn btn-outline-primary d-block rounded mb-2"
																			>
																				<i className="las la-download scale5 mr-2" />
																				Download
																			</a>
																		</div>
																	)
																	:('')
																}
															</div>
														)
														:(<textarea
																cols="30"
																rows="10"
																placeholder="Property Notes"
																className="form-control input-default"
																onChange={(e) => setState({
																	...state,
																	note: e.target.value
																})}
																value={state.note}
															></textarea>)
														}
													</div>
												)
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						{props.activity?.activity_type == 'receive_text' || props.activity?.activity_type == 'text' || props.activity?.activity_type == 'recording'
						? ('')
						: (<Button
							variant="primary"
							type="submit"
							disabled={btnLoading}
						>
							{props.activity?.id ? "Update" : "Submit"}
						</Button>)
						}	
						{/* <Button
							variant="primary"
							type="submit"
							disabled={btnLoading}
						>
							{props.activity?.id ? "Update" : "Submit"}
						</Button> */}
					</Modal.Footer>
				</div>
			</form>
		</Modal>
	)
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
	createActivity,
	updateActivity
};
export default connect(mapStateToProps, mapDispatchToProps)(ActivityLogModal);