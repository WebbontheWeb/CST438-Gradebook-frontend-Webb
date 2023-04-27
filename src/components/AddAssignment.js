import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Stack from '@mui/material/Stack';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js';
import { Link, Redirect } from 'react-router-dom'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// import { useState } from 'react';
// import ReactDOM from 'react-dom/client';

import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

//import { dayjs } from 'dayjs';
import * as dayjs from "dayjs"
//import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



class AddAssignment extends React.Component {
  constructor(props) {
    super(props);

    //test values
    this.state = {
      assignmentName: "",
      classId: "",
      dueDate: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    //console.log("Testing Please work")
    if(event.validationError == null){
      const target = event.target;
      const value = target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
   }
  }

  //it took me so long to get the date to work properly
  //the picker is iffy so you have to validate it
  handleDate(value) {
    this.setState({
      dueDate: value
    });
  }

  handleSubmit(event) {
    console.log("AddAssignment.handleSubmit");
    console.log("testing pls")
    const token = Cookies.get('XSRF-TOKEN');
    
    fetch(`${SERVER_URL}/gradebook/${this.state.classId}/${this.state.dueDate.format('YYYY-MM-DD')}/${this.state.assignmentName}` , 
        {  
          method: 'POST'
        })
    .then(res => {
        if (res.ok) {
          toast.success("Assignment Added!", {
          position: toast.POSITION.BOTTOM_LEFT
          });
        } else {
          toast.error("Add Assignment failed", {
          position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Put http status =' + res.status);
    }})
      .catch(err => {
        toast.error("Add Assignment failed", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
      });
 };

  render() {
    return (
      <div align="center">
        <h3 sx={{m: 8}}>Add Assignment</h3>
        <form>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <TextField
              required
              name="assignmentName"
              label="Assignment Name"
              value={this.state.assignmentName}
              placeholder="test"
              onChange={this.handleChange}
            />

            <TextField
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} //only allows numbers
              name="classId"
              label="Class ID"
              placeholder="0000000"
              value={this.state.classId}
              onChange={this.handleChange}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                name="dueDate"
                label="Due Date"
                value={this.state.dueDate}
                onChange={(newValue, context) => (
                  context.validationError === null ? this.handleDate(newValue) : console.log("Not Valid Date")
                )}
              />
            </LocalizationProvider>
          
            <Button name="Submit" size="large" variant="contained" onClick={this.handleSubmit}>Submit</Button>
            <Button name="Back" component={Link} to={{pathname:'/'}} color="error" size="medium" variant="contained">Back</Button>
          </Stack>
        </form>
        <ToastContainer autoClose={1500} /> 
      </div>
    )
  }
}

export default AddAssignment;