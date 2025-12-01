#!/usr/bin/env node

import { Command } from 'commander';
import { SiteBuilder } from './lib/builder.js';
import { DevServer } from './lib/server.js';
import { scaffoldProject, createNewPost } from './lib/scaffold.js';
import { migrateToContentDir } from './lib/migrate.js';
import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('marksite')
  .description('A modern, SEO-friendly markdown static site generator')
  .version(packageJson.version);

async function resolveContentDir(contentDirOption) {
  let contentDir = contentDirOption;
  
  if (!contentDir) {
    contentDir = process.env.MARKSITE_CONTENT_DIR;
  }
  
  if (!contentDir) {
    const rootConfigPath = resolve('config.yaml');
    if (await fs.pathExists(rootConfigPath)) {
      try {
        const rootConfig = yaml.load(await fs.readFile(rootConfigPath, 'utf-8'));
        if (rootConfig.contentDir) {
          contentDir = rootConfig.contentDir;
        }
      } catch (e) {
      }
    }
  }
  
  if (!contentDir) {
    const oldContentPath = resolve('content');
    if (await fs.pathExists(oldContentPath)) {
      contentDir = './';
      console.log('⚠️  Using legacy content structure (./content). Consider migrating to --content-dir');
    } else {
      contentDir = './blog-data';
    }
  }
  
  return resolve(contentDir);
}

program
  .command('init')
  .description('Initialize a new MarkSite project')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .option('-c, --content-dir <path>', 'Content directory (optional)')
  .action(async (options) => {
    try {
      await scaffoldProject(options.dir, options.contentDir);
      console.log('✓ Project initialized successfully!');
      console.log('\nNext steps:');
      console.log('  1. Edit config.yaml to customize your site');
      console.log('  2. Run "npm run build" to build your site');
      console.log('  3. Run "npm run serve" to preview locally');
    } catch (error) {
      console.error('Error initializing project:', error.message);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build the static site')
  .option('-d, --content-dir <path>', 'Content directory')
  .option('-w, --watch', 'Watch for changes and rebuild')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const builder = new SiteBuilder(contentDir);
      await builder.build();
      console.log('✓ Site built successfully!');
      
      if (options.watch) {
        console.log('\n👀 Watching for changes...');
        await builder.watch();
      }
    } catch (error) {
      console.error('Error building site:', error.message);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start development server')
  .option('-d, --content-dir <path>', 'Content directory')
  .option('-p, --port <port>', 'Port number', '3000')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const builder = new SiteBuilder(contentDir);
      await builder.build();
      
      const server = new DevServer(options.port, contentDir);
      await server.start();
      
      console.log(`\n✓ Server running at http://localhost:${options.port}`);
      console.log('👀 Watching for changes...\n');
      
      await builder.watch(async () => {
        console.log('🔄 Rebuilding site...');
        await builder.build();
        console.log('✓ Site rebuilt!');
      });
    } catch (error) {
      console.error('Error starting server:', error.message);
      process.exit(1);
    }
  });

program
  .command('new')
  .description('Create a new blog post')
  .argument('<title>', 'Post title')
  .option('-d, --content-dir <path>', 'Content directory')
  .action(async (title, options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const filepath = await createNewPost(title, contentDir);
      console.log(`✓ Created new post: ${filepath}`);
    } catch (error) {
      console.error('Error creating post:', error.message);
      process.exit(1);
    }
  });

program
  .command('migrate')
  .description('Migrate existing MarkSite project to new content directory structure')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .option('-n, --name <name>', 'Content directory name', 'blog-data')
  .action(async (options) => {
    try {
      await migrateToContentDir(options.dir, options.name);
    } catch (error) {
      console.error('Error during migration:', error.message);
      process.exit(1);
    }
  });

program.parse();

