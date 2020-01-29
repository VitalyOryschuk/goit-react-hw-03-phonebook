import React, { Component } from 'react';
import shortid from 'shortid';
import SearchForm from './SearchForm/SearchForm';
import ContactsList from './ContactsList/ContactsList';
import Filter from './Filter/Filter';
import styles from './style.module.css';

const filterContacts = (contacts, filter) => {
  return contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase()),
  );
};

const findContact = (contacts, contact) =>
  contacts.find(item => item.name.toLowerCase() === contact.name.toLowerCase());

export default class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const persistedTask = localStorage.getItem('contacts');
    if (persistedTask) {
      const contacts = JSON.parse(persistedTask);
      this.setState({ contacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  handleSignUp = contact => {
    const contactFind = findContact(this.state.contacts, contact);
    const contactToAdd = {
      ...contact,
      id: shortid.generate(),
    };

    if (contact.name) {
      contactFind
        ? alert(`${contactFind.name} is already in contacts`)
        : this.setState(state => ({
            contacts: [...state.contacts, contactToAdd],
          }));
    } else {
      alert('Input name please!');
    }
  };

  handleChangeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  deleteContact = id => {
    this.setState(state => ({
      contacts: state.contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = filterContacts(contacts, filter);
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>PhoneBook</h2>
        <SearchForm onChangeSubmit={this.handleSignUp} />
        {contacts.length > 0 && <h2 className={styles.title}>Contacts</h2>}
        {contacts.length > 1 && (
          <Filter value={filter} onChangeFilter={this.handleChangeFilter} />
        )}
        <ContactsList items={filteredContacts} onDeleteContact={this.deleteContact} />
      </div>
    );
  }
}
