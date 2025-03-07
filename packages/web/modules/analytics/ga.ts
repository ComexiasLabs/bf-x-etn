import { Config } from '@core/config/config';
import { Environments } from '@core/enums/environments';

declare let window: any;

export const getGATrackingId = (): string => {
  const mainnetTrackingId = 'G-M8PWDRR8EH';

  return Config.environment === Environments.Mainnet ? mainnetTrackingId : '';
};

export type EventCategory = 'Navigation' | 'Button';

export type EventAction = 'Click' | 'View';

export const trackGAEvent = (eventCategory: EventCategory, eventAction: EventAction, eventLabel?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
    });
  }
};
