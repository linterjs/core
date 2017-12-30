const fs = require.requireActual("fs");

let files = Object.create(null);

function __clearFiles() {
  files = Object.create(null);
}

function __setFiles(newFiles: object) {
  Object.entries(newFiles).forEach(([path, content]) => {
    files[path] = content;
  });
}

const mockFs = {
  ...fs,
  __clearFiles,
  __setFiles,
  readFileSync: jest.fn((path, options) => {
    if (path in files) {
      return files[path];
    }

    fs.readFileSync(path, options);
  }),
  writeFileSync: jest.fn((path, data, options) => {
    if (path in files) {
      files[path] = data;
    } else {
      fs.writeFileSync(path, data, options);
    }
  })
};

module.exports = mockFs;
