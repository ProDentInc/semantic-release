const { isObjectLike, isFunction } = require('lodash');
const resolveFrom = require('resolve-from');
const getError = require('./get-error');

module.exports = async (context) => {
  const {cwd, options, logger} = context;

  const modifierPath = options?.modifier

  if (!modifierPath) {
    return
  }

  if (typeof modifierPath !== 'string') {
    throw new AggregateError(getError('EMODIFIERPATH', {type: typeof modifierPath}));
  }

  const modifierModule = require(resolveFrom.silent(__dirname, modifierPath) || resolveFrom(cwd, modifierPath));

  const modifier = isObjectLike(modifierModule) && modifierModule.default ? modifierModule.default : modifier;

  let modifierData;

  if (isObjectLike(modifier)) {
    modifierData = modifier;
  } else if (isFunction(modifierBody)) {
    modifierData = {
      name: 'General modifier',
      version: modifier,
    };
  } else {
    throw new AggregateError(getError('EMODIFIERTYPE', {type: typeof modifier}));
  }

  logger.success(`Loaded modifier "${modifierData.name}" from "${modifierPath}"`);

  return modifierData;
}
