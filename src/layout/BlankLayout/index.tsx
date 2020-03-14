import React, { useEffect,useCallback } from 'react'
import { useHistory } from 'react-router-dom';
import { useCookie } from '../../utils/index';
import { useStore } from '../../store/index';
import { ACCOUNT } from '../../const/index';

export default function BlankLayout ({ children }) {
    const store =  useStore()
    const history = useHistory()
    useEffect(()=>{
        const account = useCookie(ACCOUNT)
        // if (!!account){
        //     store.setAccount(account)
        //     history.push('/')
        // } else {
        //     history.push('/login') 
        // }
        history.push('/home')
    },[document.cookie])
    return (
        <div style = { { height:'100vh'} }>
            { children }
        </div>
    )
}
