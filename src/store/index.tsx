import React from 'react';
import { createStore, TStore } from './createStore'
import { useLocalStore } from 'mobx-react'

const StoreContext = React.createContext<TStore | null>(createStore())

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(createStore)
    return(
        <StoreContext.Provider value={store}> 
            { children }
        </StoreContext.Provider>
    )
}

export const useStore = () => {
    const store = React.useContext(StoreContext)
    if (!store) {
      // this is especially useful in TypeScript so you don't need to be checking for null all the time
      throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}
