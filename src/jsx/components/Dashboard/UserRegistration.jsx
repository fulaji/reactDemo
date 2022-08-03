import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";
import { createUser } from "../../../stores/users/actions";

const UserRegistration = (props) => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    })
    const reset = () => {
        setState({
            ...state,
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            role: ""
        })
    }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setBtnLoading(true);
            // props.onHide();
            let formData = new FormData();
            formData.append("name", `${state.first_name} ${state.last_name}`);
            formData.append("email", state.email);
            formData.append("password", state.password);
            formData.append("phone", state.phone);
            formData.append("role", state.role);
            await props.createUser(formData);
            reset();
            Swal.fire("User created successfully", "", "success").then(() => {
            	// props.onHide();
                props.history.goBack();
            })
        } catch (err) {
            Swal.fire("Something went wrong", "", "error");
        } finally {
            setBtnLoading(false);
        }
    }
    return (
        // <Modal className="modal fade" show={props.visible} centered {...props}>
        // 	<form onSubmit={handleSubmit}>
        // 		<div className="modal-content" style={{ minWidth: "50vw" }}>
        // 			<div className="modal-header">
        // 				<h5 className="modal-title">Add Prospect</h5>
        // 				<Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => props.onHide()}>
        // 					<span>×</span>
        // 				</Button>
        // 			</div>
        // 			<Modal.Body>
        <form action="" onSubmit={handleSubmit}>
            <div className="card">
                <div className="card-body">
                    <div className="basic-form">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control input-default "
                                    placeholder="First name"
                                    required
                                    value={state.first_name}
                                    onChange={(e) => setState({ ...state, first_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className="form-control input-default "
                                    placeholder="Last Name"
                                    required
                                    value={state.last_name}
                                    onChange={(e) => setState({ ...state, last_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control input-default "
                                    placeholder="Email"
                                    required
                                    value={state.email}
                                    onChange={(e) => setState({ ...state, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Phone</label>
                                <input
                                    type="number"
                                    className="form-control input-default "
                                    placeholder="Phone"
                                    required
                                    value={state.phone}
                                    onChange={(e) => setState({ ...state, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control input-default "
                                    placeholder="Password"
                                    required
                                    value={state.password}
                                    onChange={(e) => setState({ ...state, password: e.target.value })}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Role</label>
                                <select
                                    name="" id=""
                                    className="form-control input-default"
                                    required
                                    onChange={(e) => setState({ ...state, role: e.target.value })}
                                >
                                    <option selected disabled value="">Select a role</option>
                                    <option value="superadmin">Super Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="team_member">Team Member</option>
                                    <option value="sales">Sales</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={btnLoading}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
        // 			</Modal.Body>
        // 			<Modal.Footer>
        // 				<Button
        // 					variant="primary"
        // 					type="submit"
        // 					disabled={btnLoading}
        // 				>
        // 					Submit
        // 				</Button>
        // 			</Modal.Footer>
        // 		</div>
        // 	</form>
        // </Modal>
    )
}
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
    createUser
};
export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);