import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import AsyncSelect from 'react-select/async';

import { connect } from "react-redux";
import { getUserList } from "../../../stores/messages/actions";
import { fetchProperties } from "../../../stores/properties/actions";
import { sendMessage } from "../../../stores/campaigns/actions"

import makeAnimated from 'react-select/animated';

const SingleMessageModel = (props) => {
	console.log(props);
	const [btnLoading, setBtnLoading] = useState(false);
	const [inputValue, setValue] = useState('');
    const [Countries, setCountries] = useState([]);
	const [selectedValue, setSelectedValue] = useState(null);
	const [state, setState] = useState({
        title: "",
        forward: "",
        text: "",
        voice: "Polly.Joanna",
		prospect: [],
		fromnumber: '+12815246377',
	})
	const handleInputChange = value => {
        setValue(value);
      };
	 // handle selection
	 const handleChange = value => {
        setSelectedValue(value);
		setState({ ...state, prospect: value })

      }
	// load options using API call
	const loadOptions = async (inputValue) => {
		// var users = await props.getUserList(inputValue);
		// var sendArray = [];
		// for (let x of users){
		// 	var numbers = x.value.split(", ");
			
		// 	for(let number of numbers){
		// 		if(number && number.trim() != ''){
		// 			sendArray.push({ ...x, value: number });
		// 		}
		// 	}
		// }
		// return sendArray;
		var sendArray = [];
		for (let x of props.properties){
			
			var numbers = x.contact_no.split(", ");
			
			for(let number of numbers){
				if(number && number.trim() != ''){
					sendArray.push({ ...x, contact_no: number });
				}
			}
		}
		console.log(sendArray);
		setSelectedValue(sendArray);
        return sendArray;
	};
	const reset = () =>{
		setState({
			...state,
			title: "",
			forward: "",
			text: "",
			voice: "Polly.Joanna",
			prospect: [],
			fromnumber: '+12815246377'
		})
		setSelectedValue(null);
	}
	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
            var sendData = state;
            if(selectedValue && selectedValue.length > 0){
                setBtnLoading(true);
                sendData.prospect = selectedValue;
                var data = await props.sendMessage(sendData);
                Swal.fire(`Campaign created successfully`, "", "success").then(() => {
                    reset();
                    props.onHide();
                })
            }else{
                Swal.fire("Please select any number!", "", "error");
            }
			
		} catch (err) {
			console.log(err);
			Swal.fire("Something went wrong", "", "error");
		} finally {
			setBtnLoading(false);
		}
	}


	return (
		<Modal className="modal fade" show={props.visible} centered {...props}>
			<form onSubmit={handleSubmit}>
				<div className="modal-content" style={{ minWidth: "50vw" }}>
					<div className="modal-header">
						<h5 className="modal-title">Add Campaign</h5>
						<Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => props.onHide()}>
							<span>×</span>
						</Button>
					</div>
					<Modal.Body>
						<div className="card">
							<div className="card-body">
								<div className="basic-form">
                                    {/* <div className="form-row">
										<div className="form-group col-md-12">
										<label>Title</label>
                                        <input className="form-control input-default "
                                            placeholder="Title"
                                            required
                                            value={state.title}
                                            onChange={(e) => setState({ ...state, title: e.target.value })} />
										</div>
									</div> */}
									<div className="form-row">
										<div className="form-group col-md-12">
										<label>Select Prospect</label>
										<AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            value={selectedValue}
                                            getOptionLabel={e => `${e.contact_no}`}
                                            getOptionValue={e => `${e.contact_no.replace(/\-/g,'')} `}
                                            loadOptions={loadOptions}
                                            onInputChange={handleInputChange}
                                            onChange={handleChange}
                                            isMulti
                                        />
										{/* <input type="text" className="form-control input-default border" readOnly value={props.property.contact_no} /> */}
										{/* <Select options={Countries} components={animatedComponents} onChange={(e) => setState({ ...state, prospect: e })} isMulti /> */}
										</div>
									</div>

                                    <div className="form-row">
										<div className="form-group col-md-12">
										<label>Press 1 Transfer</label>
                                        <input className="form-control input-default "
                                            placeholder="1510XXXXXXX"
                                            type="text"
                                            required
											pattern="^\d{11,12}$"
                                            value={state.forward}
                                            onChange={(e) => setState({ ...state, forward: e.target.value })} />
										<div className="text-danger mt-2">forward number must be with an international designation for example: 1(for USA number)</div>
										</div>
									</div>

                                    

                                    <div className="form-row">
										<div className="form-group col-md-12" id="autocomplete_box">
										<label>Say Text</label>
                                        <textarea className="form-control input-default "
                                            rows="10"
                                            placeholder="Text to speech"
                                            required
                                            value={state.text}
                                            onChange={(e) => setState({ ...state, text: e.target.value })}>
                                        </textarea>
										</div>
									</div>

                                    <div className="form-row">
										<div className="form-group col-md-12">
										<label>Select Voice</label>
                                        <select className="form-control"
                                            required
                                            value={state.voice} 
                                            onChange={(e) => setState({ ...state, voice: e.target.value })}>
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
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="primary"
							type="submit"
							disabled={btnLoading}
						>
							Create
						</Button>
					</Modal.Footer>
				</div>
			</form>
		</Modal>
	)
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
	sendMessage, fetchProperties, getUserList
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleMessageModel);