import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";
import { updateProperty } from "../../../stores/properties/actions";
const EditProperty = (props) => {
	const [state, setState] = useState({
		"radar_id": "",
		"apn": "",
		"county": "",
		"address": "",
		"city": "",
		"state": "",
		"zip": "",
		"owner": "",
		"owner_first_name": "",
		"owner_last_name": "",
		"owner_spouse_name": "",
		"owner2": "",
		"owner_address": "",
		"owner_city": "",
		"owner_state": "",
		"owner_zip": "",
		"primary_residence": "",
		"property_type": "",
		"units": "",
		"sqft": "",
		"year_built": "",
		"beds": "",
		"baths": "",
		"lot_size": "",
		"pool": "",
		"stories": "",
		"estimated_value": "",
		"estimated_total_loan_balance": "",
		"assessed_value": "",
		"assessed_year": "",
		"annual_taxes": "",
		"forecloser_stage": "",
		"recording_date": "",
		"trustee": "",
		"trustee_sale_num": "",
		"trustee_phone": "",
		"sale_date": "",
		"sale_time": "",
		"sale_place": "",
		"postponement_reason": "",
		"published_bid": "",
		"opening_bid": "",
		"winning_bid": "",
		"default_amount": "",
		"default_as_of": "",
		"fc_estimated_loan_position": "",
		"fc_loan_date": "",
		"fc_loan_doc_num": "",
		"fc_loan_amount": "",
		"fc_loan_lender_name": "",
		"first_loan_lender": "",
		"first_loan_date": "",
		"first_loan_amount": "",
		"second_loan_lender": "",
		"second_loan_date": "",
		"second_loan_amount": "",
		"listed_for_sale": "",
		"listing_price": "",
		"forecasting_stage": ""
	})
	const [btnLoading, setBtnLoading] = useState(false);
	const handleUpdateProperty = async (e) => {
		try {
			e.preventDefault();
			setBtnLoading(true);

			let formData = new FormData();
			for (let key in state) {
				formData.append(key, state[key]);
			}
			formData.append("id", props.property.id);
			await props.updateProperty(formData, { ...state, id: props.property.id, source: props.property.source });
			await Swal.fire("Property updated successfully!", "", "success")
			props.onHide();
		} catch (err) {
			Swal.fire("Something went wrong!", "", "error")
		} finally {
			setBtnLoading(false);
		}
	}
	useEffect(() => {
		if (props.property?.id) {
			setState({
				"radar_id": props.property.radar_id,
				"apn": props.property.apn,
				"county": props.property.county,
				"address": props.property.address,
				"city": props.property.city,
				"state": props.property.state,
				"zip": props.property.zip,
				"owner": props.property.owner,
				"owner_first_name": props.property.owner_first_name,
				"owner_last_name": props.property.owner_last_name,
				"owner_spouse_name": props.property.owner_spouse_name,
				"owner2": props.property.owner2,
				"owner_address": props.property.owner_address,
				"owner_city": props.property.owner_city,
				"owner_state": props.property.owner_state,
				"owner_zip": props.property.owner_zip,
				"primary_residence": props.property.primary_residence,
				"property_type": props.property.property_type,
				"units": props.property.units,
				"sqft": props.property.sqft,
				"year_built": props.property.year_built,
				"beds": props.property.beds,
				"baths": props.property.baths,
				"lot_size": props.property.lot_size,
				"pool": props.property.pool,
				"stories": props.property.stories,
				"estimated_value": props.property.estimated_value,
				"estimated_total_loan_balance": props.property.estimated_total_loan_balance,
				"assessed_value": props.property.assessed_value,
				"assessed_year": props.property.assessed_year,
				"annual_taxes": props.property.annual_taxes,
				"forecloser_stage": props.property.forecloser_stage,
				"recording_date": props.property.recording_date,
				"trustee": props.property.trustee,
				"trustee_sale_num": props.property.trustee_sale_num,
				"trustee_phone": props.property.trustee_phone,
				"sale_date": props.property.sale_date,
				"sale_time": props.property.sale_time,
				"sale_place": props.property.sale_place,
				"postponement_reason": props.property.postponement_reason,
				"published_bid": props.property.published_bid,
				"opening_bid": props.property.opening_bid,
				"winning_bid": props.property.winning_bid,
				"default_amount": props.property.default_amount,
				"default_as_of": props.property.default_as_of,
				"fc_estimated_loan_position": props.property.fc_estimated_loan_position,
				"fc_loan_date": props.property.fc_loan_date,
				"fc_loan_doc_num": props.property.fc_loan_doc_num,
				"fc_loan_amount": props.property.fc_loan_amount,
				"fc_loan_lender_name": props.property.fc_loan_lender_name,
				"first_loan_lender": props.property.first_loan_lender,
				"first_loan_date": props.property.first_loan_date,
				"first_loan_amount": props.property.first_loan_amount,
				"second_loan_lender": props.property.second_loan_lender,
				"second_loan_date": props.property.second_loan_date,
				"second_loan_amount": props.property.second_loan_amount,
				"listed_for_sale": props.property.listed_for_sale,
				"listing_price": props.property.listing_price,
				"forecasting_stage": props.property.forecasting_stage,
			})
		}
	}, [props.property])
	return (
		<Modal className="modal fade" show={props.visible} centered {...props}>
			<form onSubmit={handleUpdateProperty}>
				<div className="modal-content" style={{ minWidth: "50vw" }}>
					<div className="modal-header">
						<h5 className="modal-title">Edit Property Details</h5>
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
											<label>Property address</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Property address"
												value={state.address}
												onChange={(e) => setState({ ...state, address: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>City</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="City"
												value={state.city}
												onChange={(e) => setState({ ...state, city: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>State</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="State"
												value={state.state}
												onChange={(e) => setState({ ...state, state: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Zip</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Zip"
												value={state.zip}
												onChange={(e) => setState({ ...state, zip: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>County</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="County"
												value={state.county}
												onChange={(e) => setState({ ...state, county: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Sale Date</label>
											<input
												type="date"
												className="form-control input-default "
												placeholder="Sale Date"
												value={state.sale_date}
												onChange={(e) => setState({ ...state, sale_date: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Sale Time</label>
											<input
												type="time"
												className="form-control input-default "
												placeholder="Sale Time"
												value={state.sale_time}
												onChange={(e) => setState({ ...state, sale_time: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Sale Place</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Sale Place"
												value={state.sale_place}
												onChange={(e) => setState({ ...state, sale_place: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Contact Number</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Contact Number"
												value={state.contact_no}
												onChange={(e) => setState({ ...state, contact_no: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Owner</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner"
												value={state.owner}
												onChange={(e) => setState({ ...state, owner: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Owner's first name</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's first name"
												value={state.owner_first_name}
												onChange={(e) => setState({ ...state, owner_first_name: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Owner's last name</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's last name"
												value={state.owner_last_name}
												onChange={(e) => setState({ ...state, owner_last_name: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Owner's spouce name</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's spouce name"
												value={state.owner_spouse_name}
												onChange={(e) => setState({ ...state, owner_spouse_name: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Other Owner</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Other Owner"
												value={state.owner2}
												onChange={(e) => setState({ ...state, owner2: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Owner's address</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's address"
												value={state.owner_address}
												onChange={(e) => setState({ ...state, owner_address: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Owner's city</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's city"
												value={state.owner_city}
												onChange={(e) => setState({ ...state, owner_city: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Owner's state</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's state"
												value={state.owner_state}
												onChange={(e) => setState({ ...state, owner_state: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Owner's zip</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Owner's zip"
												value={state.owner_zip}
												onChange={(e) => setState({ ...state, owner_zip: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Property Type</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Property Type"
												value={state.property_type}
												onChange={(e) => setState({ ...state, property_type: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Units</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Units"
												value={state.units}
												onChange={(e) => setState({ ...state, units: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Sqft</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Sqft"
												value={state.sqft}
												onChange={(e) => setState({ ...state, sqft: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Year Built</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Year Built"
												value={state.year_built}
												onChange={(e) => setState({ ...state, year_built: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Beds</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Beds"
												value={state.beds}
												onChange={(e) => setState({ ...state, beds: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Baths</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Baths"
												value={state.baths}
												onChange={(e) => setState({ ...state, baths: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Lot Size</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Lot Size"
												value={state.lot_size}
												onChange={(e) => setState({ ...state, lot_size: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Pool</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Pool"
												value={state.pool}
												onChange={(e) => setState({ ...state, pool: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Stories</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Stories"
												value={state.stories}
												onChange={(e) => setState({ ...state, stories: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Estimated Value</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Estimated Value"
												value={state.estimated_value}
												onChange={(e) => setState({ ...state, estimated_value: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Estimated Total Loan Balance</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Estimated Total Loan Balance"
												value={state.estimated_total_loan_balance}
												onChange={(e) => setState({ ...state, estimated_total_loan_balance: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Assessed Value</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Assessed Value"
												value={state.assessed_value}
												onChange={(e) => setState({ ...state, assessed_value: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Assessed Year</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Assessed Year"
												value={state.assessed_year}
												onChange={(e) => setState({ ...state, assessed_year: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Annual Taxes</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Annual Taxes"
												value={state.annual_taxes}
												onChange={(e) => setState({ ...state, annual_taxes: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Forecloser Stage</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Forecloser Stage"
												value={state.forecloser_stage}
												onChange={(e) => setState({ ...state, forecloser_stage: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Recording Date</label>
											<input
												type="date"
												className="form-control input-default "
												placeholder="Recording Date"
												value={state.recording_date}
												onChange={(e) => setState({ ...state, recording_date: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Trustee</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Trustee"
												value={state.trustee}
												onChange={(e) => setState({ ...state, trustee: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Trustee Sale Num</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Trustee Sale Num"
												value={state.trustee_sale_num}
												onChange={(e) => setState({ ...state, trustee_sale_num: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Trustee Phone</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Trustee Phone"
												value={state.trustee_phone}
												onChange={(e) => setState({ ...state, trustee_phone: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Postponement Reason</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Postponement Reason"
												value={state.postponement_reason}
												onChange={(e) => setState({ ...state, postponement_reason: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Published Bid</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Published Bid"
												value={state.published_bid}
												onChange={(e) => setState({ ...state, published_bid: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Opening Bid</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Opening Bid"
												value={state.opening_bid}
												onChange={(e) => setState({ ...state, opening_bid: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Winning Bid</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Winning Bid"
												value={state.winning_bid}
												onChange={(e) => setState({ ...state, winning_bid: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Default Amount</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Default Amount"
												value={state.default_amount}
												onChange={(e) => setState({ ...state, default_amount: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Default As Of</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Default As Of"
												value={state.default_as_of}
												onChange={(e) => setState({ ...state, default_as_of: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>FC Estimated Loan Position</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="FC Estimated Loan Position"
												value={state.fc_estimated_loan_position}
												onChange={(e) => setState({ ...state, fc_estimated_loan_position: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>FC Loan Date</label>
											<input
												type="date"
												className="form-control input-default "
												placeholder="FC Loan Date"
												value={state.fc_loan_date}
												onChange={(e) => setState({ ...state, fc_loan_date: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>FC Loan Doc Num</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="FC Loan Doc Num"
												value={state.fc_loan_doc_num}
												onChange={(e) => setState({ ...state, fc_loan_doc_num: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>FC Loan Amount</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="FC Loan Amount"
												value={state.fc_loan_amount}
												onChange={(e) => setState({ ...state, fc_loan_amount: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>FC Loan Lender Name</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="FC Loan Lender Name"
												value={state.fc_loan_lender_name}
												onChange={(e) => setState({ ...state, fc_loan_lender_name: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>First Loan Lender</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="First Loan Lender"
												value={state.first_loan_lender}
												onChange={(e) => setState({ ...state, first_loan_lender: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>First Loan Date</label>
											<input
												type="date"
												className="form-control input-default "
												placeholder="First Loan Date"
												value={state.first_loan_date}
												onChange={(e) => setState({ ...state, first_loan_date: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>First Loan Amount</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="First Loan Amount"
												value={state.first_loan_amount}
												onChange={(e) => setState({ ...state, first_loan_amount: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Second Loan Lender</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Second Loan Lender"
												value={state.second_loan_lender}
												onChange={(e) => setState({ ...state, second_loan_lender: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Second Loan Date</label>
											<input
												type="date"
												className="form-control input-default "
												placeholder="Second Loan Date"
												value={state.second_loan_date}
												onChange={(e) => setState({ ...state, second_loan_date: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Second Loan Amount</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Second Loan Amount"
												value={state.second_loan_amount}
												onChange={(e) => setState({ ...state, second_loan_amount: e.target.value })}
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-6">
											<label>Listed For Sale</label>
											<input
												type="text"
												className="form-control input-default "
												placeholder="Listed For Sale"
												value={state.listed_for_sale}
												onChange={(e) => setState({ ...state, listed_for_sale: e.target.value })}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Listing Price</label>
											<input
												type="number"
												className="form-control input-default "
												placeholder="Listing Price"
												value={state.listing_price}
												onChange={(e) => setState({ ...state, listing_price: e.target.value })}
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
							Update
						</Button>
					</Modal.Footer>
				</div>
			</form>

		</Modal>
	)
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
	updateProperty
};
export default connect(mapStateToProps, mapDispatchToProps)(EditProperty);