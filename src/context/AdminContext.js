import React, { useContext, useEffect, useState } from 'react';
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
import useTaRepoValidation from '@hooks/useTaRepoValidation'
import useTwRepoValidation from '@hooks/useTwRepoValidation'
import useObsRepoValidation from '@hooks/useObsRepoValidation'
import useObsTnRepoValidation from '@hooks/useObsTnRepoValidation'
import useObsTwlRepoValidation from '@hooks/useObsTwlRepoValidation'
import useObsTqRepoValidation from '@hooks/useObsTqRepoValidation'
import useObsTaRepoValidation from '@hooks/useObsTaRepoValidation'
import useObsTwRepoValidation from '@hooks/useObsTwRepoValidation'
import useObsSnRepoValidation from '@hooks/useObsSnRepoValidation'
import useObsSqRepoValidation from '@hooks/useObsSqRepoValidation'
import useLocalStorage from '@hooks/useLocalStorage'

export const AdminContext = React.createContext({});

export default function AdminContextProvider({
  children,
}) {

  const [books, setBooks] = useLocalStorage('books',[])

  // The refresh state is a simple integer, which is incremented
  // when the user creates a repo from the UI. This state
  // is monitored by all the repo hooks and when changed
  // will re-evaluate the repo data.
  const [refresh, setRefresh] = useState(1)

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
    actions: {
      setCurrentLayout,
    }
  } = useContext(StoreContext)


  const {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeStatus,
    },
  } = useTnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeStatus,
    },
  } = useTwlRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});
  
  const {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeStatus,
    },
  } = useLtRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      stRepoTree,
      stRepoTreeManifest,
      stRepoTreeStatus,
    },
  } = useStRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      tqRepoTree,
      tqRepoTreeManifest,
      tqRepoTreeStatus,
    },
  } = useTqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      snRepoTree,
      snRepoTreeManifest,
      snRepoTreeStatus,
    },
  } = useSnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      sqRepoTree,
      sqRepoTreeManifest,
      sqRepoTreeStatus,
    },
  } = useSqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      taRepoTree,
      taRepoTreeManifest,
      taRepoTreeStatus,
    },
  } = useTaRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      twRepoTree,
      twRepoTreeManifest,
      twRepoTreeStatus,
    },
  } = useTwRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsRepoTree,
      obsRepoTreeManifest,
      obsRepoTreeStatus,
    },
  } = useObsRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnRepoTreeStatus,
    },
  } = useObsTnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlRepoTreeStatus,
    },
  } = useObsTwlRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTqRepoTree,
      obsTqRepoTreeManifest,
      obsTqRepoTreeStatus,
    },
  } = useObsTqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaRepoTreeStatus,
    },
  } = useObsTaRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwRepoTreeStatus,
    },
  } = useObsTwRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsSnRepoTree,
      obsSnRepoTreeManifest,
      obsSnRepoTreeStatus,
    },
  } = useObsSnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsSqRepoTree,
      obsSqRepoTreeManifest,
      obsSqRepoTreeStatus,
    },
  } = useObsSqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const _setBooks = (value) => {
    setBooks(value)
    setCurrentLayout(null)
  }

  // create the value for the context provider
  const context = {
    state: {
      obsRepoTree,
      obsRepoTreeManifest,
      obsRepoTreeStatus,
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnRepoTreeStatus,
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlRepoTreeStatus,
      obsTqRepoTree,
      obsTqRepoTreeManifest,
      obsTqRepoTreeStatus,
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaRepoTreeStatus,
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwRepoTreeStatus,
      obsSnRepoTree,
      obsSnRepoTreeManifest,
      obsSnRepoTreeStatus,
      obsSqRepoTree,
      obsSqRepoTreeManifest,
      obsSqRepoTreeStatus,
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeStatus,
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeStatus,
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeStatus,
      stRepoTree,
      stRepoTreeManifest,
      stRepoTreeStatus,
      tqRepoTree,
      tqRepoTreeManifest,
      tqRepoTreeStatus,
      sqRepoTree,
      sqRepoTreeManifest,
      sqRepoTreeStatus,
      snRepoTree,
      snRepoTreeManifest,
      snRepoTreeStatus,
      taRepoTree,
      taRepoTreeManifest,
      taRepoTreeStatus,
      twRepoTree,
      twRepoTreeManifest,
      twRepoTreeStatus,
      books,
      refresh,
    },
    actions: {
      setBooks: _setBooks,
      setRefresh: setRefresh,
    }
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

