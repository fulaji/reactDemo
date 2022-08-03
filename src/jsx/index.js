import React, {useState, useEffect} from "react";

/// React router dom
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import RouteWithLayout from "./components/routeWithLayout/RouteWithLayout";

/// Dashboard
import Home from "./components/Dashboard/Home";
import Analytics from "./components/Dashboard/Analytics";
import OrderList from "./components/Dashboard/OrderList";
import CustomerList from "./components/Dashboard/CustomerList";
import Reviews from "./components/Dashboard/Reviews";
import PropertyDetails from "./components/Dashboard/PropertyDetails";
import UserRegistration from "./components/Dashboard/UserRegistration";
import UserList from "./components/Dashboard/UserList";
import UserUpdate from "./components/Dashboard/UserUpdate";

/// App
import AppProfile from "./components/AppsMenu/AppProfile/AppProfile";
import Compose from "./components/AppsMenu/Email/Compose/Compose";
import Inbox from "./components/AppsMenu/Email/Inbox/Inbox";
import Read from "./components/AppsMenu/Email/Read/Read";
import Calendar from "./components/AppsMenu/Calendar/Calendar";
import PostDetails from "./components/AppsMenu/AppProfile/PostDetails";

/// Product List
import ProductGrid from "./components/AppsMenu/Shop/ProductGrid/ProductGrid";
import ProductList from "./components/AppsMenu/Shop/ProductList/ProductList";
import ProductDetail from "./components/AppsMenu/Shop/ProductGrid/ProductDetail";
import Checkout from "./components/AppsMenu/Shop/Checkout/Checkout";
import Invoice from "./components/AppsMenu/Shop/Invoice/Invoice";
import ProductOrder from "./components/AppsMenu/Shop/ProductOrder";
import Customers from "./components/AppsMenu/Shop/Customers/Customers";

/// Charts
import SparklineChart from "./components/charts/Sparkline";
import ChartJs from "./components/charts/Chartjs";
import Chartist from "./components/charts/chartist";
import RechartJs from "./components/charts/rechart";
import ApexChart from "./components/charts/apexcharts";

/// Bootstrap
import UiAlert from "./components/bootstrap/Alert";
import UiAccordion from "./components/bootstrap/Accordion";
import UiBadge from "./components/bootstrap/Badge";
import UiButton from "./components/bootstrap/Button";
import UiModal from "./components/bootstrap/Modal";
import UiButtonGroup from "./components/bootstrap/ButtonGroup";
import UiListGroup from "./components/bootstrap/ListGroup";
import UiMediaObject from "./components/bootstrap/MediaObject";
import UiCards from "./components/bootstrap/Cards";
import UiCarousel from "./components/bootstrap/Carousel";
import UiDropDown from "./components/bootstrap/DropDown";
import UiPopOver from "./components/bootstrap/PopOver";
import UiProgressBar from "./components/bootstrap/ProgressBar";
import UiTab from "./components/bootstrap/Tab";
import UiPagination from "./components/bootstrap/Pagination";
import UiGrid from "./components/bootstrap/Grid";
import UiTypography from "./components/bootstrap/Typography";

/// Plugins
import Select2 from "./components/PluginsMenu/Select2/Select2";
import Nestable from "./components/PluginsMenu/Nestable/Nestable";
import MainNouiSlider from "./components/PluginsMenu/Noui Slider/MainNouiSlider";
import MainSweetAlert from "./components/PluginsMenu/Sweet Alert/SweetAlert";
import Toastr from "./components/PluginsMenu/Toastr/Toastr";
import JqvMap from "./components/PluginsMenu/Jqv Map/JqvMap";

/// Widget
import Widget from "./pages/Widget";

/// Table
import DataTable from "./components/table/DataTable";
import BootstrapTable from "./components/table/BootstrapTable";

/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/Wizard/Wizard";
import SummerNote from "./components/Forms/Summernote/SummerNote";
import Pickers from "./components/Forms/Pickers/Pickers";
import jQueryValidation from "./components/Forms/jQueryValidation/jQueryValidation";

