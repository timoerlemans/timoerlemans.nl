import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Eleventy from '@11ty/eleventy';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { setupCssBuild } from './css.js';

let root;
let input;
let output;
let styles;
let site;

function writeStyle(name, content) {
  const filename = path.join(styles, name);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, content);
}

function createSite(runMode = 'build', onBuild = () => {}, includes = 'fragments') {
  return new Eleventy(input, output, {
    configPath: false,
    runMode,
    config(config) {
      config.setQuietMode(true);
      config.setUseGitIgnore(false);
      config.setIncludesDirectory(includes);
      config.on('eleventy.after', onBuild);
      setupCssBuild(config);
    }
  });
}

function readOutput(name) {
  return fs.readFileSync(path.join(output, name), 'utf8');
}

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'development');
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'css-build-'));
  input = path.join(root, 'content');
  output = path.join(root, 'public');
  styles = path.join(input, 'assets/css');
  fs.mkdirSync(styles, { recursive: true });
  fs.writeFileSync(path.join(input, 'index.njk'), '<style>{% include "css/critical.css" %}</style><style>{% include "css/base.css" %}</style>');
  writeStyle('_shared.scss', '$color: #123456;');
  writeStyle('critical.scss', '@use "shared"; .critical { color: shared.$color; }');
  writeStyle('base.scss', '@use "shared"; .base { color: shared.$color; padding: 1px 2px; }');
  writeStyle('fonts.scss', '@use "shared"; .fonts { color: shared.$color; padding: 1px 2px; }');
});

afterEach(async () => {
  await site?.stopWatch();
  site = undefined;
  vi.unstubAllEnvs();
  fs.rmSync(root, { recursive: true, force: true });
});

describe('CSS build through Eleventy', () => {
  it('builds the actual website without loading test files as global data', async () => {
    site = new Eleventy('src', output, { source: 'cli', configPath: 'eleventy.config.js', quietMode: true });
    await site.write();
    expect(readOutput('index.html')).toContain('Tim Oerlemans');
    expect(readOutput('index.html')).toContain('<style>');
    expect(readOutput('blog/index.html')).toContain('Blogposts');
  }, 60000);

  it('delivers inline and file CSS using the configured directories, excluding partials', async () => {
    site = createSite();
    await site.write();
    expect(readOutput('index.html')).toContain('.critical');
    expect(readOutput('index.html')).toContain('.base');
    expect(readOutput('css/fonts.css')).toContain('.fonts');
    expect(fs.readdirSync(path.join(output, 'css'))).toEqual(['fonts.css']);
    expect(fs.existsSync(path.join(input, 'fragments/css/critical.css'))).toBe(true);
  });

  it('resolves package and relative imports consistently for both delivery paths', async () => {
    const content = '@use "modern-normalize/modern-normalize.css"; @use "shared"; .imported { color: shared.$color; }';
    writeStyle('base.scss', content);
    writeStyle('nested/fonts.scss', content);
    fs.unlinkSync(path.join(styles, 'fonts.scss'));
    site = createSite();
    await site.write();
    for (const css of [readOutput('index.html'), readOutput('css/fonts.css')]) {
      expect(css).toContain('box-sizing: border-box');
      expect(css).toContain('#123456');
    }
  });

  it('recompiles both delivery paths when a shared partial changes', async () => {
    site = createSite();
    await site.write();
    writeStyle('_shared.scss', '$color: #abcdef;');
    await site.write();
    expect(readOutput('index.html')).toContain('#abcdef');
    expect(readOutput('css/fonts.css')).toContain('#abcdef');
    expect(readOutput('index.html')).not.toContain('#123456');
  });

  it('minifies both delivery paths only in production', async () => {
    site = createSite();
    await site.write();
    expect(readOutput('css/fonts.css')).toContain('\n');
    expect(readOutput('index.html')).toContain('padding: 1px 2px;');
    vi.stubEnv('NODE_ENV', 'production');
    await site.write();
    expect(readOutput('css/fonts.css')).not.toContain('\n');
    expect(readOutput('css/fonts.css')).toContain('padding:1px 2px');
    expect(readOutput('index.html')).toContain('padding:1px 2px');
  });

  it('fails the build when an entrypoint contains invalid Sass', async () => {
    writeStyle('fonts.scss', '.fonts { color: $missing; }');
    site = createSite();
    await expect(site.write()).rejects.toThrow();
  });

  it('fails after a required inline entrypoint is removed rather than reusing stale CSS', async () => {
    site = createSite();
    await site.write();
    fs.unlinkSync(path.join(styles, 'critical.scss'));
    await expect(site.write()).rejects.toThrow(/critical/);
  });

  it('rejects entrypoints that would overwrite the same output file', async () => {
    writeStyle('nested/fonts.scss', '.other { color: red; }');
    site = createSite();
    await expect(site.write()).rejects.toThrow(/fonts/);
  });

  it.each(['fragments', '../fragments'])('watches partial changes without rebuilding forever with includes at %s', async includes => {
    let builds = 0;
    site = createSite('watch', () => { builds++; }, includes);
    await site.init();
    await site.watch();
    await new Promise(resolve => site.watcher.once('ready', resolve));
    writeStyle('_shared.scss', '$color: #abcdef;');
    await vi.waitFor(() => {
      expect(builds).toBe(2);
      expect(readOutput('index.html')).toContain('#abcdef');
      expect(readOutput('css/fonts.css')).toContain('#abcdef');
    }, { timeout: 5000, interval: 50 });
    await delay(500);
    expect(builds).toBe(2);
  }, 10000);
});
