import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// Database
import { supabase } from '../utils/supabaseClient';
// Modells
import { getUserById, getUserPermissions } from '../models/users';
// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  userMeta: null,
  Permissions: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, userMeta, permissions } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      userMeta,
      permissions,
    };
  },
  LOGIN: (state, action) => {
    const { user, userMeta, permissions } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      userMeta,
      permissions,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      let userMeta = '',
        userAuthenticated = false,
        permissions = {};
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          // Get current user from supabase
          const user = supabase.auth.user();
          if (user) {
            // Get User Meta
            const { data, error } = await getUserById(user.id);

            if (error) {
              console.log(error);
            } else {
              userMeta = data[0];
              // Get Permissions
              const { data: permissionsData } = await getUserPermissions(userMeta.role);
              if (permissionsData) {
                permissions = permissionsData;
                userAuthenticated = true;
                dispatch({
                  type: 'INITIALIZE',
                  payload: {
                    isAuthenticated: true,
                    user,
                    userMeta,
                    permissions,
                  },
                });
              }
            }
          }
        }
        if (!userAuthenticated) {
          console.log('throw out');
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
              userMeta: null,
              permissions: null,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            userMeta: null,
            permissions: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const user = '';
    const loginError = '';
    let userMeta = '',
      permissions = {};
    const response = await supabase.auth.signIn({ email: email, password: password });
    if (response.data != null) {
      const { access_token, user } = response.data;

      if (user) {
        // Get User Meta
        const { data, error } = await getUserById(user.id);

        if (error) {
          console.log(error);
        } else {
          userMeta = data[0];
          // Get Permissions
          const { data: permissionsData } = await getUserPermissions(userMeta.role);
          if (permissionsData) {
            permissions = permissionsData;
          }
        }
      }

      setSession(access_token);
      loginError = '';
    } else {
      loginError = response.error;
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        userMeta,
        permissions,
      },
    });

    return loginError;
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
