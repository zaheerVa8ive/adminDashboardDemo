import axios from 'axios';
import _ from '@lodash';
import {getUserData} from 'app/main/apps/contacts/store/actions/user.actions';

export const GET_CONTACTS = '[CONTACTS APP] GET CONTACTS';
export const SET_SEARCH_TEXT = '[CONTACTS APP] SET SEARCH TEXT';
export const TOGGLE_IN_SELECTED_CONTACTS = '[CONTACTS APP] TOGGLE IN SELECTED CONTACTS';
export const SELECT_ALL_CONTACTS = '[CONTACTS APP] SELECT ALL CONTACTS';
export const DESELECT_ALL_CONTACTS = '[CONTACTS APP] DESELECT ALL CONTACTS';
export const OPEN_NEW_CONTACT_DIALOG = '[CONTACTS APP] OPEN NEW CONTACT DIALOG';
export const CLOSE_NEW_CONTACT_DIALOG = '[CONTACTS APP] CLOSE NEW CONTACT DIALOG';
export const OPEN_EDIT_CONTACT_DIALOG = '[CONTACTS APP] OPEN EDIT CONTACT DIALOG';
export const CLOSE_EDIT_CONTACT_DIALOG = '[CONTACTS APP] CLOSE EDIT CONTACT DIALOG';
export const SET_EXCELL_FILE_DATA = '[CONTACTS APP] SET EXCELL FILE DATA';
export const GET_EXCELL_FILE_DATA = '[CONTACTS APP] GET EXCELL FILE DATA';
export const ADD_CONTACT = '[CONTACTS APP] ADD CONTACT';
export const UPDATE_CONTACT = '[CONTACTS APP] UPDATE CONTACT';
export const REMOVE_CONTACT = '[CONTACTS APP] REMOVE CONTACT';
export const REMOVE_CONTACTS = '[CONTACTS APP] REMOVE CONTACTS';
export const TOGGLE_STARRED_CONTACT = '[CONTACTS APP] TOGGLE STARRED CONTACT';
export const TOGGLE_STARRED_CONTACTS = '[CONTACTS APP] TOGGLE STARRED CONTACTS';
export const SET_CONTACTS_STARRED = '[CONTACTS APP] SET CONTACTS STARRED ';
const url = 'https://2441333b.ngrok.io';
axios.defaults.headers = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': 'lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1',
    'X-Parse-REST-API-Key':'tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD'
  };

export function getContacts(routeParams)
{
    const request = axios.get(`${url}/api/classes/AuthenticDevices?include=updatedBy&where={"isDelete":false}`);

    return (dispatch) =>
        request.then((response) => {
            console.log("response",response.data.results);
            dispatch({
                type   : GET_CONTACTS,
                payload: response.data.results,
                routeParams
            })
        });
}


