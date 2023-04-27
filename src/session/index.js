import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { checkIsAuthenticated, authSignUp, authLogin, authLogout } from '../../services/auth'

export const AuthContext = React.createContext({})

export default function Auth({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => checkIsAuthenticated()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false))
        .then(() => setIsLoading(false))

    const login = credentials => authLogin(credentials)
        .then(setIsAuthenticated(true))
        .catch(error => {
            alert(error)
            setIsAuthenticated(false)
        })

    const logout = () => {
        authLogout()
        setIsAuthenticated(false)
    }

    const signUp = credentials => authSignUp(credentials)
        .then(setIsAuthenticated(true))
        .catch(error => {
            alert(error)
            setIsAuthenticated(false)
        })

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}

Auth.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array
    ])
}