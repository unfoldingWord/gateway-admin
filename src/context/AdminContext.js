import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useTnRepoValidation from '@hooks/useTnRepoValidation'
import useTwlRepoValidation from '@hooks/useTwlRepoValidation'
import useLtRepoValidation from '@hooks/useLtRepoValidation'
import useStRepoValidation from '@hooks/useStRepoValidation'
import useTqRepoValidation from '@hooks/useTqRepoValidation'
import useSqRepoValidation from '@hooks/useSqRepoValidation'
import useSnRepoValidation from '@hooks/useSnRepoValidation'




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
  
  const {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeErrorMessage,
    },
  } = useLtRepoValidation({authentication, owner, server, languageId});

  const {
    state: {
      stRepoTree,
      stRepoTreeManifest,
      stRepoTreeErrorMessage,
    },
  } = useStRepoValidation({authentication, owner, server, languageId});

  const {
    state: {
      tqRepoTree,
      tqRepoTreeManifest,
      tqRepoTreeErrorMessage,
    },
  } = useTqRepoValidation({authentication, owner, server, languageId});

  const {
    state: {
      snRepoTree,
      snRepoTreeManifest,
      snRepoTreeErrorMessage,
    },
  } = useSnRepoValidation({authentication, owner, server, languageId});

  const {
    state: {
      sqRepoTree,
      sqRepoTreeManifest,
      sqRepoTreeErrorMessage,
    },
  } = useSqRepoValidation({authentication, owner, server, languageId});

  // create the value for the context provider
  const context = {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeErrorMessage,
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeErrorMessage,
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeErrorMessage,
      stRepoTree,
      stRepoTreeManifest,
      stRepoTreeErrorMessage,
      tqRepoTree,
      tqRepoTreeManifest,
      tqRepoTreeErrorMessage,
      sqRepoTree,
      sqRepoTreeManifest,
      sqRepoTreeErrorMessage,
      snRepoTree,
      snRepoTreeManifest,
      snRepoTreeErrorMessage,
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

