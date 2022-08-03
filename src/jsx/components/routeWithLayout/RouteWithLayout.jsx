import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

//redux
import { connect } from "react-redux";
import {fethProfile} from "../../../stores/profile/actions";

const RouteWithLayout = (props) => {
  const {
    component: Component,
    restricted,
    access,
    ...rest
  } = props;
  useEffect(()=>{
    if(props.token !== null){
      props.fethProfile();
    }
  }, [props.token])
  if (access === "public")
    return (
      <Route
        {...rest}
        render={(matchProps) =>
          (props.token !== null) && restricted ? (
            <Redirect to="/property-list" />
          ) : (
            <Component {...matchProps} />
          )
        }
      />
    );
  else if (access === "private")
    return (
      <Route
        {...rest}
        render={(matchProps) =>
          (props.token !== null) ? (
            <Component {...matchProps} />
          ) : (
            <Redirect to="/page-login" />
          )
        }
      />
    );
};
const mapStateToProps = (state) => ({
  token: state.auth.token,
});
const mapDispatchToProps = {
  fethProfile
};
export default connect(mapStateToProps, mapDispatchToProps)(RouteWithLayout);