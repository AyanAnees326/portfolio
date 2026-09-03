import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProject } from '@/content/projects';
import { site } from '@/content/site';

const DEFAULT_TITLE = 'Ayan Anees — Full-stack & AI Agent Developer';
const DEFAULT_DESCRIPTION = 'Ayan Anees builds web apps, mobile apps, and human-supervised AI systems. Based in Lahore and available remotely worldwide.';

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let noIndex = false;

    if (pathname === '/garage') {
      title = `The Garage — ${site.name}`;
      description = 'A 1992 Suzuki Bandit 250 engine-head rebuild, guitar, gaming, old music, and the curiosity behind the work.';
    } else if (pathname.startsWith('/work/')) {
      const project = getProject(pathname.split('/').pop() ?? '');
      if (project?.study) {
        title = `${project.title} — ${site.name}`;
        description = project.summary;
      } else {
        noIndex = true;
      }
    } else if (pathname !== '/') {
      title = `Page not found — ${site.name}`;
      noIndex = true;
    }

    const canonical = `${site.canonicalUrl}${pathname === '/' ? '' : pathname}`;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  }, [pathname]);

  return null;
}
