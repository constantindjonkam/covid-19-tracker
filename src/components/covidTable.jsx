import React, { Component } from "react";
import _ from "lodash";
import CountUp from "react-countup";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./covidTable.css";

class CovidTable extends Component {
  state = {
    total: [],
    data: [],
    input: "",
    loading: true,
  };

  async componentDidMount() {
    const result = new Promise(async (resolve) => {
      const resultInfo = await fetch(
        "https://covid-193.p.rapidapi.com/statistics",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "YOUR_API_KEY_HERE",
          },
        }
      );
      const { response } = await resultInfo.json();
      resolve(response);
    });

    const total = new Promise(async (resolve) => {
      const totalInfo = await fetch(
        "https://covid-19-data.p.rapidapi.com/totals",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key": "YOUR_API_KEY_HERE",
          },
        }
      );
      const totalArr = await totalInfo.json();
      resolve(totalArr);
    });

    if (!total) {
      alert("Make sure you have set your API key");
      return;
    }

    Promise.all([result, total]).then((res) =>
      this.setState({
        data: res[0],
        total: res[1][0],
        loading: false,
      })
    ).catch = (ex) => console.log(ex);
  }

  handleSearch = ({ target }) => {
    this.setState({ input: target.value });
  };

  render() {
    const { data, loading, total, input } = this.state;
    if (!total) {
      alert("Make sure you have set your API key");
      return null;
    }
    let sorted = _.orderBy(data, "cases.total", "desc");
    if (input) {
      sorted = data.filter((d) =>
        d.country.toLowerCase().includes(input.toLowerCase())
      );
    }
    return (
      <div>
        <div className="generalInfo">
          <h3>
            Total Cases:{" "}
            {loading || (
              <CountUp className="color" separator="," end={total.confirmed} />
            )}
          </h3>
          <h3>
            Total Deaths:{" "}
            {loading || (
              <CountUp className="color" separator="," end={total.deaths} />
            )}
          </h3>
          <h3>
            Total Critical:{" "}
            {loading || (
              <CountUp className="color" separator="," end={total.critical} />
            )}
          </h3>
          <h3>
            Total Recovered:{" "}
            {loading || (
              <CountUp className="color" separator="," end={total.recovered} />
            )}
          </h3>
        </div>

        <div className="clear-fix"></div>

        <div className="form-group" id="searchBar">
          <input
            onChange={this.handleSearch}
            placeholder="Search Country"
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>

        <SimpleBar style={{ maxHeight: 600 }} forceVisible="y">
          <table className="table table-sm table-bordered table-hover text-center">
            <thead>
              <tr className="text-center text-muted">
                <th>Country</th>
                <th>Total Cases</th>
                <th>New cases</th>
                <th>Deaths</th>
                <th>New Deaths</th>
                <th>Recovered</th>
                <th>Active Cases</th>
                <th>Critical</th>
              </tr>
            </thead>
            <tbody className="text-center tableBody">
              {loading ||
                sorted.map((d) => (
                  <tr className="font-weight-bold" key={d.country}>
                    <td className="text-primary">{d.country}</td>
                    <td>
                      {d.cases.total
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td style={d.cases.new ? { color: "#ff8400" } : {}}>
                      {d.cases.new
                        ? d.cases.new
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                        : ""}
                    </td>
                    <td>
                      {d.deaths.total
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td style={d.deaths.new ? { color: "#e30b25" } : {}}>
                      {d.deaths.new
                        ? d.deaths.new
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                        : ""}
                    </td>
                    <td>
                      {d.cases.recovered
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td>
                      {d.cases.active
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td>
                      {d.cases.critical
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loading ? (
            <img
              id="loadingImg"
              src={require("./loading.gif")}
              alt="loading..."
            ></img>
          ) : (
            ""
          )}
        </SimpleBar>
      </div>
    );
  }
}

export default CovidTable;
