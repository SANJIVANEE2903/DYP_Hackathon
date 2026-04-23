#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

program
  .name('repoforge')
  .description('CLI for RepoForge AI tools')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize RepoForge in the current directory')
  .action(require('./commands/init'));

program
  .command('audit')
  .description('Run a health audit on the repository')
  .action(require('./commands/audit'));

program
  .command('preset')
  .description('Manage RepoForge presets')
  .action(require('./commands/preset'));

program.parse(process.argv);
