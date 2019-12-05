import React, { useState, useEffect } from 'react';
import './App.css';
import { isVacancy } from './actions/garageActions';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, InputGroup, Input, Form } from 'reactstrap';

function App() {
  //States for current page of the application
  const [vacancy, setVacancy] = useState('');
  const [Error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [ticketNumberPay, setTicketNumberPay] = useState([]);
  const [ticketNumberLeave, setTicketNumberLeave] = useState([]);

  //mock db state
  const [TotalSpotsAvalible, setTotalSpotsAvalible] = useState('');

  // get the current number of stops and the number of taken spots
  // then validate if there is any empty spaces.
  // lastly set the vacancy variable to the appropriate value
  // the if statment is only here because there is to backend updated state
  function getVacancy() {
    let avalibleSpots;
    if (TotalSpotsAvalible === '') {
      let results = isVacancy();
      avalibleSpots = results.totalSpots - results.totalSpotsTaken;
      setTotalSpotsAvalible(avalibleSpots);
    } else {
      avalibleSpots = TotalSpotsAvalible;
    }
    if (avalibleSpots === 0) {
      setVacancy('No Vacancy');
    } else {
      setVacancy('Vacancy');
    }
  }

  //The getTicket function is call when the user clicks the Get Ticket button on the page.
  //First it validates that there is spots avalible, if not the returns an error message.
  //Second if there are avalible spots the time is stored and the total vacancy is validated
  function getTicket() {
    restMessages();
    if (vacancy === 'No Vacancy') {
      setError('Sorry but there are no more spots available');
    } else {
      let ticketNumber = Math.floor(Math.random() * 1000000000);
      setCustomers([...customers, { entryTime: Date.now(), ticketNumber }]);
      setTotalSpotsAvalible(TotalSpotsAvalible - 1);
      setResponseMessage(`your ticket number is ${ticketNumber}`);
      if (TotalSpotsAvalible - 1 === 0) {
        setVacancy('No Vacancy');
      }
    }
  }

  // This function resets all the messages to the customer
  function restMessages() {
    setError('');
    setResponseMessage('');
  }

  // This function processes the customer when they are leaving the garage
  // first resets any page message
  // then validates that the ticket is correct and respons with an error if it is not
  // and if it is valid, thenit removes the ticket number and opens a spot for another customer
  function LeaveGarage(e) {
    e.preventDefault();
    restMessages();
    let customer = customers.filter(cust => {
      return cust.ticketNumber.toString() === ticketNumberLeave;
    });
    if (customer.length > 0) {
      customers.map((cust, index) => {
        if (cust === customer[0]) {
          customers.splice(index, 1);
        }
      });
      setTotalSpotsAvalible(TotalSpotsAvalible + 1);
      setResponseMessage('Thank you and have a good day');
    } else {
      setError(
        'There is no Ticket with that number, Please validate the number and try again.'
      );
    }
  }

  // This function handles everything to do with the pay button
  // resets all messages on the page.
  // gets the customer information to validate the ticket number
  // if the information is correct then the paid amount is calculated and displayed
  function payTicket(e) {
    e.preventDefault();
    restMessages();
    let customer = customers.filter(cust => {
      return cust.ticketNumber.toString() === ticketNumberPay;
    });

    if (customer.length > 0) {
      let currentTime = Date.now();
      let diff = (currentTime - customer.entryTime) / 1000;
      diff /= 60 * 60;
      let totalTime = Math.abs(diff);
      if (totalTime > 6) {
        setResponseMessage('Your all day payment is $10.13');
      } else if (totalTime > 3) {
        setResponseMessage('Your upto 6 hr payment is $6.75');
      } else if (totalTime > 1) {
        setResponseMessage('Your upto 3 hr payment is $4.50');
      } else {
        setResponseMessage('Your upto 1 hr payment is $3');
      }
    } else {
      setError(
        'There is no Ticket with that number, Please validate the number and try again.'
      );
    }
  }

  //this handles the input box for the pay section
  // where the user enters in the ticket number
  function handleChangePay(e) {
    setTicketNumberPay(e.target.value);
  }

  //this handles the input box for the leave section
  // where the user enters in the ticket number
  function handleChangeLeave(e) {
    setTicketNumberLeave(e.target.value);
  }

  // use effect runs every time there is a need for a rerender.
  // this keeps the vacancy message at the top of the page up to date
  useEffect(() => {
    getVacancy();
  }, [TotalSpotsAvalible, vacancy]);

  return (
    <div className='App'>
      <header className='App-header'>
        <h2>Welcome to The Garage</h2>
      </header>
      <div className='body'>
        <h4>There is {vacancy}</h4>
        <div>
          <div>
            <Button color='primary' onClick={getTicket}>
              Get Ticket
            </Button>
          </div>
          <div className='payBox'>
            <Form onSubmit={payTicket}>
              <InputGroup>
                <Input value={ticketNumberPay} onChange={handleChangePay} />
                <Button color='primary'>Pay</Button>
              </InputGroup>
            </Form>
          </div>
          <div className='payBox'>
            <Form onSubmit={LeaveGarage}>
              <InputGroup>
                <Input value={ticketNumberLeave} onChange={handleChangeLeave} />
                <Button color='primary'>Leave Garage</Button>
              </InputGroup>
            </Form>
          </div>
          <div className='payAmount'>
            <h4>{responseMessage}</h4>
          </div>
          <div className='noVacancyError'>
            <h4>{Error}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
