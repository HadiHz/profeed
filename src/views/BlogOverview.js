import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
// import UsersOverview from "./../components/blog/UsersOverview";
// import UsersByDevice from "./../components/blog/UsersByDevice";
import { Store, Dispatcher, Constants } from "./../flux";
import { BounceLoader } from "react-spinners";

class BlogOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      report: { statistics: {} },
      colors: {
        Done: {
          backgroundColor: "rgba(23,198,113,0.1)",
          borderColor: "rgb(23,198,113)"
        },
        Waiting: {
          backgroundColor: "rgb(0,123,255,0.1)",
          borderColor: "rgb(0,123,255)"
        },
        Pending: {
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)"
        },
        Error: {
          backgroundColor: "rgba(255,65,105,0.1)",
          borderColor: "rgb(255,65,105)"
        },
        Timeout: {
          backgroundColor: "rgba(255,180,0,0.1)",
          borderColor: "rgb(255,180,0)"
        }
      }
    };

    this.getReportSuccess = this.getReportSuccess.bind(this);
    this.getReportError = this.getReportError.bind(this);
    Store.on(Constants.GET_REPORT_SUCCESS, this.getReportSuccess);
    Store.on(Constants.GET_REPORT_ERROR, this.getReportError);
  }

  getReportSuccess = report => {
    this.setState({
      loading: false,
      report
    });
  };

  getReportError() {
    this.setState({
      loading: false
    });
  }

  componentWillMount() {
    Dispatcher.dispatch({ actionType: Constants.GET_REPORT });
  }
  render() {
    let { report, colors } = this.state;
    let smallStats = Object.keys(report.statistics).map((key, index) => {
      let value = report.statistics[key];
      return {
        label: key,
        value: value,
        percentage: false,
        decrease: false,
        increase: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { md: "6", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            ...colors[key],
            data: [1, 2, 1, 3, 5, 4, 7]
          }
        ]
      };
    });
    return (
      <Container fluid className="main-content-container px-4">
        <div style={{ margin: "auto", width: "10%" }}>
          <BounceLoader
            sizeUnit={"px"}
            size={30}
            color={"#007bff"}
            loading={this.state.loading}
          />
        </div>
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            title="Overview"
            subtitle="Dashboard"
            className="text-sm-left mb-3"
          />
        </Row>

        {/* Small Stats Blocks */}
        <Row>
          {smallStats.map((stats, idx) => (
            <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
              <SmallStats
                id={`small-stats-${idx}`}
                variation="1"
                chartData={stats.datasets}
                chartLabels={stats.chartLabels}
                label={stats.label}
                value={stats.value}
                percentage={stats.percentage}
                increase={stats.increase}
                decrease={stats.decrease}
              />
            </Col>
          ))}
        </Row>

        <Row>
          {/* Users Overview */}
          <Col lg="8" md="12" sm="12" className="mb-4">
            {/* <UsersOverview /> */}
          </Col>

          {/* Users by Device */}
          <Col lg="4" md="6" sm="12" className="mb-4">
            {/* <UsersByDevice /> */}
          </Col>
        </Row>
      </Container>
    );
  }
}
export default BlogOverview;
