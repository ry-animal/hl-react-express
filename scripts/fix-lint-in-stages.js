const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fix in smaller batches to avoid overwhelming changes
const directories = [
  'frontend/src/components',
  'frontend/src/store',
  'frontend/src/utils',
  'backend/src/controllers',
  'backend/src/routes',
  'backend/src/utils',
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Fixing files in ${dir}...`);
    try {
      execSync(`npx eslint "${dir}/**/*.{js,jsx,ts,tsx}" --fix --quiet`, {
        stdio: 'inherit'
      });
      execSync(`npx prettier --write "${dir}/**/*.{js,jsx,ts,tsx,json}"`, {
        stdio: 'inherit'
      });
      console.log(`✅ Fixed files in ${dir}`);
    } catch (error) {
      console.error(`Error fixing files in ${dir}`);
    }
  } else {
    console.log(`Directory ${dir} does not exist, skipping...`);
  }
}); 