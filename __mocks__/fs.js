const realFs = jest.requireActual("fs");
const { vol } = jest.requireActual("memfs");
const { ufs } = jest.requireActual("unionfs");
ufs.use(realFs).use(vol);
module.exports = ufs;
