import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import AsyncSelect from 'react-select/async';
import { API_URL } from "../../../config";
// import Autocomplete from "./AutoComplete";
//redux
import { connect } from "react-redux";
import { sendMessage, getUserList } from "../../../stores/messages/actions";
import { fetchProperties } from "../../../stores/properties/actions";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const SendMessageModel = (props) => {
    const [inputValue, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
	const [btnLoading, setBtnLoading] = useState(false);
	const [state, setState] = useState({
		message: "",
		prospect: [],
	})	
	// const [aquaticCreatures, setAquaticCreatures] = useState([]);
	// useEffect(() => {
	// 	var sendArray = [];
	// 	for (let x of props.properties){
		
	// 		var numbers = x.contact_no.split(", ");
			
	// 		for(let number of numbers){
	// 			if(number && number.trim() != ''){
	// 				sendArray.push({ label: number, value: number });
	// 			}
	// 		}
	// 	}
	// 	setSelectedValue(sendArray);
	// 	setAquaticCreatures(sendArray);
	// }, [props.properties]);

    const handleInputChange = value => {
        setValue(value);
      };
     
      // handle selection
      const handleChange = value => {
        setSelectedValue(value);

      }
     
      // load options using API call
      const loadOptions = async (inputValue) => {
		var sendArray = [];
		for (let x of props.properties){
			
			var numbers = x.contact_no.split(", ");
			
			for(let number of numbers){
				if(number && number.trim() != ''){
					sendArray.push({ ...x, contact_no: number });
				}
			}
		}
		//console.log(sendArray);
		setSelectedValue(sendArray);
        return sendArray;
      };

    
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
			console.log(selectedValue);
			var sendArray = [];
			for (let x of selectedValue){
				//selectedValue
				var numbers = x.contact_no.split(", ");
				for(let number of numbers){
					if(number && number.trim() != ''){
						console.log(number);
						sendArray.push({
							first_name: x.owner_first_name,
							last_name: x.owner_last_name,
							value: number,
							id: x.id
						});
					}
				}
			}
            //console.log(sendArray);
            if(sendArray && sendArray.length > 0){
                setBtnLoading(true);
                let formData = {To:sendArray,  Message:state.message, From:"+11234567890"}
                var data = await props.sendMessage(formData);
                Swal.fire(`Message send successfully`, "", "success").then(() => {
					setSelectedValue(null);
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
		<Modal className="modal fade" show={props.visible} centered {...props}>
			<form onSubmit={handleSubmit}>
				<div className="modal-content" style={{ minWidth: "50vw" }}>
					<div className="modal-header">
						<h5 className="modal-title">Send Message</h5>
						<Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => props.onHide()}>
							<span>×</span>
						</Button>
					</div>
					<Modal.Body>
						<div className="card">
							<div className="card-body">
								<div className="basic-form">
									<div className="form-row">
										<div className="form-group col-md-12" id="autocomplete_box">
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
										
										{/* <label>Select Prospect</label>
										<Creatable
										value={selectedValue}
										options={aquaticCreatures}
										onChange={handleChange}
										isMulti
										/> */}
										
										</div>
									</div>
									
                                    <div className="form-row">
										<div className="form-group col-md-12" id="autocomplete_box">
										<label>Message</label>
                                        <textarea className="form-control input-default "
                                            rows="10"
                                            placeholder="Message Type Here..."
                                            required
                                            value={state.property_address}
                                            onChange={(e) => setState({ ...state, message: e.target.value })}>

                                        </textarea>
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
							Send Message
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
export default connect(mapStateToProps, mapDispatchToProps)(SendMessageModel);