import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

//redux
import { connect } from "react-redux";
import { editUser, fetchUserDetails } from "../../../stores/users/actions";

const UserUpdate = (props) => {
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
            formData.append("role", state.role);
            formData.append("phone", state.phone);
            formData.append("id", props.user.id);
            if(state.password.length > 0){
                formData.append("password", state.password);
            }
            await props.editUser(formData);
            Swal.fire("User updated successfully", "", "success").then(() => {
            	// props.onHide();
                props.history.goBack();
            })
        } catch (err) {
            if(err?.response?.data?.message?.email){
                Swal.fire(err?.response?.data?.message?.email, "", "warning");
            }else{
                Swal.fire("Something went wrong", "", "error");
            }
        } finally {
            setBtnLoading(false);
        }
    }
    useEffect(()=>{
        props.fetchUserDetails(props.match.params.id)
    }, [])
    useEffect(()=>{
        if(props.user?.id){
            setState({
                ...state,
                first_name: props.user?.name?.split(" ")[0],
                last_name: props.user?.name?.split(" ")[1],
                email: props.user?.email,
                phone: props.user?.phone,
                role: props.user?.role
            })
        }
    }, [props.user])
    return (
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
                                    value={state.password}
                                    onChange={(e) => setState({ ...state, password: e.target.value })}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Role</label>
                                <select
                                    name="" id=""
                                    className="form-control input-default"
                                    required
                                    onChange={(e) => setState({ ...state, role: e.target.value })}
                                    value={state.role}
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
    )
}
const mapStateToProps = (state) => ({
    user: state.users.user
});
const mapDispatchToProps = {
    editUser,
    fetchUserDetails
};
export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);