import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import moment from "moment";
import $ from "jquery";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import Highlighter from "react-highlight-words";

//redux
import { connect } from "react-redux";
import { fetchUsers, userSetPage, userSetLimit, searchUsers } from "../../../stores/users/actions";

function UserList(props) {
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const handlePageChange = (pageNumber) => {
    const { limit } = props;
    let newOffset = ((pageNumber - 1) * limit);
    props.fetchUsers({ limit, offset: newOffset });
    props.userSetPage({
      activePage: pageNumber,
      offset: newOffset
    })
  };
  const resetSearch = async () => {
    setSearchKey("");
    props.fetchUsers({ limit: props.limit, offset: 0 });
  }
  const handleSearchResults = async (e) => {
    try {
      e.preventDefault();
      setSearchLoading(true);
      await props.searchUsers(searchKey);
    } catch (err) {

    } finally {
      setSearchLoading(false);
    }
  }
  useEffect(() => {
    props.fetchUsers({ limit: props.limit, offset: 0 });
    props.userSetPage({
      activePage: 1,
      offset: 0
    })
  }, [props.tableHeaders])
  useEffect(() => {
    setData([...props.users]);
  }, [props.users])
  useEffect(() => {
    if (searchKey?.length === 0) {
      resetSearch()
    }
  }, [searchKey])
  return (
    <>
      <div className='form-head page-titles d-flex  align-items-center'>
        <div className='mr-auto  d-lg-block'>
          <h2 className='text-black font-w600'>Users</h2>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item active'>
              <Link to='/order-list'>Dashboard</Link>
            </li>
            <li className='breadcrumb-item'>
              <Link to='/user-list'>Users</Link>
            </li>
          </ol>
        </div>
        <Link to='/user-registration'>
          <div className='btn btn-primary rounded light mr-3'>
            Add User
          </div>
        </Link>
      </div>
      <div className='row'>
        <div className='col-xl-12'>
          <div className='table-responsive table-hover fs-14'>
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <form class="search-box" style={{ position: "relative" }} onSubmit={handleSearchResults}>
                    <input
                      type="text"
                      class="search-input"
                      placeholder="Search..."
                      required
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
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
                        <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.userSetLimit(10)}>
                          10
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.userSetLimit(30)}>
                          30
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.userSetLimit(50)}>
                          50
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown-item" to="#" onClick={() => props.userSetLimit(100)}>
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
                          {data.length === 0 && <tr className="odd" role="row"><td className="sorting_1" colSpan="12">No users found!</td></tr>}
                          {data.map((user, i) => (
                            <tr className="odd" role="row" key={i}>
                              <td>
                                <Highlighter
                                  highlightClassName="YourHighlightClass"
                                  searchWords={[searchKey]}
                                  autoEscape={true}
                                  textToHighlight={user.name}
                                  highlightStyle={{ background: "#ff0" }}
                                />
                              </td>
                              <td>
                                <Highlighter
                                  highlightClassName="YourHighlightClass"
                                  searchWords={[searchKey]}
                                  autoEscape={true}
                                  textToHighlight={user.email}
                                  highlightStyle={{ background: "#ff0" }}
                                />
                              </td>
                              <td className="sorting_1">
                                <Highlighter
                                  highlightClassName="YourHighlightClass"
                                  searchWords={[searchKey]}
                                  autoEscape={true}
                                  textToHighlight={user.role}
                                  highlightStyle={{ background: "#ff0" }}
                                />
                              </td>
                              <td>
                                <Highlighter
                                  highlightClassName="YourHighlightClass"
                                  searchWords={[searchKey]}
                                  autoEscape={true}
                                  textToHighlight={user.created_on}
                                  highlightStyle={{ background: "#ff0" }}
                                />
                              </td>
                              <Link to={`/user-edit/${user.id}`}>
                                <td className="d-flex justify-content-center align-items-center">
                                  <button className="btn btn-primary rounded">Edit</button>
                                </td>
                              </Link>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="d-sm-flex text-center justify-content-end align-items-center mt-5">
                    <Pagination
                      activePage={props.activePage}
                      itemsCountPerPage={props.limit}
                      totalItemsCount={props.totalUsers}
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
          </div>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state) => ({
  totalUsers: state.users.totalUsers,
  limit: state.users.limit,
  offset: state.users.offset,
  tableHeaders: state.users.tableHeaders,
  loading: state.users.loading,
  users: state.users.users
});
const mapDispatchToProps = {
  fetchUsers,
  userSetPage,
  userSetLimit,
  searchUsers
};
export default connect(mapStateToProps, mapDispatchToProps)(UserList);