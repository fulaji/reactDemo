import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import AsyncSelect from 'react-select/async';
import Creatable from 'react-select/creatable';
// import Autocomplete from "./AutoComplete";
//redux
import { connect } from "react-redux";
import { sendMessage } from "../../../stores/messages/actions";
import { fetchProperties } from "../../../stores/properties/actions";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const SingleMessageModel = (props) => {
	const [aquaticCreatures, setAquaticCreatures] = useState([]);
	const [btnLoading, setBtnLoading] = useState(false);
	const [inputValue, setValue] = useState('');
    const [Countries, setCountries] = useState([]);
	const [loadNumberValue, setLoadNumberValue] = useState(false);
	const [selectedValue, setSelectedValue] = useState(null);
	const [state, setState] = useState({
		message: "",
		prospect: [],
	})
	useEffect(() => {
		//setLoadNumberValue
		//if(!loadNumberValue){
			// console.log("props.property");
			// console.log(props.property);
			// setLoadNumberValue(true);
		if(props.property.contact_no !== undefined){
			var sendArray = [];
			var numbers = props.property.contact_no.split(", ");
			var sendArray = [];
			for(let number of numbers){
				if(number && number.trim() != ''){
					sendArray.push({id:props.property.id, label: `${number}`, first_name:props.property.owner_first_name, last_name:props.property.owner_last_name , value: `${number.replace(/\-/g,'')}` });	
				}
			}
			setSelectedValue(sendArray);
			setAquaticCreatures(sendArray);
		}
		//}
	}, [props.property]);
    // useEffect(() => {
    //     if (Countries?.length <= 0 && props.property && props.property.contact_no) {
    //         setCountries([
    //             { label: `${props.property.contact_no}`, first_name:props.property.owner_first_name, last_name:props.property.owner_last_name , value: `${props.property.contact_no.replace(/\-/g,'')}` },
    //         ]);
    //     }
    // })
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
		var numbers = props.property.contact_no.split(", ");
		var sendArray = [];
		for(let number of numbers){
			if(number && number.trim() != ''){
				sendArray.push({id:props.property.id, label: `${number}`, first_name:props.property.owner_first_name, last_name:props.property.owner_last_name , value: `${number.replace(/\-/g,'')}` });	
			}
		}
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
            console.log(state.prospect);
            if(selectedValue.length > 0){
				// var numbers = props.property.contact_no.split(", ");
				// var sendArray = [];
				// for(let number of selectedValue){
				// 	if(number && number.trim() != ''){
				// 		sendArray.push({id:props.property.id, label: `${number}`, first_name:props.property.owner_first_name, last_name:props.property.owner_last_name , value: `${number.replace(/\-/g,'')}` });	
				// 	}
				// }
                setBtnLoading(true);
                let formData = {To:selectedValue,  Message:state.message, From:"+11234567890"}
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
										<div className="form-group col-md-12">
										
										<label>Select Prospect</label>
										{/* <Creatable
										value={selectedValue}
										options={aquaticCreatures}
										onChange={handleChange}
										isMulti
										/> */}
										
										<label>Select Prospect</label>
										<AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            value={selectedValue}
                                            getOptionLabel={e => `${e.value}`}
                                            getOptionValue={e => `${e.value.replace(/\-/g,'')} `}
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
	sendMessage, fetchProperties
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleMessageModel);