import React, { useState } from "react";
import { Link } from "react-router-dom";

//redux
import { connect } from "react-redux";
import { checkLogin } from "../../stores/auth/actions";

const Login = (props) => {
   const [loginData, setLoginData] = useState({});
   const [btnLoading, setBtnLoading] = useState(false);
   const [errMsg, setErrMsg] = useState("");
   const handleBlur = (e) => {
      const newLoginData = { ...loginData };
      newLoginData[e.target.name] = e.target.value;
      setLoginData(newLoginData);
   };
   const submitHandler = async (e) => {
      e.preventDefault();
      try {
         setBtnLoading(true);
         let formData = new FormData();
         formData.append("email", loginData.email);
         formData.append("password", loginData.password);
         await props.checkLogin(formData);
      } catch (err) {
         if (typeof err?.response?.data === "object") {
            if(typeof err.response.data?.message?.username === "string")
               setErrMsg(err.response.data?.message?.username);
            else
               setErrMsg("Something went wrong!");
         }
      } finally {
         setBtnLoading(false);
      }
   };

   return (
      <div className="authincation h-100 p-meddle">
         <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
               <div className="col-md-6">
                  <div className="authincation-content">
                     <div className="row no-gutters">
                        <div className="col-xl-12">
                           <div className="auth-form">
                              <h4 className="text-center mb-4">
                                 Sign in your account
                              </h4>
                              <form
                                 action=""
                                 onSubmit={(e) => submitHandler(e)}
                              >
                                 <div className="form-group">
                                    <label className="mb-1">
                                       <strong>Email</strong>
                                    </label>
                                    <input
                                       type="email"
                                       className="form-control"
                                       placeholder="Enter email"
                                       name="email"
                                       onChange={handleBlur}
                                       required
                                    />
                                 </div>
                                 <div className="form-group">
                                    <label className="mb-1">
                                       <strong>Password</strong>
                                    </label>
                                    <input
                                       type="password"
                                       className="form-control"
                                       placeholder="Enter password"
                                       name="password"
                                       onChange={handleBlur}
                                       required
                                    />
                                 </div>
                                 <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                    <div className="form-group">
                                       <div className="custom-control custom-checkbox ml-1">
                                          {/* <input
                                             type="checkbox"
                                             className="custom-control-input"
                                             id="basic_checkbox_1"
                                          />
                                          <label
                                             className="custom-control-label"
                                             htmlFor="basic_checkbox_1"
                                          >
                                             Remember my preference
                                          </label> */}
                                       </div>
                                    </div>
                                    <div className="form-group">
                                       <Link to="/page-forgot-password">
                                          Forgot Password?
                                       </Link>
                                    </div>
                                 </div>
                                 {errMsg?.length > 0 && (
                                    <div className="form-group">
                                       <small className="text-danger">{errMsg}</small>
                                    </div>
                                 )}
                                 <div className="text-center">
                                    <input
                                       type="submit"
                                       value={btnLoading ? "..." : "Sign In"}
                                       className="btn btn-primary btn-block"
                                       disabled={btnLoading}
                                    />
                                 </div>
                              </form>
                              <div className="new-account mt-3">
                                 <p>
                                    Don't have an account?{" "}
                                    <Link
                                       className="text-primary"
                                       to="/page-register"
                                    >
                                       Sign up
                                    </Link>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
   checkLogin,
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);