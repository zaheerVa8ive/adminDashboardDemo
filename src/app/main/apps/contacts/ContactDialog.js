import React, {useEffect, useCallback} from 'react';
import {TextField, Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, Avatar} from '@material-ui/core';
import {useForm} from '@fuse/hooks';
import FuseUtils from '@fuse/FuseUtils';
import * as Actions from './store/actions';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import {useDispatch, useSelector} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

const defaultFormState = {
    customerId    : '',
    macAddress: '',
    serialNo  : '',
    active: '',
    billingAddress : '',
    price: '',
    tax   : ''
};

const useStyles = makeStyles(theme => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
        label:{
            width:"30%"
        },
        divClass:{
            width:"90%"
        },
        textClass:{
            width:"70%"
        },
        button: {
            margin: theme.spacing(1),
          },
    }));

function ContactDialog(props)
{
    const dispatch = useDispatch();
    const classes = useStyles();
    const contactDialog = useSelector(({contactsApp}) => contactsApp.contacts.contactDialog);

    const {form, handleChange, setForm} = useForm(defaultFormState);

    console.log("contactDialog",contactDialog)

    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if ( contactDialog.type === 'edit' && contactDialog.data )
            {
                setForm({...contactDialog.data});
            }

            /**
             * Dialog type: 'new'
             */
            if ( contactDialog.type === 'new' )
            {
                setForm({
                    ...defaultFormState,
                    ...contactDialog.data,
                    // id: FuseUtils.generateGUID()
                });
            }
        },
        [contactDialog.data, contactDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if ( contactDialog.props.open )
        {
            initDialog();
        }

    }, [contactDialog.props.open, initDialog]);

    function closeComposeDialog()
    {
        contactDialog.type === 'edit' ? dispatch(Actions.closeEditContactDialog()) : dispatch(Actions.closeNewContactDialog());
    }

    function canBeSubmitted()
    {
        return (
            form.name.length > 0
        );
    }

    function handleSubmit(event)
    {
        event.preventDefault();

        if ( contactDialog.type === 'new' )
        {
            dispatch(Actions.addContact(form)).then(() =>{
                setForm({
                    ...defaultFormState,
                    ...contactDialog.data
                });
            });
        }
        else
        {
            dispatch(Actions.updateContact(form));
        }
        closeComposeDialog();
    }

    function handleRemove()
    {
        dispatch(Actions.removeContact(form));
        closeComposeDialog();
    }
    let divParent = `flex ${classes.divClass}`;
    let fieldParent = `mb-24 ${classes.textClass}`;
    const actives = [
        {'id':1,'value':'False'},
        {'id':2,'value':'True'},
    ];
    const active = actives.map(act => (
        <MenuItem key={act.id} value={act.value}>
            {act.value}
        </MenuItem>
    ));

    return (
        <Dialog
            classes={{
                paper: "m-24"
            }}
            {...contactDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {contactDialog.type === 'new' ? 'New Contact' : 'Edit Contact'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
            {contactDialog.type === 'new' ? (
                <DialogContent classes={{root: "p-24"}}>
                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Customer Id</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <TextField
                                className="mb-24"
                                id="customerId"
                                autoFocus
                                name="customerId"
                                value={form.customerId}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                         </div>
                    </div>

                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Mac Address</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <TextField
                                className="mb-24"
                                id="macAddress"
                                autoFocus
                                name="macAddress"
                                value={form.macAddress}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                         </div>
                    </div>

                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Serial No</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <TextField
                                className="mb-24"
                                id="serialNo"
                                autoFocus
                                name="serialNo"
                                value={form.serialNo}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                         </div>
                    </div>

                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Active</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <Select
                                className="mb-24"
                                autoFocus
                                id="active"
                                name="active"
                                value={form.active}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                >
                                {active}
                            </Select>
                         </div>
                    </div>

                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Billing Address</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <TextField
                                className="mb-24"
                                id="billingAddress"
                                autoFocus
                                name="billingAddress"
                                value={form.billingAddress}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                         </div>
                    </div>

                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Price</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <TextField
                                className="mb-24"
                                id="price"
                                autoFocus
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                         </div>
                    </div>

                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Tax</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <TextField
                                className="mb-24"
                                id="tax"
                                autoFocus
                                name="tax"
                                value={form.tax}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                         </div>
                    </div>
                </DialogContent>
            ):(
                <DialogContent classes={{root: "p-24"}}>
                    <div className={divParent} >
                        <div className={classes.label}>
                                <InputLabel >Active</InputLabel>
                            </div>
                        <div className={fieldParent}>
                            <Select
                                className="mb-24"
                                autoFocus
                                id="active"
                                name="active"
                                value={form.active}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                >
                                {active}
                            </Select>
                         </div>
                    </div>
                </DialogContent>

            )}
                
                {contactDialog.type === 'new' ? (
                    
                    <div className={divParent}>
                        <div className={classes.label}>
                        </div>
                        <div className={fieldParent}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.button}
                            onClick={handleSubmit}
                            // disabled={!canBeSubmitted()}
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                        </div>
                    </div>
                ) : (
                    <div className={divParent}>
                        <div className={classes.label}>
                        </div>
                        <div className={fieldParent}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.button}
                            onClick={handleSubmit}
                            // disabled={!canBeSubmitted()}
                            startIcon={<SaveIcon />}
                        >
                             Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={handleRemove}
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                        </div>
                    </div>
                )}
            </form>
        </Dialog>
    );
}

export default ContactDialog;