export function setSearchText(event)
{
    return {
        type      : SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function toggleInSelectedContacts(contactId)
{
    return {
        type: TOGGLE_IN_SELECTED_CONTACTS,
        contactId
    }
}

export function selectAllContacts()
{
    return {
        type: SELECT_ALL_CONTACTS
    }
}

export function deSelectAllContacts()
{
    return {
        type: DESELECT_ALL_CONTACTS
    }
}

export function openNewContactDialog()
{
    return {
        type: OPEN_NEW_CONTACT_DIALOG
    }
}

export function closeNewContactDialog()
{
    return {
        type: CLOSE_NEW_CONTACT_DIALOG
    }
}

export function openEditContactDialog(data)
{
    return {
        type: OPEN_EDIT_CONTACT_DIALOG,
        data
    }
}

export function closeEditContactDialog()
{
    return {
        type: CLOSE_EDIT_CONTACT_DIALOG
    }
}

export function setExcellFileData(data)
{
    return {
        type: SET_EXCELL_FILE_DATA,
        data
    }
}

export function addContact(newContact)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;
        let user = JSON.parse(localStorage.getItem('user'));
        console.log("user",user);
        let payload = _.clone(newContact);
        payload['createdBy'] = {
          '__type': 'Pointer',
          'className': '_User',
          'objectId':user['objectId']
        };
        payload['updatedBy'] = {
            '__type': 'Pointer',
            'className': '_User',
            'objectId':user['objectId']
        };
        payload['active'] = (payload['active'] == "False" ? false : true);
        payload['price'] = Number(payload['price']);
        payload['tax'] = Number(payload['tax']);
        payload['isDelete'] = false;
        console.log("payload",payload);
        const request = axios.post(`${url}/api/classes/AuthenticDevices`, JSON.stringify(payload));

        return request.then((response) => {
            console.log("140 , response",response)
            Promise.all([
                dispatch({
                    type: ADD_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        }).catch(error => {
            console.log("error -----> : ",error.response);
            var message = error.response.data.error;
            console.log("message",message);
        });
    };
}

export function saveProductsFromExcell (data){
    console.log("data",data);
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;
        let user = JSON.parse(localStorage.getItem('user'));
        let payLoads = [];
        for (var j =0;  j <data.length ; j++){
            let payload = {
                'createdBy':{
                    '__type': 'Pointer',
                    'className': '_User',
                    'objectId':user['objectId']
                },
                'updatedBy':{
                    '__type': 'Pointer',
                    'className': '_User',
                    'objectId':user['objectId']
                },
                'customerId':data[j][0],
                'macAddress':data[j][1],
                'serialNo':data[j][2],
                'active':data[j][3],
                'billingAddress':data[j][4],
                'price':Number(data[j][5]),
                'tax':Number(data[j][6]),
                'isDelete':false
            };
            payLoads.push({
                "method": "POST",
                "path": "/api/classes/AuthenticDevices",
                "body":payload
            });
        }
        console.log("payLoads",payLoads);
        const request = axios.post(`${url}/api/batch`, JSON.stringify({"requests":payLoads}));

        return request.then((response) => {
            console.log("140 , response",response)
            Promise.all([
                dispatch({
                    type: ADD_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        }).catch(error => {
            console.log("error -----> : ",error.response);
            var message = error.response.data.error;
            console.log("message",message);
        });
    };
}

export function updateContact(contact)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;
        console.log("contact",contact);
        let user = JSON.parse(localStorage.getItem('user'));

        let payloadPrim = _.clone(contact);
        let objectId = payloadPrim['objectId'];
        let payload = {
            'updatedBy' : {
                '__type': 'Pointer',
                'className': '_User',
                'objectId':user['objectId']
            },
            'active':(payloadPrim['active'] == "False" ? false : true)
        }
        
        const request = axios.put(`${url}/api/classes/AuthenticDevices/${objectId}`, JSON.stringify(payload));

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function removeContact(contact)
{
    return (dispatch, getState) => {
        console.log("contact , Deleted : ",contact);
        let objectId = contact['objectId'];
        let user = JSON.parse(localStorage.getItem('user'));
        let payload = {
            'deletedBy' : {
                '__type': 'Pointer',
                'className': '_User',
                'objectId':user['objectId']
            },
            'isDelete': true
        }
        const {routeParams} = getState().contactsApp.contacts;
        const request = axios.put(`${url}/api/classes/AuthenticDevices/${objectId}`, JSON.stringify(payload));
        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_CONTACT
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}


export function removeContacts(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/remove-contacts', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_CONTACTS
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                })
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function toggleStarredContact(contactId)
{
    return (dispatch, getState) => {
        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/toggle-starred-contact', {
            contactId
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: TOGGLE_STARRED_CONTACT
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function toggleStarredContacts(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/toggle-starred-contacts', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: TOGGLE_STARRED_CONTACTS
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function setContactsStarred(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/set-contacts-starred', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: SET_CONTACTS_STARRED
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}

export function setContactsUnstarred(contactIds)
{
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/set-contacts-unstarred', {
            contactIds
        });

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: SET_CONTACTS_STARRED
                }),
                dispatch({
                    type: DESELECT_ALL_CONTACTS
                }),
                dispatch(getUserData())
            ]).then(() => dispatch(getContacts(routeParams)))
        );
    };
}
