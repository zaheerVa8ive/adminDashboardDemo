import React from 'react';
import {Hidden, Icon,Button, IconButton, Input, Paper, Typography} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import XLSX from "xlsx";
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from './store/actions';
const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }));

function ContactsHeader(props)
{
    const dispatch = useDispatch();
    const searchText = useSelector(({contactsApp}) => contactsApp.contacts.searchText);
    const excellFileData = useSelector(({contactsApp}) => contactsApp.contacts.fileData);
    const mainTheme = useSelector(({fuse}) => fuse.settings.mainTheme);
    const classes = useStyles();
    function handleUploadChange(e)
    {
        const file = e.target.files[0];
        if ( !file )
        {
            return;
        }
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
            console.log("reader",reader.result);
            const wb = XLSX.read(reader.result, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            console.log("data", data);
            dispatch(Actions.setExcellFileData(data));
        };
        reader.onerror = function () {
            console.log("error on load image");
        };
    }

    return (
        <div className="flex flex-1 items-center justify-between p-8 sm:p-24">

            <div className="flex flex-shrink items-center sm:w-224">
                <Hidden lgUp>
                    <IconButton
                        onClick={(ev) => {
                            props.pageLayout.current.toggleLeftSidebar()
                        }}
                        aria-label="open left sidebar"
                    >
                        <Icon>menu</Icon>
                    </IconButton>
                </Hidden>

                <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                        <Icon className="text-32 mr-12">account_box</Icon>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="h6" className="hidden sm:flex">Contacts</Typography>
                    </FuseAnimate>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">

                <ThemeProvider theme={mainTheme}>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Paper className="flex p-4 items-center w-full max-w-512 px-8 py-4" elevation={1}>

                            <Icon className="mr-8" color="action">search</Icon>

                            <Input
                                placeholder="Search for anything"
                                className="flex flex-1"
                                disableUnderline
                                fullWidth
                                value={searchText}
                                inputProps={{
                                    'aria-label': 'Search'
                                }}
                                onChange={ev => dispatch(Actions.setSearchText(ev))}
                            />
                        </Paper>
                    </FuseAnimate>
                </ThemeProvider>
            </div>
            <div className="flex flex-shrink items-center sm:w-224">
                <div className="flex items-center">
                            <input
                                accept="/*"
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={handleUploadChange}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                                <Icon className="text-32 mr-12">cloud_upload</Icon>
                                            </FuseAnimate>
                                </Button>
                            </label>
                            <Button
                                    className="whitespace-no-wrap"
                                    variant="contained"
                                    // disabled={!canBeSubmitted()}
                                    onClick={() => dispatch(Actions.saveProductsFromExcell(excellFileData))}
                                >
                                    Save
                            </Button> 
                </div>
            </div>
        </div>
    );
}

export default ContactsHeader;
