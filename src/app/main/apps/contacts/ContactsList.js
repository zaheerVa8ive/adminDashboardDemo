import React, {useEffect, useState} from 'react';
import {Avatar, Checkbox, Icon, IconButton, Typography} from '@material-ui/core';
import {FuseUtils, FuseAnimate} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
import ReactTable from "react-table";
import * as Actions from './store/actions';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';

function ContactsList(props)
{
    const dispatch = useDispatch();
    const contacts = useSelector(({contactsApp}) => contactsApp.contacts.entities);
    const selectedContactIds = useSelector(({contactsApp}) => contactsApp.contacts.selectedContactIds);
    const searchText = useSelector(({contactsApp}) => contactsApp.contacts.searchText);
    const user = useSelector(({contactsApp}) => contactsApp.user);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText)
        {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if ( searchText.length === 0 )
            {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if ( contacts )
        {
            setFilteredData(getFilteredArray(contacts, searchText));
        }
    }, [contacts, searchText]);


    if ( !filteredData )
    {
        return null;
    }

    if ( filteredData.length === 0 )
    {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                    There are no contacts!
                </Typography>
            </div>
        );
    }
    filteredData.map(contact => {
        contact['active'] = ( contact['active'] == true ? "True" : "False" );
        contact['key'] = contact['objectId'];
        contact['statusTime'] = new Date(contact['statustime']['iso']).toGMTString();
        contact['userName'] = contact['user']['className'];
        return contact
    });

    console.log("filteredData",filteredData);

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <ReactTable
                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                data={filteredData}
                columns={[
                    {
                        Header    : "Customer Id",
                        accessor  : "customerId"
                    },
                    {
                        Header    : "Mac Address",
                        accessor  : "macAddress"
                    },
                    {
                        Header    : "Serial No",
                        accessor  : "serialNo"
                    },
                    {
                        Header    : "Active",
                        accessor  : "active"
                    },
                    {
                        Header    : "Billing Address",
                        accessor  : "billingAddress"
                    },
                    {
                        Header    : "Status Time",
                        accessor  : "statusTime"
                    },
                    {
                        Header    : "Price",
                        accessor  : "price"
                    },
                    {
                        Header    : "Tax",
                        accessor  : "tax"
                    },
                    {
                        Header    : "User",
                        accessor  : "userName"
                    },
                    {
                        Header: "",
                        width : 128,
                        Cell  : row => (
                            <div className="flex items-center">
                                <IconButton
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        dispatch(Actions.openEditContactDialog(row.original));
                                    }}
                                >
                                    <Icon>edit</Icon>
                                </IconButton>
                            </div>
                        )
                    },
                    {
                        Header: "",
                        width : 128,
                        Cell  : row => (
                            <div className="flex items-center">
                                <IconButton
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        dispatch(Actions.removeContact(row.original.id));
                                    }}
                                >
                                    <Icon>delete</Icon>
                                </IconButton>
                            </div>
                        )
                    }
                ]}
                defaultPageSize={10}
                noDataText="No contacts found"
            />
        </FuseAnimate>
    );
}

export default ContactsList;
