// middleware/logger.ts
import type { Middleware, UnknownAction } from '../../types';

const sliceBadgeStyles = {
  modal:
    'background: #2196F3; color: white; padding:2px 6px; border-radius:4px; font-weight:bold;',
  contador:
    'background: #F44336; color: white; padding:2px 6px; border-radius:4px; font-weight:bold;',
  user: 'background: #9C27B0; color: white; padding:2px 6px; border-radius:4px; font-weight:bold;',
  default:
    'background: #4CAF50; color: white; padding:2px 6px; border-radius:4px; font-weight:bold;',
};

// tipo genérico de middleware
const logger: Middleware = (store) => (next) => (action) => {
  const typedAction = action as UnknownAction;

  // skip Redux internal actions
  if (typedAction.type?.startsWith('@@')) {
    return next(action);
  }

  const [slice, actionName] = typedAction.type.split('/');
  const badgeStyle =
    sliceBadgeStyles[slice as keyof typeof sliceBadgeStyles] ||
    sliceBadgeStyles.default;

  const prevState = store.getState();
  const start = performance.now();

  const result = next(action);

  const end = performance.now();
  const nextState = store.getState();

  console.groupCollapsed(
    `%c ${slice} %c ${actionName}`,
    badgeStyle,
    'color: #4CAF50; font-weight: bold;'
  );

  console.log(
    '%cPayload:',
    'color: #9C27B0; font-weight: bold;',
    (typedAction as UnknownAction).payload
  );
  console.log('%cPrev State:', 'color: #FF5722; font-weight: bold;', prevState);
  console.log('%cNext State:', 'color: #2196F3; font-weight: bold;', nextState);
  console.log('%cDuration:', 'color: gray;', (end - start).toFixed(2) + 'ms');

  console.groupEnd();
  return result;
};

export default logger;
