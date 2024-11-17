import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

/**
 * 페이지 이탈을 방지하는 커스텀 훅
 */
export function usePrompt(message, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const replace = navigator.replace;

    navigator.push = (...args) => {
      const result = window.confirm(message);
      if (result) {
        push(...args);
      }
    };

    navigator.replace = (...args) => {
      const result = window.confirm(message);
      if (result) {
        replace(...args);
      }
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      navigator.push = push;
      navigator.replace = replace;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, message, navigator]);
}
