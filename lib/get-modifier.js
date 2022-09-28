const {isObjectLike, isFunction, isString} = require('lodash');
const resolveFrom = require('resolve-from');
const AggregateError = require('aggregate-error');
const getError = require('./get-error');

module.exports = async (context) => {
  const {cwd, options, logger} = context;

  const modifierPath = options?.modifier;

  if (!modifierPath) {
    return;
  }

  if (typeof modifierPath !== 'string') {
    throw new AggregateError([getError('EMODIFIERPATH', {type: typeof modifierPath})]);
  }

  const modifierModule = require(resolveFrom.silent(__dirname, modifierPath) || resolveFrom(cwd, modifierPath));

  const modifier = isObjectLike(modifierModule) && modifierModule.default ? modifierModule.default : modifierModule;

  let modifierData;

  if (isObjectLike(modifier)) {
    modifierData = modifier;
  } else if (isFunction(modifier)) {
    modifierData = {
      name: 'Unknown modifier',
      version: modifier,
      lastRelease: null,
    };
  } else {
    throw new AggregateError([getError('EMODIFIERTYPE', {type: typeof modifier})]);
  }

  if (!isString(modifierData.name)) {
    throw new AggregateError([getError('EMODIFIERNONAME', {type: typeof modifierData.name})]);
  }

  if (!isFunction(modifierData.version)) {
    throw new AggregateError([getError('EMODIFIERNOREQUIRED', {name: 'version', type: typeof modifierData.version})]);
  }

  logger.success(`Loaded modifier "${modifierData.name}" from "${modifierPath}"`);

  return modifierData;
};
