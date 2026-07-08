import { useEffect, useState } from 'react';
import { getStoredAuthUser, AuthUser } from './auth';

export const useAuthUser = () => {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());

  useEffect(() => {
    const onStorage = () => setUser(getStoredAuthUser());
    const onAuthChanged = (e: Event) => {
      try {
        // CustomEvent may carry detail
        const ce = e as CustomEvent;
        if (ce?.detail === null) setUser(null);
        else setUser(getStoredAuthUser());
      } catch {
        setUser(getStoredAuthUser());
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:changed', onAuthChanged as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:changed', onAuthChanged as EventListener);
    };
  }, []);

  return user;
};

export default useAuthUser;
