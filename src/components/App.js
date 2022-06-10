import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';

import s from './containerApp.module.css';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  handleFilterChange = e => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  filteredContacts = () => {
    const filterNormalize = this.state.filter.toLowerCase();
    return this.state.contacts
      .filter(contact => {
        return contact.name.toLowerCase().includes(filterNormalize);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  formSubmit = ({ name, number }) => {
    this.setState(prevState => {
      const { contacts } = prevState;
      const isContact = contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      );

      if (isContact) {
        toast.warn(`${name} is already in contact`, {
          theme: 'colored',
          autoClose: 4000,
          pauseOnHover: true,
          closeOnClick: true,
        });

        return contacts;
      } else {
        return {
          contacts: [
            {
              id: nanoid(5),
              name,
              number,
            },
            ...contacts,
          ],
        };
      }
    });
  };

  contactDelete = id => {
    this.setState(prevState => {
      const { contacts } = prevState;
      const contactsAfterDelete = contacts.filter(contact => contact.id !== id);
      return { contacts: [...contactsAfterDelete] };
    });
  };

  render() {
    const { filter } = this.state;
    return (
      <div className={s.containerApp}>
        <h1>Phone Book</h1>
        <ContactForm onSubmit={this.formSubmit} />
        <div className={s.containerContacts}>
          <h2>Contacts</h2>
          <Filter
            title="Find contact by name"
            onChange={this.handleFilterChange}
            value={filter}
          />

          <ContactList
            filteredContacts={this.filteredContacts()}
            onDelete={this.contactDelete}
          />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    );
  }
}

export default App;
