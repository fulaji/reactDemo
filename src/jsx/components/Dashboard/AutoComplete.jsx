import React, { useState, useEffect } from "react";
import { AutoComplete } from "rsuite";
import axios from "axios";

//redux
import { connect } from "react-redux";
import {
  fetchLocationPredictions,
  fetchLocationDetails,
} from "../../../stores/properties/actions";

import Autocomplete from "react-autocomplete";
const AutoCompleteComponent = ({
  className,
  onSelect,
  fetchLocationPredictions,
  predictions,
  fetchLocationDetails,
  value,
  onChange,
  placeholder,
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (predictions?.length) {
      setData([...predictions.map((item) => item.description)]);
    }
  }, [predictions]);
  useEffect(() => {
    if(value.length >= 3){
        fetchLocationPredictions(value);
    }else{
        setData([])
    }
  }, [value]);
  useEffect(() => {
    axios.get("https://cors-handle.herokuapp.com/");
  }, []);
  return (
    <Autocomplete
      getItemValue={(item) => item}
      items={data}
      renderItem={(item, isHighlighted) => (
        <div
          style={{
            background: isHighlighted ? "lightgray" : "white",
            marginBottom: 10,
            borderBottom: "1px solid #ccc",
          }}
        >
          {item}
        </div>
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onSelect={async (val) => {
        const resp = await fetchLocationDetails(val);
        onSelect({ ...resp, street_address: val });
      }}
      menuStyle={{
        borderRadius: "3px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "20px 15px",
        fontSize: "90%",
        position: "fixed",
        overflow: "auto",
        maxHeight: "50%",
        zIndex: 999,
        maxWidth: 300,
      }}
      wrapperStyle={{
        display: "block",
        width: "100%",
        height: "calc(1.5em + 0.75rem + 9px)",
        padding: " 0.375rem 0.75rem",
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.5,
        transition:
          "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
        borderRadius: 0,
        background: "#fff",
        border: "1px solid #f0f1f5",
        color: "#6e6e6e",
      }}
    />
    // <AutoComplete
    //     data={data}
    //     // className={className}
    //     onSelect={async(item) => {
    //         const resp = await fetchLocationDetails(item.value);
    //         onSelect({...resp, street_address: item.value})
    //     }}
    //     onChange={(value)=>onChange(value)}
    //     autoComplete="rutjfkde"
    //     value={value}
    //     placeholder={placeholder}
    //     key={data.length}
    // />
  );
};
const mapStateToProps = (state) => ({
  predictions: state.properties.locationPredictions,
});
const mapDispatchToProps = {
  fetchLocationPredictions,
  fetchLocationDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoCompleteComponent);
