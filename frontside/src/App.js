import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import PrivateRoute from './components/routing/PrivateRoute';
import Alert from './components/layout/Alert';
import Login from './components/auth/Login';
import Landing from './components/layout/Landing';
import Navibar from './components/layout/Navibar';
import { Dashboard } from './components/dashboard/Dashboard';
import AllTickets from './components/tickets/AllTickets';
import Ticket from './components/ticket/Ticket';
import MyTickets from './components/tickets/MyTickets';
import Customers from './components/customers/Customers';
import Customer from './components/customer/Customer';
import TicketForm from './components/tickets/TicketForm';
import NewCustomer from './components/customers/NewCustomer';
import Client from './components/client/Client';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);
  return (
    <>
    <section className='main-cont' style={{ backgroundSize: 'cover'}}>
      
      <Provider store={store}>
        <Router>
          <Navibar />
          <Route exact path='/' component={Landing} />
            <section className='mainsection text-white mt-3'>
            <Alert />
            <Switch>
                <Route exact path='/login' component={Login} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute exact path='/alltickets' component={AllTickets} />
                <PrivateRoute exact path='/ticket/:id' component={Ticket} />
                <PrivateRoute exact path='/mytickets' component={MyTickets} />
                <PrivateRoute exact path='/customers' component={Customers} />
                <PrivateRoute exact path='/customer/:id' component={Customer} />
                <PrivateRoute exact path='/createticket' component={TicketForm} />
                <PrivateRoute exact path='/addcustomer' component={NewCustomer} />
                <PrivateRoute exact path='/client/:id' component={Client} />
            </Switch>
          </section>
        </Router>
      </Provider>
    </section>
    </>
  );
}

export default App;
