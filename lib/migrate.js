import path from 'path';
import fs from 'fs-extra';

export async function migrateToContentDir(targetDir = '.', contentDirName = 'blog-data') {
  const resolvedDir = path.resolve(targetDir);
  const contentPath = path.join(resolvedDir, 'content');
  const configPath = path.join(resolvedDir, 'config.yaml');
  const customTemplatesPath = path.join(resolvedDir, 'templates');
  const customAssetsPath = path.join(resolvedDir, 'assets');
  
  if (!await fs.pathExists(contentPath)) {
    console.log('ℹ️  No legacy content structure found. Project may already be migrated.');
    return;
  }
  
  console.log('🔄 Migrating MarkSite project to new structure...\n');
  
  const newContentDir = path.join(resolvedDir, contentDirName);
  
  if (await fs.pathExists(newContentDir)) {
    console.log(`⚠️  ${contentDirName}/ already exists. Skipping migration to prevent data loss.`);
    return;
  }
  
  console.log(`📁 Creating ${contentDirName}/ directory...`);
  await fs.ensureDir(newContentDir);
  
  console.log('📝 Migrating config.yaml...');
  if (await fs.pathExists(configPath)) {
    await fs.copy(configPath, path.join(newContentDir, 'config.yaml'));
    console.log('   ✓ config.yaml moved');
  }
  
  console.log('📂 Migrating content directory...');
  if (await fs.pathExists(contentPath)) {
    await fs.copy(contentPath, path.join(newContentDir, 'content'));
    console.log('   ✓ content/ moved');
  }
  
  const userTemplates = path.join(customTemplatesPath);
  if (await fs.pathExists(userTemplates)) {
    const isCustom = await isCustomTemplates(userTemplates);
    if (isCustom) {
      await fs.copy(userTemplates, path.join(newContentDir, 'templates'));
      console.log('📋 ✓ Custom templates/ moved');
    } else {
      console.log('📋 Skipping templates/ (using default core templates)');
    }
  }
  
  const userAssets = path.join(customAssetsPath);
  if (await fs.pathExists(userAssets)) {
    const isCustom = await isCustomAssets(userAssets);
    if (isCustom) {
      await fs.copy(userAssets, path.join(newContentDir, 'assets'));
      console.log('🎨 ✓ Custom assets/ moved');
    } else {
      console.log('🎨 Skipping assets/ (using default core assets)');
    }
  }
  
  console.log('\n✓ Migration complete!\n');
  console.log('📋 Next steps:');
  console.log(`   1. Review ${contentDirName}/ directory`);
  console.log('   2. Remove old files (optional):');
  console.log('      - rm config.yaml');
  console.log('      - rm -rf content/');
  console.log('   3. Test your site:');
  console.log(`      npm run build -- --content-dir ./${contentDirName}`);
  console.log(`      npm run serve -- --content-dir ./${contentDirName}`);
  console.log('\n💡 Or add to config.yaml:');
  console.log(`   contentDir: ./${contentDirName}`);
  console.log('\n✅ Your site is now ready for easy updates from the main MarkSite branch!');
}

async function isCustomTemplates(templatesPath) {
  if (!await fs.pathExists(templatesPath)) return false;
  
  const files = await fs.readdir(templatesPath);
  return files.length > 0;
}

async function isCustomAssets(assetsPath) {
  if (!await fs.pathExists(assetsPath)) return false;
  
  const cssDest = path.join(assetsPath, 'css');
  const jsDest = path.join(assetsPath, 'js');
  
  let hasCustom = false;
  
  if (await fs.pathExists(cssDest)) {
    const files = await fs.readdir(cssDest);
    hasCustom = hasCustom || files.some(f => f !== 'style.css');
  }
  
  if (await fs.pathExists(jsDest)) {
    const files = await fs.readdir(jsDest);
    hasCustom = hasCustom || files.some(f => f !== 'main.js');
  }
  
  return hasCustom;
}
