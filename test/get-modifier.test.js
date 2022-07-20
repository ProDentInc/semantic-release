const test = require('ava');
const {stub} = require('sinon');
const getModifier = require('../lib/get-modifier');
const normalModifier = require('./fixtures/modifier-normal');
const normalModifierCompiledESNext = require('./fixtures/modifier-normal-compiled-esnext');
const normalModifierFunctional = require('./fixtures/modifier-normal-functional');

test.beforeEach((t) => {
  // Stub the logger functions
  t.context.log = stub();
  t.context.logger = {log: t.context.log};
});

const logger = {
  success: stub(),
  info: stub(),
};

const modifierInvalidType = require.resolve('./fixtures/modifier-invalid-type');
const modifierEmptyName = require.resolve('./fixtures/modifier-empty-name');
const modifierInvalidName = require.resolve('./fixtures/modifier-invalid-name');
const modifierInvalidFunctionList = require.resolve('./fixtures/modifier-invalid-function-list');
const modifierNormal = require.resolve('./fixtures/modifier-normal');
const modifierNormalCompiledESnext = require.resolve('./fixtures/modifier-normal-compiled-esnext');
const modifierNormalFunctional = require.resolve('./fixtures/modifier-normal-functional');

test('Returns empty result with not set modifier option', async (t) => {
  t.is(
    await getModifier({
      cwd: undefined,
      logger,
      options: {},
    }),
    undefined
  );
});

test('Throws "EMODIFIERPATH" with invalid modifier option type', async (t) => {
  const errors = [
    ...(await t.throwsAsync(
      getModifier({
        cwd: undefined,
        logger,
        options: {
          modifier: () => {},
        },
      })
    )),
  ];

  t.is(errors[0].code, 'EMODIFIERPATH');
  t.is(errors[0].name, 'SemanticReleaseError');
});

test('Throws "EMODIFIERTYPE" with invalid modifier type', async (t) => {
  const errors = [
    ...(await t.throwsAsync(
      getModifier({
        cwd: undefined,
        logger,
        options: {
          modifier: modifierInvalidType,
        },
      })
    )),
  ];

  t.is(errors[0].code, 'EMODIFIERTYPE');
  t.is(errors[0].name, 'SemanticReleaseError');
});

test('Throws "EMODIFIERNONAME" with empty name', async (t) => {
  const errors = [
    ...(await t.throwsAsync(
      getModifier({
        cwd: undefined,
        logger,
        options: {
          modifier: modifierEmptyName,
        },
      })
    )),
  ];

  t.is(errors[0].code, 'EMODIFIERNONAME');
  t.is(errors[0].name, 'SemanticReleaseError');
});

test('Throws "EMODIFIERNONAME" with invalid name', async (t) => {
  const errors = [
    ...(await t.throwsAsync(
      getModifier({
        cwd: undefined,
        logger,
        options: {
          modifier: modifierInvalidName,
        },
      })
    )),
  ];

  t.is(errors[0].code, 'EMODIFIERNONAME');
  t.is(errors[0].name, 'SemanticReleaseError');
});

test('Throws "EMODIFIERNOREQUIRED" with invalid function list', async (t) => {
  const errors = [
    ...(await t.throwsAsync(
      getModifier({
        cwd: undefined,
        logger,
        options: {
          modifier: modifierInvalidFunctionList,
        },
      })
    )),
  ];

  t.is(errors[0].code, 'EMODIFIERNOREQUIRED');
  t.is(errors[0].name, 'SemanticReleaseError');
});

test('Normaly gets modifier', async (t) => {
  t.is(
    await getModifier({
      cwd: undefined,
      logger,
      options: {
        modifier: modifierNormal,
      },
    }),
    normalModifier
  );
});

test('Normaly gets modifier by cwd resolving', async (t) => {
  console.log(process.cwd(), 'process.cwd');

  t.is(
    await getModifier({
      cwd: process.cwd(),
      logger,
      options: {
        modifier: './test/fixtures/modifier-normal',
      },
    }),
    normalModifier
  );
});

test('Normaly gets compiled esnext modifier', async (t) => {
  t.is(
    await getModifier({
      cwd: undefined,
      logger,
      options: {
        modifier: modifierNormalCompiledESnext,
      },
    }),
    normalModifierCompiledESNext.default
  );
});

test('Normaly gets functional modifier', async (t) => {
  t.deepEqual(
    await getModifier({
      cwd: undefined,
      logger,
      options: {
        modifier: modifierNormalFunctional,
      },
    }),
    {
      name: 'Unknown modifier',
      version: normalModifierFunctional,
    }
  );
});

test('Normaly modifies version', async (t) => {
  const modifier = await getModifier({
    cwd: undefined,
    logger,
    options: {
      modifier: modifierNormal,
    },
  });

  const versionModifier = modifier.version;

  t.is(versionModifier({}, 'version'), 'version-test');
});

test('Normaly modifies version with compiled esnext modifier', async (t) => {
  const modifier = await getModifier({
    cwd: undefined,
    logger,
    options: {
      modifier: modifierNormalCompiledESnext,
    },
  });

  const versionModifier = modifier.version;

  t.is(versionModifier({}, 'version'), 'version-test');
});

test('Normaly modifies version with functional modifier', async (t) => {
  const modifier = await getModifier({
    cwd: undefined,
    logger,
    options: {
      modifier: modifierNormalFunctional,
    },
  });

  const versionModifier = modifier.version;

  t.is(versionModifier({}, 'version'), 'version-test');
});
