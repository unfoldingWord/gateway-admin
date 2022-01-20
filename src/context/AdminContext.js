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

import {ALL} from '@common/constants'

export const AdminContext = React.createContext({});

export default function AdminContextProvider({
  children,
}) {

  const [books, setBooks] = useLocalStorage('books',[])

  // The refresh state is a string which will be a resourceId or "ALL" (default).
  // If the string is ALL, then the hook should run; and thus all of them
  // will run in this case.
  // If the string has a resourceId, then only that hook will run and all
  // others will pass, not running.
  // The refresh state will be updated by certain actions. For example,
  // if the user clicks the create repo button for OBS, then the state will
  // be set to "obs". In which case, only the `useObsRepoValidation` hook 
  // will run.
  // Of course, the initial state will be to run them all.
  const [refresh, setRefresh] = useState(ALL)

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

  // when org (owner) and language change, everthing needs to be re-done
  useEffect(() => {
    setRefresh(ALL)
  }, [owner, languageId])

  const {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnManifestSha,
      tnRepoTreeStatus,
    },
  } = useTnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      twlRepoTree,
      twlRepoTreeManifest,
      twlManifestSha,
      twlRepoTreeStatus,
    },
  } = useTwlRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});
  
  const {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltManifestSha,
      ltRepoTreeStatus,
    },
  } = useLtRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      stRepoTree,
      stRepoTreeManifest,
      stManifestSha,
      stRepoTreeStatus,
    },
  } = useStRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      tqRepoTree,
      tqRepoTreeManifest,
      tqManifestSha,
      tqRepoTreeStatus,
    },
  } = useTqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      snRepoTree,
      snRepoTreeManifest,
      snManifestSha,
      snRepoTreeStatus,
    },
  } = useSnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      sqRepoTree,
      sqRepoTreeManifest,
      sqManifestSha,
      sqRepoTreeStatus,
    },
  } = useSqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      taRepoTree,
      taRepoTreeManifest,
      taManifestSha,
      taRepoTreeStatus,
    },
  } = useTaRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      twRepoTree,
      twRepoTreeManifest,
      twManifestSha,
      twRepoTreeStatus,
    },
  } = useTwRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsRepoTree,
      obsRepoTreeManifest,
      obsManifestSha,
      obsRepoTreeStatus,
    },
  } = useObsRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnManifestSha,
      obsTnRepoTreeStatus,
    },
  } = useObsTnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlManifestSha,
      obsTwlRepoTreeStatus,
    },
  } = useObsTwlRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTqRepoTree,
      obsTqRepoTreeManifest,
      obsTqManifestSha,
      obsTqRepoTreeStatus,
    },
  } = useObsTqRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaManifestSha,
      obsTaRepoTreeStatus,
    },
  } = useObsTaRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwManifestSha,
      obsTwRepoTreeStatus,
    },
  } = useObsTwRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsSnRepoTree,
      obsSnRepoTreeManifest,
      obsSnManifestSha,
      obsSnRepoTreeStatus,
    },
  } = useObsSnRepoValidation({authentication, owner, server, languageId, refresh, setRefresh});

  const {
    state: {
      obsSqRepoTree,
      obsSqRepoTreeManifest,
      obsSqManifestSha,
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
      obsManifestSha,
      obsRepoTreeStatus,
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnManifestSha,
      obsTnRepoTreeStatus,
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlManifestSha,
      obsTwlRepoTreeStatus,
      obsTqRepoTree,
      obsTqRepoTreeManifest,
      obsTqManifestSha,
      obsTqRepoTreeStatus,
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaManifestSha,
      obsTaRepoTreeStatus,
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwlManifestSha,
      obsTwRepoTreeStatus,
      obsSnRepoTree,
      obsSnRepoTreeManifest,
      obsSnManifestSha,
      obsSnRepoTreeStatus,
      obsSqRepoTree,
      obsSqRepoTreeManifest,
      obsSqManifestSha,
      obsSqRepoTreeStatus,
      tnRepoTree,
      tnRepoTreeManifest,
      tnManifestSha,
      tnRepoTreeStatus,
      twlRepoTree,
      twlRepoTreeManifest,
      twlManifestSha,
      twlRepoTreeStatus,
      ltRepoTree,
      ltRepoTreeManifest,
      ltManifestSha,
      ltRepoTreeStatus,
      stRepoTree,
      stRepoTreeManifest,
      stManifestSha,
      stRepoTreeStatus,
      tqRepoTree,
      tqRepoTreeManifest,
      tqManifestSha,
      tqRepoTreeStatus,
      sqRepoTree,
      sqRepoTreeManifest,
      sqManifestSha,
      sqRepoTreeStatus,
      snRepoTree,
      snRepoTreeManifest,
      snManifestSha,
      snRepoTreeStatus,
      taRepoTree,
      taRepoTreeManifest,
      taManifestSha,
      taRepoTreeStatus,
      twRepoTree,
      twRepoTreeManifest,
      twManifestSha,
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

