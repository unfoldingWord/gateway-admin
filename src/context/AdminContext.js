import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useTnRepoValidation from '@hooks/useTnRepoValidation'
import useTwlRepoValidation from '@hooks/useTwlRepoValidation'




export const AdminContext = React.createContext({});

export default function AdminContextProvider({
  children,
}) {

  
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const {
    state: {
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)


  const {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeErrorMessage,
    },
  } = useTnRepoValidation({authentication, owner, server, languageId});

  const {
    state: {
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeErrorMessage,
    },
  } = useTwlRepoValidation({authentication, owner, server, languageId});

  // create the value for the context provider
  const context = {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeErrorMessage,
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeErrorMessage,
    },
  };

  return (
    <AdminContext.Provider value={context}>
      {children}
    </AdminContext.Provider>
  );
};

AdminContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

