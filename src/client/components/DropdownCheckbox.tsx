import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import axios from "axios";
import AsyncSelect from "react-select/async";
import Select from "react-select/base";

const Option = (props : any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default class DropdownCheckbox extends Component <{}, {optionSelected: null, rssIds: any[], optionsList: any[]}> {


  constructor(props : any) {
    super(props);
    const list = this.getRssList()
    this.state = {
      optionSelected: null,
      rssIds: [],
      optionsList: list

    };

    console.log("this is the options list:")
    console.log(this.state.optionsList)
  }

  handleCheckboxChange = (event: any) => {
    if (event.target.checked) {
      if (!this.state.rssIds.includes(event.target.value)) {
        this.setState(prevState => ({rssIds: [...prevState.rssIds, event.target.value]}))
      }
      else {
        this.setState(prevState => ({rssIds: prevState.rssIds.filter(Id => Id !== event.target.value)}))
      }
    }
  }

  getRssList = () =>  {
    const response = axios.get("api/rss")
        .then(response => {


          const data = [];

          for (let item of response.data) {
            const option = {
              value: item.id.toString(),
              label: item.name
            }

            data.push(option)
          }

          console.log(this.state.optionsList)
          console.log("THIS IS WHAT IS RETURNED")
          console.log(data)



          return data

        });


    return [];



  };

  handleChange = (selected : any) => {
    this.setState({
      optionSelected: selected
    });
  };



  loadOptions = ( callback: (options: any[]) => void) => {
  setTimeout(() => {
    return callback(this.getRssList());
  }, 1000);

  return null
};



  colourOptions = [
  { value: "ocean1", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" }
];

  render() {
    // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      return (

      <span
        className="d-inline-block"
        data-toggle="popover"
        data-trigger="focus"
        data-content="Please selecet account(s)"
      >
        <ReactSelect
          options={this.state.optionsList}
          isMulti
          isSearchable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{
            Option
          }}
          onChange={this.handleChange}
          value={this.state.optionSelected}
        />
      </span>

    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<DropdownCheckbox />, rootElement);