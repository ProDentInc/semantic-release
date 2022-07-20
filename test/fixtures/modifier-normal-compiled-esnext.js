const versionModify = (_, version) => version + '-test';

exports.versionModify = versionModify;

exports.default = {
  name: 'Test modifier with multiple exports (compiled from esnext)',
  version: exports.versionModify,
};
