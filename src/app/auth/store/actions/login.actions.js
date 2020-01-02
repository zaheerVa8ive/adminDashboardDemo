import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import {setUserData} from './user.actions';
import * as Actions from 'app/store/actions';
axios.defaults.headers = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': 'lJ42aRr2G5yuP2lIqV94Cupx58EBP0eFLdstkIz1',
    'X-Parse-REST-API-Key':'tb7URXifVfbE8fWCDhT80lJQaL4FuTLzIg5vadTD'
  };

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin(payload)
{
    console.log("payload",payload);
    const request = axios.post('https://api.mux.life/api/login',payload);

    return (dispatch) =>
        request.then((user) => {
            console.log("user",user);
            localStorage.setItem('user',JSON.stringify(user.data));
            dispatch(setUserData(user.data));
            return dispatch({
                type: LOGIN_SUCCESS
            });
        })
        .catch(error => {
            return dispatch({
                type   : LOGIN_ERROR,
                payload: error
            });
        });
}

export function submitLoginWithFireBase({username, password})
{
    return (dispatch) =>
        firebaseService.auth && firebaseService.auth.signInWithEmailAndPassword(username, password)
            .then(() => {
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            })
            .catch(error => {
                const usernameErrorCodes = [
                    'auth/email-already-in-use',
                    'auth/invalid-email',
                    'auth/operation-not-allowed',
                    'auth/user-not-found',
                    'auth/user-disabled'
                ];
                const passwordErrorCodes = [
                    'auth/weak-password',
                    'auth/wrong-password'
                ];

                const response = {
                    username: usernameErrorCodes.includes(error.code) ? error.message : null,
                    password: passwordErrorCodes.includes(error.code) ? error.message : null
                };

                if ( error.code === 'auth/invalid-api-key' )
                {
                    dispatch(Actions.showMessage({message: error.message}));
                }

                return dispatch({
                    type   : LOGIN_ERROR,
                    payload: response
                });
            });
}
