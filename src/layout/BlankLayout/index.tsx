import React, { useEffect,useCallback } from 'react'
import { useHistory } from 'react-router-dom';
import { useCookie } from '../../utils/index';
import { useStore } from '../../store/index';

const homeRouter = ['','/goods','/inventories','/audit','/account']

export default function BlankLayout ({ children }) {
    const store =  useStore()
    const history = useHistory()
    useEffect(()=>{
        const user = useCookie()
        if (user.role){
            store.setUser(user)
            history.push(homeRouter[store.role])
        } else {
            history.push('/login') 
        }
    },[document.cookie])
    return (
        <div style = { { height:'100vh'} }>
            { children }
        </div>
    )
}
