import { useEffect } from 'react';

const SITE_NAME = 'Smart Library';
const DEFAULT_DESCRIPTION =
  'Smart AI-powered library management system with secure portals, analytics, reservations, reporting, and catalog workflows.';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function useSeo({ title, description = DEFAULT_DESCRIPTION } = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const resolvedTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} Management System`;
    document.title = resolvedTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: resolvedTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: window.location.href });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: resolvedTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [description, title]);
}
