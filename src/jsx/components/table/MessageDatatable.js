import React, { useState, useRef, useEffect } from "react";
import Pagination from "react-js-pagination";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";
import { Popover, OverlayTrigger, Overlay, Tooltip } from 'react-bootstrap';
//redux
import { connect } from "react-redux";
import {
  searchMessage,
  fetchMessages,
  messageSetPage,
  propertyChangeSortingOrder,
  propertySetSelectedMessage,
  deleteProperty,
  propertySetLimit
} from "../../../stores/messages/actions";

const MessageDatatable = (props) => {
  console.log(props)
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);


  const handleSelectRow = (item, checked) => {
    if (checked) {
      setSelectedRows((property) => {
        let propertiesArr = [...property];
        let filteredMessages = property.filter((prp) => prp.id === item.id);
        if (!filteredMessages.length) {
          propertiesArr.push(item);
        }
        return propertiesArr;
      });
    } else {
      setSelectedRows((property) => {
        let filteredMessages = property.filter(
          (prop) => prop.id !== item.id
        );
        return filteredMessages;
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
      e.preventDefault();
      setSearchLoading(true);
      await props.searchMessages(searchKey);
    } catch (err) {

    } finally {
      setSearchLoading(false);
    }
  }
  const resetSearch = async () => {
    setSearchKey("");
    props.fetchMessages({ limit: props.limit, offset: 0 });
  }
  const handlePageChange = (pageNumber) => {
    const { limit } = props;
    let newOffset = ((pageNumber - 1) * limit);
    props.fetchMessages({ limit, offset: newOffset });
    // setState({ ...state, activePage: pageNumber, offset:  newOffset});
    props.messageSetPage({
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
    setData([...props.messages]);
  }, [props.messages])
  useEffect(() => {
    props.fetchMessages({ limit: props.limit, offset: 0 });
    props.messageSetPage({
      activePage: 1,
      offset: 0
    })
  }, [props.tableHeaders])
  useEffect(() => {
    if (searchKey?.length === 0) {
      resetSearch()
    }
  }, [searchKey])
  useEffect(() => {
    props.propertySetSelectedMessage(selectedRows)
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
                    {/* <th className="width50">
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
                    </th> */}
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
                  {data.length === 0 && <tr className="odd" role="row"><td className="sorting_1" colSpan="12">No Message found!</td></tr>}
                  {data.map((property, i) => (
                    <tr className="odd" role="row" key={i}>
                      {/* <td>
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
                      </td> */}
                      <td>
                        {property.pro_id
                          ? (<Link target="_blank" to={`/property-details/${property.pro_id}`}>
                            <Highlighter
                              highlightClassName="YourHighlightClass"
                              searchWords={[searchKey]}
                              autoEscape={true}
                              textToHighlight={`${property.owner}`}
                              // textToHighlight={`${property.sale_date} | ${property.sale_time}`}
                              highlightStyle={{ background: "#ff0" }}
                            />
                          </Link>)
                          : ( <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[searchKey]}
                            autoEscape={true}
                            textToHighlight={`UNKNOWN`}
                            // textToHighlight={`${property.sale_date} | ${property.sale_time}`}
                            highlightStyle={{ background: "#ff0" }}
                          />)
                        }
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={formatForecastingStage(property.fromnumber)}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      {/* <Link to={`/property-details/${property.id}`}> */}
                        <td className="sorting_1">
                        {property.bodymessage?.length >= 15
                            ? ( <OverlayTrigger
                              trigger={['hover', 'focus']}
                              placement="right"
                              overlay={(
                                <Popover id="popover-trigger-hover-focus" title="Popover bottom">
                                 {property.bodymessage}
                                </Popover>
                              )}
                            >
                              <span >{property.bodymessage.substring(0,15)+'...'}</span> 
                            </OverlayTrigger>)
                            : ( <span>{property.bodymessage}</span>)
                        }
                        
                            
                          {/* <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[searchKey]}
                            autoEscape={true}
                            textToHighlight={property.bodymessage}
                            // textToHighlight={`${property.address} ${property.source === "PD" ? property.is_matched == 1 ? "✅" : "❌" : ""}`}
                            highlightStyle={{ background: "#ff0" }}
                          /> */}
                        </td>
                      {/* </Link> */}
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={property.type}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                      <td>
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={property.status}
                          highlightStyle={{ background: "#ff0" }}
                        />
                      </td>
                     
                      {/* <Link to={`/property-details/${property.id}`}>
                        <td className="d-flex justify-content-center align-items-center">
                          <button className="btn btn-primary rounded">View</button>
                        </td>
                      </Link> */}
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
              totalItemsCount={props.totalMessages}
              pageRangeDisplayed={5}
              onChange={(count) => handlePageChange(count)}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
          <div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  messages: state.messages.messages,
  totalMessages: state.messages.totalMessages,
  activePage: state.messages.activePage,
  limit: state.messages.limit,
  tableHeaders: state.messages.tableHeaders,
});
const mapDispatchToProps = {
  searchMessage,
  fetchMessages,
  messageSetPage,
  propertyChangeSortingOrder,
  propertySetSelectedMessage,
  deleteProperty,
  propertySetLimit
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageDatatable);