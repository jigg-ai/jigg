// Smoothcomp link parsing. The IDs below are made up; nothing is fetched.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSmoothcompUrl } from './smoothcomp.ts';

test('a profile link becomes a Smoothcomp identity with a clean canonical URL', () => {
  assert.deepEqual(parseSmoothcompUrl('https://smoothcomp.com/en/profile/123456?utm_source=x#stats'), {
    kind: 'profile',
    identity: { source: 'Smoothcomp', sourceAthleteId: '123456' },
    url: 'https://smoothcomp.com/en/profile/123456',
  });
});

test('organizer subdomains and other languages keep their host', () => {
  const r = parseSmoothcompUrl('  https://ExampleOrg.smoothcomp.com/pt-BR/profile/42  ');
  assert.equal(r?.kind, 'profile');
  assert.equal(r?.url, 'https://exampleorg.smoothcomp.com/pt-br/profile/42');
});

test('event links, including deeper pages, become one global event ID', () => {
  for (const link of [
    'https://smoothcomp.com/en/event/27515',
    'https://exampleorg.smoothcomp.com/en/event/27515/schedule/matches',
    'http://smoothcomp.com/en/event/27515/participants',
  ]) {
    const r = parseSmoothcompUrl(link);
    assert.equal(r?.kind, 'event', link);
    assert.equal(r?.kind === 'event' && r.eventId, 'smoothcomp:27515', link);
  }
});

test('anything that is not a Smoothcomp profile or event link is refused', () => {
  for (const link of [
    '',
    'not a url',
    'javascript:alert(1)//smoothcomp.com/en/profile/1',
    'data:text/html,smoothcomp.com/en/profile/1',
    'https://smoothcomp.com.example.net/en/profile/1',
    'https://evilsmoothcomp.com/en/profile/1',
    'https://a.b.smoothcomp.com/en/profile/1',
    'https://user:pass@smoothcomp.com/en/profile/1',
    'https://smoothcomp.com:8443/en/profile/1',
    'https://smoothcomp.com/en/profile/abc',
    'https://smoothcomp.com/en/profile/',
    'https://smoothcomp.com/profile/1',
    'https://smoothcomp.com/en/user?search=demo',
    'https://smoothcomp.com/en/scoreboard/1',
    'ftp://smoothcomp.com/en/profile/1',
    'https://ibjjf.com/athletes/someone',
  ]) {
    assert.equal(parseSmoothcompUrl(link), null, link);
  }
});
