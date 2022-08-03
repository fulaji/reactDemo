import React, { useState } from "react";
import { Link } from "react-router-dom";
import productData from "../productData";
import { Tab, Nav } from "react-bootstrap";

import product1 from "../../../../../images/product/1.jpg";
import product2 from "../../../../../images/product/2.jpg";
import product3 from "../../../../../images/product/3.jpg";
import product4 from "../../../../../images/product/4.jpg";
import tab1 from "../../../../../images/tab/1.jpg";
import tab2 from "../../../../../images/tab/2.jpg";
import tab3 from "../../../../../images/tab/3.jpg";
import tab4 from "../../../../../images/tab/4.jpg";

const ProductDetail = ({ match }) => {
  //** Dynamic Key Single Place */
  const singleProductData = productData.find((sinPl) =>
    sinPl.key === match.params.id ? match.params.id : productData[0].key
  );
  const {
    rating,
    price,
    availability,
    productCode,
    brand,
    tags,
    des,
    imageList,
  } = singleProductData;
  const [imageSrc, setImageSrc] = useState(product1);

  return (
    <>
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/ecom-product-detail">Layout</Link>
          </li>
          <li className="breadcrumb-item active">
            <Link to="/ecom-product-detail">Blank</Link>
          </li>
        </ol>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-3 col-lg-6  col-md-6 col-xxl-5 ">
                  {/* Tab panes */}
                  <Tab.Container defaultActiveKey="first">
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <img className="img-fluid" src={product1} alt="image" />
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <img className="img-fluid" src={product2} alt="image" />
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        <img className="img-fluid" src={product3} alt="image" />
                      </Tab.Pane>
                      <Tab.Pane eventKey="four">
                        <img className="img-fluid" src={product4} alt="image" />
                      </Tab.Pane>
                    </Tab.Content>
                    <div className="tab-slide-content new-arrival-product mb-4 mb-xl-0">
                      {/* Nav tabs */}
                      <Nav
                        as="ul"
                        className="nav slide-item-list mt-3"
                        role="tablist"
                      >
                        <Nav.Item as="li">
                          <Nav.Link as="a" eventKey="first" href="#first">
                            <img
                              className="img-fluid"
                              src={tab1}
                              alt="image"
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link as="a" eventKey="second" href="#second">
                            <img
                              className="img-fluid"
                              src={tab2}
                              alt="image"
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link as="a" eventKey="third" href="#third">
                            <img
                              className="img-fluid"
                              src={tab3}
                              alt="image"
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link as="a" href="#for" eventKey="four">
                            <img
                              className="img-fluid"
                              src={tab4}
                              alt="image"
                              width={50}
                            />
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Tab.Container>
                </div>
                {/*Tab slider End*/}
                <div className="col-xl-9 col-lg-6  col-md-6 col-xxl-7 col-sm-12">
                  <div className="product-detail-content">
                    {/*Product details*/}
                    <div className="new-arrival-content pr">
                      <h4>Solid Women's V-neck Dark T-Shirt</h4>
                      <div className="star-rating mb-2">
                        <ul className="produtct-detail-tag">
                          <li>
                            <i className="fa fa-star" />
                          </li>
                          <li>
                            <i className="fa fa-star" />
                          </li>
                          <li>
                            <i className="fa fa-star" />
                          </li>
                          <li>
                            <i className="fa fa-star" />
                          </li>
                          <li>
                            <i className="fa fa-star" />
                          </li>
                        </ul>
                        <span className="review-text">(34 reviews) / </span>
                        <Link
                          className="product-review"
                          to="/ecom-product-detail"
                        >
                          Write a review?
                        </Link>
                      </div>
                      <p className="price">$320.00</p>
                      <p>
                        Availability:{" "}
                        <span className="item">
                          {" "}
                          In stock <i className="fa fa-shopping-basket" />
                        </span>
                      </p>
                      <p>
                        Product code: <span className="item">0405689</span>{" "}
                      </p>
                      <p>
                        Brand: <span className="item">Lee</span>
                      </p>
                      <p>
                        Product tags:&nbsp;&nbsp;
                        <span className="badge badge-success light">bags</span>
                        <span className="badge badge-success light">
                          clothes
                        </span>
                        <span className="badge badge-success light">shoes</span>
                        <span className="badge badge-success light">
                          dresses
                        </span>
                      </p>
                      <p className="text-content">
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered
                        alt="image"eration in some form, by injected humour, or
                        randomised words which don't look even slightly
                        believable. If you are going to use a passage of Lorem
                        Ipsum, you need to be sure there isn't anything
                        embarrassing.
                      </p>
                      <div className="filtaring-area my-3">
                        <div className="size-filter">
                          <h4 className="m-b-15">Select size</h4>
                          <div className="btn-group" data-toggle="buttons">
                            <label className="btn btn-outline-primary light btn-sm">
                              <input
                                type="radio"
                                className="position-absolute invisible"
                                name="options"
                                id="option5"
                              />{" "}
                              XS
                            </label>
                            <label className="btn btn-outline-primary light btn-sm">
                              <input
                                type="radio"
                                className="position-absolute invisible"
                                name="options"
                                id="option1"
                                defaultChecked
                              />
                              SM
                            </label>
                            <label className="btn btn-outline-primary light btn-sm">
                              <input
                                type="radio"
                                className="position-absolute invisible"
                                name="options"
                                id="option2"
                              />{" "}
                              MD
                            </label>
                            <label className="btn btn-outline-primary light btn-sm">
                              <input
                                type="radio"
                                className="position-absolute invisible"
                                name="options"
                                id="option3"
                              />{" "}
                              LG
                            </label>
                            <label className="btn btn-outline-primary light btn-sm">
                              <input
                                type="radio"
                                className="position-absolute invisible"
                                name="options"
                                id="option4"
                              />{" "}
                              XL
                            </label>
                          </div>
                        </div>
                      </div>
                      {/*Quantity start*/}
                      <div className="col-2 px-0">
                        <input
                          type="number"
                          name="num"
                          className="form-control input-btn input-number"
                          defaultValue={1}
                        />
                      </div>
                      {/*Quanatity End*/}
                      <div className="shopping-cart mt-3">
                        <Link
                          className="btn btn-primary btn-lg"
                          to="/ecom-product-detail"
                        >
                          <i className="fa fa-shopping-basket mr-2" />
                          Add to cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
