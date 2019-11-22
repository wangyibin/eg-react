import React from "react";
import PropTypes from "prop-types";
import JSON5 from "json5";
import { TrackModel } from "../model/TrackModel";
import { TrackOptionsUI } from "./trackManagers/TrackOptionsUI";

import "./TextTrack.css";

const TEXT_TYPE_DESC = {
  bed: {
    desc: "text file in BED format, each column is separated by tab",
    example: `chr1	13041	13106	reg1	1	+
chr1	753329	753698	reg2	2	+
chr1	753809	753866	reg3	3	+
chr1	754018	754252	reg4	4	+
chr1	754361	754414	reg5	5	+
chr1	754431	754492	reg6	6	+
chr1	755462	755550	reg7	7	+
chr1	761040	761094	reg8	8	+
chr1	787470	787560	reg9	9	+
chr1	791123	791197	reg10	10	+`
  },
  bedGraph: {
    desc:
      "text file in bedGraph format, 4 columns bed file, each column is chromosome, start, end and value",
    example: `chr6	52155366	52155379	14
chr6	52155379	52155408	13
chr6	52155408	52155426	12
chr6	52155426	52155433	11
chr6	52155433	52155442	10
chr6	52155442	52155446	9
chr6	52155446	52155472	8
chr6	52155472	52155475	9
chr6	52155475	52155499	8
chr6	52155499	52155501	7`
  },
  "longrange-AndreaGillespie": {
    desc: "a long-range interaction format by Andrea Gillespie",
    example: `"id"	"trans"	"b2b"	"distance"	"count"	"score"
"chr20:49368733-49369493<->chr20:50528173-50533850"	FALSE	FALSE	1161898.5	309	79.7857303792859
"chr5:1287807-1300847<->CMV:157565-178165"	TRUE	FALSE	NA	51	62.8795109965162
"chr2:172098385-172101315<->chrUn_KN707623v1_decoy:353-1495"	TRUE	FALSE	NA	48	57.4855116417847
"chr2:172089426-172092129<->chrUn_KN707623v1_decoy:353-1495"	TRUE	FALSE	NA	46	54.0869303212974
"chr20:49368733-49369493<->chr20:50526988-50528172"	FALSE	FALSE	1158467	177	42.0222133940233
"chr20:49368733-49369493<->chr20:50511129-50512012"	FALSE	FALSE	1142457.5	162	37.686580957954
"chr5:1270279-1272416<->SV40:5172-5243"	TRUE	FALSE	NA	35	37.2369416773403
"chr8:128109053-128110360<->chr8:129534833-129536039"	FALSE	FALSE	1425729.5	100	34.8639202860754
"chr20:49345639-49354229<->chr20:50511129-50512012"	FALSE	FALSE	1161636.5	129	30.5556940820741`
  }
};

export class TextTrack extends React.Component {
  static propTypes = {
    onTracksAdded: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      textType: "bed",
      msg: "",
      isFileHuge: false,
      options: null
    };
  }

  handleTypeChange = event => {
    this.setState({ textType: event.target.value });
  };

  handleFileUpload = async event => {
    this.setState({ msg: "Uploading track..." });
    let tracks;
    const { options } = this.state;
    const typedArray = this.state.textType.split("-");
    const textConfig = {
      isFileHuge: this.state.isFileHuge,
      subType: typedArray[1]
    };
    const fileList = Array.from(event.target.files);
    tracks = fileList.map(
      file =>
        new TrackModel({
          type: typedArray[0],
          url: null,
          fileObj: file,
          name: file.name,
          label: file.name,
          isText: true,
          files: null,
          textConfig,
          options
        })
    );
    this.props.onTracksAdded(tracks);
    this.setState({ msg: "Track added." });
  };

  handleCheck = () => {
    this.setState(prevState => {
      return { isFileHuge: !prevState.isFileHuge };
    });
  };

  getOptions = value => {
    let options = null;
    try {
      options = JSON5.parse(value);
    } catch (error) {}
    this.setState({ options });
  };

  renderTextForm = () => {
    return (
      <div>
        <h3>1. Choose text file type</h3>
        <div>
          <label>
            <select
              value={this.state.textType}
              onChange={this.handleTypeChange}
            >
              <option value="bed">bed</option>
              <option value="bedGraph">bedGraph</option>
              <option value="longrange-AndreaGillespie">
                long-range format by Andrea Gillespie
              </option>
            </select>
          </label>
        </div>
        <div>{TEXT_TYPE_DESC[this.state.textType].desc}</div>
        <div className="TextTrack-textFormDesc">
          <h4>Example:</h4>
          <pre>{TEXT_TYPE_DESC[this.state.textType].example}</pre>
        </div>
        <div>
          <TrackOptionsUI onGetOptions={value => this.getOptions(value)} />
        </div>
        <div>
          <label htmlFor="hugeCheck">
            Use a Worker thread:{" "}
            <input
              type="checkbox"
              checked={this.state.isFileHuge}
              onChange={this.handleCheck}
            />{" "}
            <span className="TextTrack-hint">
              (Check if your file is huge.)
            </span>
          </label>
        </div>
        <div>
          <label htmlFor="textFile">
            <h3>2. Choose text files:</h3>
            <input
              type="file"
              id="textFile"
              multiple
              onChange={this.handleFileUpload}
            />
            <p className="TextTrack-hint">
              if you choose more than one file, make sure they are of same type.
            </p>
          </label>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderTextForm()}
        <div className="text-danger font-italic">{this.state.msg}</div>
      </div>
    );
  }
}
