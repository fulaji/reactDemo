import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Autocomplete from "./AutoComplete";
//redux
import { connect } from "react-redux";
import { createProperty } from "../../../stores/properties/actions";

const AddProspectModal = (props) => {
	const [btnLoading, setBtnLoading] = useState(false);
	const [state, setState] = useState({
		property_address: "",
		firstName: "",
		lastName: "",
		phone: "",
		city: "",
		country: "",
		postalCode: "",
		state: "",
		streetNumber: "",
		route: ""
	})
	const reset = () =>{
		setState({
			...state,
			property_address: "",
			firstName: "",
			lastName: "",
			phone: "",
			city: "",
			country: "",
			postalCode: "",
			state: "",
			streetNumber: "",
			route: ""
		})
	}
	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setBtnLoading(true);
			let formData = new FormData();
			formData.append("address", `${state.streetNumber} ${state.route}`);
			formData.append("city", state.city);
			formData.append("state", state.state);
			formData.append("zip", state.postalCode);
			formData.append("first_name", state.firstName);
			formData.append("last_name", state.lastName);
			formData.append("phone", state.phone);

			await props.createProperty(formData);
			Swal.fire(`Property created successfully`, "", "success").then(() => {
				reset();
				props.onHide();
			})

			
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
						<h5 className="modal-title">Add Prospect</h5>
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
										<label>Property Address</label>
										<Autocomplete
											className="input"
											onSelect={(value) => {
											  setState({ ...state, city: value?.city, state: value?.state, postalCode: value?.postalCode, country: value?.country, property_address: value?.street_address, streetNumber: value?.streetNumber, route: value?.route })
											}}
											value={state.property_address}
											onChange={(value) => setState({ ...state, property_address: value })}
											placeholder="Property Address"
										/>
											{/* <input
												type="text"
												className="form-control input-default "
												placeholder="Property Address"
												required
												value={state.property_address}
												onChange={(e) => setState({ ...state, property_address: e.target.value })}
											/> */}
											
										</div>
									</div>
									<div className="form-row">
									<div className="form-group col-md-6">
											<label>First Name</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="First Name"
												value={state.firstName}
												onChange={(e) => setState({ ...state, firstName: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Last Name</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Last Name"
												value={state.lastName}
												onChange={(e) => setState({ ...state, lastName: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-12">
										<label>Phone</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Phone"
												value={state.phone}
												onChange={(e) => setState({ ...state, phone: e.target.value })}
											/>
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
							Submit
						</Button>
					</Modal.Footer>
				</div>
			</form>
		</Modal>
	)
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
	createProperty
};
export default connect(mapStateToProps, mapDispatchToProps)(AddProspectModal);