/**
 * ai.js — All AI calls are replaced with deterministic logic.
 * The local LLM (port 1234) is not running, so we avoid all fetch calls.
 */

/**
 * Detects tech stack from root filenames — no AI required.
 */
async function detectStack(rootFiles, keyFiles) {
  const filesLower = (rootFiles || []).map(f => f.toLowerCase());
  if (filesLower.includes('package.json')) return { stack: 'node' };
  if (filesLower.includes('requirements.txt') || filesLower.includes('setup.py')) return { stack: 'python' };
  if (filesLower.includes('go.mod')) return { stack: 'go' };
  if (filesLower.includes('cargo.toml')) return { stack: 'rust' };
  if (filesLower.includes('pom.xml') || filesLower.includes('build.gradle')) return { stack: 'java' };
  if (filesLower.includes('gemfile')) return { stack: 'ruby' };
  if (filesLower.includes('composer.json')) return { stack: 'php' };
  return { stack: 'generic' };
}

/**
 * Generates a basic README template — no AI required.
 */
async function generateReadme(repoName, stack, files) {
  return `# ${repoName}\n\nA ${stack} project.\n\n## Getting Started\n\nAdd setup instructions here.\n\n## Contributing\n\nPull requests are welcome.\n\n## License\n\nMIT\n`;
}

module.exports = { detectStack, generateReadme };