/// Pages
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";

//redux
import { connect } from "react-redux";

//new pages 
import MessageLogUser from "./components/Dashboard/MessageLogUser";
//import MessageLog from "./components/Message/MessageLog";
import MessageLog from "./components/Message/MessageLog";
import Category from "./components/category/Category";
// import IvrIndex from "./components/Ivr/IvrIndex"
import IvrIndex from "./components/Ivr/IvrIndex"
import CampaignIndex from "./components/campaign/CampaignIndex";
import CampaignView from "./components/campaign/CampaignView";

const Markup = (props) => {
  const [path, setPath] = useState("");
  const [pagePath, setPagePath] = useState("");

  const routes = [
    /// Dashboard
    // { url: "", component: Home },
    { url: "analytics", component: Analytics, access: "private", restricted: false },
    { url: "review", component: Reviews, access: "private", restricted: false },
    { url: "property-list", component: OrderList, access: "private", restricted: false },
    { url: "customer-list", component: CustomerList, access: "private", restricted: false },
    { url: "property-details/:id", component: PropertyDetails, access: "private", restricted: false },
    { url: "user-registration", component: UserRegistration, access: "private", restricted: false },
    { url: "user-list", component: UserList, access: "private", restricted: false },
    { url: "user-edit/:id", component: UserUpdate, access: "private", restricted: false },

    // xsquare new route
    {url: "category", component: Category, access: "private", restricted: false},
    // {url: "messages", component: MessageLogUser, access: "private", restricted: false},
    {url: "messages", component: MessageLog, access: "private", restricted: false},
    {url: "ivr", component: IvrIndex, access: "private", restricted: false},
    {url: "campaign", component: CampaignIndex, access: "private", restricted: false},
    { url: "campaign/:id", component: CampaignView, access: "private", restricted: false },
    { url: "property-details/:id/:voicemail", component: PropertyDetails, access: "private", restricted: false },

    /// Apps
    { url: "app-profile", component: AppProfile, access: "private", restricted: false },
    { url: "email-compose", component: Compose, access: "private", restricted: false },
    { url: "email-inbox", component: Inbox, access: "private", restricted: false },
    { url: "email-read", component: Read, access: "private", restricted: false },
    { url: "app-calender/:id", component: Calendar, access: "private", restricted: false },
    { url: "post-details", component: PostDetails, access: "private", restricted: false },

    /// Chart
    { url: "chart-sparkline", component: SparklineChart, access: "private", restricted: false },
    { url: "chart-chartjs", component: ChartJs, access: "private", restricted: false },
    { url: "chart-chartist", component: Chartist, access: "private", restricted: false },
    { url: "chart-apexchart", component: ApexChart, access: "private", restricted: false },
    { url: "chart-rechart", component: RechartJs, access: "private", restricted: false },

    /// Bootstrap
    { url: "ui-alert", component: UiAlert, access: "private", restricted: false },
    { url: "ui-badge", component: UiBadge, access: "private", restricted: false },
    { url: "ui-button", component: UiButton, access: "private", restricted: false },
    { url: "ui-modal", component: UiModal, access: "private", restricted: false },
    { url: "ui-button-group", component: UiButtonGroup, access: "private", restricted: false },
    { url: "ui-accordion", component: UiAccordion, access: "private", restricted: false },
    { url: "ui-list-group", component: UiListGroup, access: "private", restricted: false },
    { url: "ui-media-object", component: UiMediaObject, access: "private", restricted: false },
    { url: "ui-card", component: UiCards, access: "private", restricted: false },
    { url: "ui-carousel", component: UiCarousel, access: "private", restricted: false },
    { url: "ui-dropdown", component: UiDropDown, access: "private", restricted: false },
    { url: "ui-popover", component: UiPopOver, access: "private", restricted: false },
    { url: "ui-progressbar", component: UiProgressBar, access: "private", restricted: false },
    { url: "ui-tab", component: UiTab, access: "private", restricted: false },
    { url: "ui-pagination", component: UiPagination, access: "private", restricted: false },
    { url: "ui-typography", component: UiTypography, access: "private", restricted: false },
    { url: "ui-grid", component: UiGrid, access: "private", restricted: false },

    /// Plugin
    { url: "uc-select2", component: Select2, access: "private", restricted: false },
    { url: "uc-nestable", component: Nestable, access: "private", restricted: false },
    { url: "uc-noui-slider", component: MainNouiSlider, access: "private", restricted: false },
    { url: "uc-sweetalert", component: MainSweetAlert, access: "private", restricted: false },
    { url: "uc-toastr", component: Toastr, access: "private", restricted: false },
    { url: "map-jqvmap", component: JqvMap, access: "private", restricted: false },

    /// Widget
    { url: "widget-basic", component: Widget, access: "private", restricted: false },

    /// Shop
    { url: "ecom-product-grid", component: ProductGrid, access: "private", restricted: false },
    { url: "ecom-product-list", component: ProductList, access: "private", restricted: false },
    { url: "ecom-product-detail", component: ProductDetail, access: "private", restricted: false },
    { url: "ecom-product-order", component: ProductOrder, access: "private", restricted: false },
    { url: "ecom-checkout", component: Checkout, access: "private", restricted: false },
    { url: "ecom-invoice", component: Invoice, access: "private", restricted: false },
    { url: "ecom-product-detail", component: ProductDetail, access: "private", restricted: false },
    { url: "ecom-customers", component: Customers, access: "private", restricted: false },

    /// Form
    { url: "form-element", component: Element, access: "private", restricted: false },
    { url: "form-wizard", component: Wizard, access: "private", restricted: false },
    { url: "form-wizard", component: Wizard, access: "private", restricted: false },
    { url: "form-editor-summernote", component: SummerNote, access: "private", restricted: false },
    { url: "form-pickers", component: Pickers, access: "private", restricted: false },
    { url: "form-validation-jquery", component: jQueryValidation, access: "private", restricted: false },

    /// table
    { url: "table-datatable-basic", component: DataTable, access: "private", restricted: false },
    { url: "table-bootstrap-basic", component: BootstrapTable, access: "private", restricted: false },

    /// pages
    { url: "page-register", component: Registration, access: "public", restricted: true },
    { url: "page-lock-screen", component: LockScreen, access: "public", restricted: true },
    { url: "page-login", component: Login, access: "public", restricted: true },
    { url: "page-forgot-password", component: ForgotPassword, access: "public", restricted: true },
    { url: "page-error-400", component: Error400, access: "public", restricted: false },
    { url: "page-error-403", component: Error403, access: "public", restricted: false },
    { url: "page-error-404", component: Error404, access: "public", restricted: false },
    { url: "page-error-500", component: Error500, access: "public", restricted: false },
    { url: "page-error-503", component: Error503, access: "public", restricted: false },
  ];

  useEffect(()=>{
    let pathTemp = window.location.pathname;
    pathTemp = pathTemp.split("/");
    pathTemp = pathTemp[pathTemp.length - 1];
    let pagePathTemp = pathTemp.split("-").includes("page");
    setPath(pathTemp);
    setPagePath(pagePathTemp);
  }, [props.token, window.location.pathname])
  return (
    <Router basename="/">
      <div
        id={`${!pagePath ? "main-wrapper" : ""}`}
        className={`${!pagePath ? "show" : "mh100vh"} ${
          !path ? "right-profile" : ""
        }`}
      >
        {!pagePath && <Nav />}

        <div className={`${!pagePath ? "content-body" : ""}`}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>
              <Redirect exact from="/" to="/page-login" />
              {routes.map((data, i) => (
                <RouteWithLayout
                  key={i}
                  exact
                  path={`/${data.url}`}
                  component={data.component}
                  access={data.access}
                  restricted={data.restricted}
                />
              ))}
            </Switch>
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
    </Router>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.token
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Markup);