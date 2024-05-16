const fs = require('fs');
const path = require('path');

// Use the current directory as the project directory
const projectDir = process.cwd();

// Use a fixed name for the output file in the current directory
const outputFile = path.join(projectDir, 'code_context.txt');

// List of directories to look for
const directories = ['src','components', 'pages', 'app', 'api', 'styles', 'utils', 'hooks', 'constants', 'services', 'types'];

// List of file types to ignore
const ignoreFiles = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg'];

// Remove the output file if it exists
try {
  fs.unlinkSync(outputFile);
} catch (err) {
  // Ignore the error if the file doesn't exist
  if (err.code !== 'ENOENT') throw err;
}

// Recursive function to read files and append their content
function readFiles(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If entry is a directory, call this function recursively
      readFiles(filePath);
    } else if (stats.isFile()) {
      // Check if the file type should be ignored
      const shouldIgnore = ignoreFiles.some(pattern => file.endsWith(pattern));

      // If the file type should not be ignored, append its relative path and content to the output file
      if (!shouldIgnore) {
        const relativePath = path.relative(projectDir, filePath);
        const content = `// File: ${relativePath}\n${fs.readFileSync(filePath, 'utf8')}\n`;
        fs.appendFileSync(outputFile, content);
      }
    }
  }
}

// Call the recursive function for each specified directory in the project directory
for (const dir of directories) {
  const dirPath = path.join(projectDir, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    readFiles(dirPath);
  }
}