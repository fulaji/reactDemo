import React, { useState, useRef, useEffect } from "react";
import Pagination from "react-js-pagination";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { GOOGLE_KEY } from "../../../config/index";
import Swal from "sweetalert2";
import EditProperty from "../Dashboard/EditProperty";
import moment from "moment";

//redux
import { connect } from "react-redux";
import {
  searchProperties,
  fetchProperties,
  propertySetPage,
  propertyChangeSortingOrder,
  propertySetSelectedProperties,
  deleteProperty,
  propertySetLimit
} from "../../../stores/properties/actions";

const PropertyImagePopup = (props) => {
  return (
    <Modal className="modal fade" show={props.visible} centered {...props}>
      <div className="modal-content" style={{ minWidth: "50vw" }}>
        <div className="modal-header">
          <h5 className="modal-title">Property Image</h5>
          <Button variant="" type="button" className="close" data-dismiss="modal" onClick={() => props.onHide()}>
            <span>×</span>
          </Button>
        </div>
        <Modal.Body>
          {typeof props.link === "string" && (
            <>
              {props.link?.length > 0 && (
                <img src={props.link}></img>
              )}
            </>
          )}
        </Modal.Body>
      </div>
    </Modal>
  )
}

const BasicDatatable = (props) => {
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [propertyImageLink, setPropertyImageLink] = useState("");
  const [editPropertyVisible, setEditPropertyVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({});


  const handleSelectRow = (item, checked) => {
    if (checked) {
      setSelectedRows((property) => {
        let propertiesArr = [...property];
        let filteredProperties = property.filter((prp) => prp.id === item.id);
        if (!filteredProperties.length) {
          propertiesArr.push(item);
        }
        return propertiesArr;
      });
    } else {
      setSelectedRows((property) => {
        let filteredProperties = property.filter(
          (prop) => prop.id !== item.id
        );
        return filteredProperties;
      });
    }
  };
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(props.properties);
    } else {
      setSelectedRows([]);
    }
  };
  const handleSearchResults = async (e) => {
    try {
      e?.preventDefault();
      setSearchLoading(true);
      await props.searchProperties(searchKey);
    } catch (err) {

    } finally {
      setSearchLoading(false);
    }
  }
  const resetSearch = async () => {
    setSearchKey("");
    props.fetchProperties({ limit: props.limit, offset: 0 });
  }
  const handlePageChange = (pageNumber) => {
    const { limit } = props;
    let newOffset = ((pageNumber - 1) * limit);
    props.fetchProperties({ limit, offset: newOffset });
    // setState({ ...state, activePage: pageNumber, offset:  newOffset});
    props.propertySetPage({
      activePage: pageNumber,
      offset: newOffset
    })
  };
  const handleDeleteProperty = (property) => {
    Swal.fire({
      title: 'Do you want to delete this property?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
      icon: "warning"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await props.deleteProperty(property.id);
          Swal.fire('Property Deleted Successfully!', '', 'success');
        } catch (err) {
          Swal.fire('Something went wrong!', '', 'error');
        }
      }
    })
  }
  const formatForecastingStage = (stage) => {
    switch (stage) {
      case "prospect":
        return "Prospect"
      case "contractSent":
        return "Contract Sent"
      case "offerMade":
        return "Offer Made"
      case "negotiation":
        return "Negotiation"
      case "closed":
        return "Closed"
      case "followUp":
        return "Follow-up"
      case "doNotContact":
        return "Do Not Contact"
      default:
        return stage;
    }
  }
  const calculateEquityPercentage = (property) =>{
    let estimated_value = parseFloat(property.estimated_value);
    let estimated_total_loan_balance = parseFloat(property.estimated_total_loan_balance);
    let equity = estimated_value - estimated_total_loan_balance;
    let equityPercentage = (equity/estimated_value)*100;
    if(isNaN(equityPercentage)){
      return "N/A";
    }else{
      return `${equityPercentage.toFixed(2)}%`;
    }
  }
  useEffect(() => {
    setData([...props.properties]);
  }, [props.properties])
  useEffect(() => {
    props.fetchProperties({ limit: props.limit, offset: 0 });
    props.propertySetPage({
      activePage: 1,
      offset: 0
    })
  }, [props.tableHeaders])
  useEffect(() => {
    if (searchKey?.length === 0) {
      resetSearch()
    }else if(searchKey?.length >= 3){
      handleSearchResults(null)
    }
  }, [searchKey])
  useEffect(() => {
    props.propertySetSelectedProperties(selectedRows)
  }, [selectedRows])
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">
          {/* <h4 className="card-title">Basic Datatable</h4> */}
          <form class="search-box" onSubmit={handleSearchResults} style={{ position: "relative" }}>
            <input
              type="text"
              class="search-input"
              placeholder="Search..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              required
            />
            {searchKey?.length > 0 && (
              <i class="fa fa-times search-close" onClick={() => resetSearch()}></i>
            )}
            <button className="search-button d-flex justify-content-center align-items-center" disabled={searchLoading} type="submit">
              {searchLoading ? (
                <span class="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
              ) : (
                <i class="fa fa-search"></i>
              )}
            </button>
            <Dropdown className="input-group-prepend">
              <Dropdown.Toggle
                variant=""
                className="btn btn-primary rounded btn-sm ml-3"
                type="button"
                data-toggle="dropdown"
              >
                {props.limit}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.propertySetLimit(10)}>
                  10
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.propertySetLimit(30)}>
                  30
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.propertySetLimit(50)}>
                  50
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.propertySetLimit(100)}>
                  100
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </form>
        </div>
        {props.loading && (
          <div style={{ margin: "auto", marginTop: 10 }}>
            <span class="spinner-border spinner-border-lg text-primary" role="status" aria-hidden="true">
            </span>
          </div>
        )}
        <div className="card-body">
          <div className="table-responsive">
            <div id="job_data" className="dataTables_wrapper ">
              <table
                className="display w-100 dataTable "
                id="example5"
                role="grid"
                aria-describedby="example5_info"
              >
                <thead>
                  <tr role="row">
                    <th className="width50">
                      <div className="custom-control custom-checkbox checkbox-success check-lg mr-3">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="checkAll"
                          required=""
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="checkAll"
                        ></label>
                      </div>
                    </th>
                    {props.tableHeaders.map((header, i) => (
                      <th
                        className="sorting_asc"
                        style={{ width: "177px", cursor: "pointer" }}
                        key={`th-${i}`}
                        onClick={() => {
                          if (typeof header.sortingOrder === "string") {
                            props.propertyChangeSortingOrder(i)
                          }
                        }}
                      >
                        {header.title}
                        {typeof header.sortingOrder === "string" && (
                          <>
                            {header.sortingOrder === "asc" ? <i class="fa fa-sort-up ml-2"></i> : header.sortingOrder === "desc" ? <i class="fa fa-sort-down ml-2"></i> : <i class="fa fa-sort ml-2"></i>}
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 && <tr className="odd" role="row"><td className="sorting_1" colSpan="12">No properties found!</td></tr>}
                  {data.map((property, i) => (
                    <tr className="odd" role="row" key={i}>
                      <td>
                        <div className="custom-control custom-checkbox checkbox-success check-lg mr-3">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`customCheckBox2-${i}`}
                            required=""
                            onChange={(e) => handleSelectRow(property, e.target.checked)}
                            checked={selectedRows.filter((prp) => prp.id === property.id).length ? true : false}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`customCheckBox2-${i}`}
                          ></label>
                        </div>
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={moment(property.sale_date).isValid() ? `${moment(property.sale_date).format("MM-DD-YYYY")}` : "N/A"}
                          // textToHighlight={`${property.sale_date} | ${property.sale_time}`}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={formatForecastingStage(property.forecasting_stage)}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <Link to={`/property-details/${property.id}`}>
                        <td className="sorting_1">
                          <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[searchKey]}
                            autoEscape={true}
                            textToHighlight={property.address}
                            // textToHighlight={`${property.address} ${property.source === "PD" ? property.is_matched == 1 ? "✅" : "❌" : ""}`}
                            highlightStyle={{ background: "#ff0" }}
                          />
                        </td>
                      </Link>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={property.city}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={property.county}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={calculateEquityPercentage(property)}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={moment(property.last_contacted_on).format("MM-DD-YYYY")}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={"TEAM"}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      {/* <td onClick={() => {
                        setPropertyImageLink(`https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${property.address} ${property.city} ${property.state} ${property.zip}&key=${GOOGLE_KEY}`);
                        setPopupVisible(true);
                      }}>
                        <button className="btn btn-primary rounded">View</button>
                      </td> */}
                      <Link to={`/property-details/${property.id}`}>
                        <td className="d-flex justify-content-center align-items-center">
                          <button className="btn btn-primary rounded">View</button>
                          {/* <button className="btn btn-primary rounded mr-2" onClick={() => {
                          setSelectedProperty(property);
                          setEditPropertyVisible(true)
                        }}>Edit</button>
                        <button className="btn btn-danger rounded" onClick={() => handleDeleteProperty(property)}>Delete</button> */}
                        </td>
                      </Link>
                    </tr>
                  ))}
                </tbody>
                {/* {data.length > 0 && (
                  <tfoot>
                    <tr>
                      {props.tableHeaders.map((header, i) => (
                        <th rowSpan="1" colSpan="1" key={`th-footer-${i}`}>
                          {header.title}
                        </th>
                      ))}
                    </tr>
                  </tfoot>
                )} */}
              </table>
            </div>
          </div>
          <div className="d-sm-flex text-center justify-content-end align-items-center mt-5">
            <Pagination
              activePage={props.activePage}
              itemsCountPerPage={props.limit}
              totalItemsCount={props.totalProperties}
              pageRangeDisplayed={5}
              onChange={(count) => handlePageChange(count)}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
          <div>
            <PropertyImagePopup
              visible={popupVisible}
              link={propertyImageLink}
              onHide={() => setPopupVisible(false)}
            />
            <EditProperty
              visible={editPropertyVisible}
              onHide={() => setEditPropertyVisible(false)}
              property={selectedProperty}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  properties: state.properties.properties,
  totalProperties: state.properties.totalProperties,
  activePage: state.properties.activePage,
  limit: state.properties.limit,
  tableHeaders: state.properties.tableHeaders,
});
const mapDispatchToProps = {
  searchProperties,
  fetchProperties,
  propertySetPage,
  propertyChangeSortingOrder,
  propertySetSelectedProperties,
  deleteProperty,
  propertySetLimit
};
export default connect(mapStateToProps, mapDispatchToProps)(BasicDatatable);