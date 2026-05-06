const fs = require('fs');
const { execSync } = require('child_process');

try {
  const output = execSync('git grep -l "<<<<<<< HEAD"', { encoding: 'utf8' }).trim();
  if (!output) {
    console.log("No files with conflict markers found.");
    process.exit(0);
  }
  const files = output.split('\n');
  files.forEach(file => {
    if (!file) return;
    console.log("Fixing:", file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let state = 'NORMAL'; // NORMAL, IN_HEAD, IN_THEIRS
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('<<<<<<< HEAD')) {
        state = 'IN_HEAD';
      } else if (line.startsWith('=======')) {
        if (state === 'IN_HEAD') {
          state = 'IN_THEIRS';
        } else {
           newLines.push(line);
        }
      } else if (line.startsWith('>>>>>>> ')) {
        if (state === 'IN_THEIRS') {
          state = 'NORMAL';
        } else {
           newLines.push(line);
        }
      } else {
        if (state === 'NORMAL' || state === 'IN_HEAD') {
          newLines.push(line);
        }
      }
    }
    fs.writeFileSync(file, newLines.join('\n'));
  });
} catch (e) {
  console.log('Error:', e.message);
}
