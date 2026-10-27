import { getCollection, type CollectionEntry } from 'astro:content';
import { getPublishedBuilds } from './builds';

export type Service = CollectionEntry<'services'>;

/** One evidence line, resolved: build references become a link with the build's own title. */
export interface Evidence {
  text: string;
  href?: string;
}

export interface ServiceView {
  id: string;
  service: Service;
  evidence: Evidence[];
}

/**
 * Services in their fixed order, with build evidence resolved against the PUBLISHED
 * builds. A reference to a build that doesn't exist (or is still a draft on the live
 * site) fails the build rather than rendering a dead link — evidence is the one thing
 * these pages can't afford to get wrong quietly.
 */
export async function getServices(): Promise<ServiceView[]> {
  const [services, builds] = await Promise.all([getCollection('services'), getPublishedBuilds()]);
  const byId = new Map(builds.map((b) => [b.id, b]));
  return services
    .sort((a, b) => a.data.order - b.data.order)
    .map((service) => ({
      id: service.id,
      service,
      evidence: service.data.evidence.map((e) => {
        if ('text' in e) return { text: e.text };
        const build = byId.get(e.build);
        if (!build) {
          throw new Error(`services/${service.id}: evidence references unknown or unpublished build "${e.build}"`);
        }
        return { text: build.data.title, href: `/builds/${build.id}` };
      }),
    }));
}
