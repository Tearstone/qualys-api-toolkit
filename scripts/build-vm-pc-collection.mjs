import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const catalogDirectory = resolve(repositoryRoot, 'catalog/vm-pc');
const outputPath = resolve(repositoryRoot, 'collections/qualys-api-vm-pc/qualys-api-vm-pc.postman_collection.json');
const catalogPaths = ['authentication.json', 'assets-ip.json', 'assets-host-list.json', 'assets-host-update.json'];

const source = await Promise.all(catalogPaths.map(async (file) => JSON.parse(await readFile(resolve(catalogDirectory, file), 'utf8'))));
const [authentication, ipAssets, hostAssets, hostUpdate] = source;

function fail(message) {
  throw new Error(`Catalog validation failed: ${message}`);
}

function validateCatalog(catalog) {
  if (catalog.schemaVersion !== '1.0') fail(`${catalog.guide}: unsupported schemaVersion`);
  if (!catalog.source?.reviewed || !catalog.source?.lifecycle) fail(`${catalog.guide}: source evidence is incomplete`);
  for (const operation of catalog.operations ?? []) {
    if (!operation.id || !operation.name || !operation.path || !operation.version) fail('operation identity is incomplete');
    if ((!Array.isArray(operation.parameters) || operation.parameters.length === 0) && !operation.parametersFrom) fail(`${operation.id}: parameters are missing`);
    if (!operation.lifecycle?.status) fail(`${operation.id}: lifecycle status is missing`);
  }
}

source.forEach(validateCatalog);

function lifecycleText(operation) {
  const lifecycle = operation.lifecycle;
  const dates = [lifecycle.eos && `EOS ${lifecycle.eos}`, lifecycle.eol && `EOL ${lifecycle.eol}`].filter(Boolean);
  const replacement = lifecycle.replacementPath ? ` Recommended path: ${lifecycle.replacementPath}.` : '';
  const note = lifecycle.note ? ` ${lifecycle.note}` : '';
  return `Lifecycle: ${lifecycle.status}${dates.length ? ` (${dates.join('; ')})` : ''} as of ${authentication.source.reviewed}.${replacement}${note}`;
}

function parameterDescription(parameter, operation) {
  const purpose = parameter.description ? `${parameter.description} ` : '';
  const requirement = parameter.required === true ? 'Required.' : parameter.required ? `Required: ${parameter.required}.` : 'Optional.';
  const choices = parameter.values?.length ? ` Documented values: ${parameter.values.join(', ')}.` : '';
  const alternative = parameter.alternative ? ` Alternative: ${parameter.alternative}.` : '';
  const safety = operation.tenantChange && parameter.name === 'action'
    ? ' Disabled as a safety gate; enable only after setting allowTenantChanges=true.' : '';
  return `${purpose}${requirement}${choices}${alternative}${safety}`;
}

function resolvedParameters(operation, operations) {
  if (!operation.parametersFrom) return operation.parameters;
  const sourceOperation = operations.find((candidate) => candidate.id === operation.parametersFrom);
  if (!sourceOperation?.parameters) fail(`${operation.id}: parameter source ${operation.parametersFrom} does not exist`);
  return sourceOperation.parameters
    .filter((parameter) => !operation.parameterExclusions?.includes(parameter.name))
    .map((parameter) => ({ ...parameter, ...(operation.parameterOverrides?.[parameter.name] ?? {}) }));
}

function formParameters(operation, operations) {
  return resolvedParameters(operation, operations).map((parameter) => ({
    key: parameter.name,
    value: parameter.value,
    description: parameterDescription(parameter, operation),
    type: 'text',
    ...(parameter.required === true && !(operation.tenantChange && parameter.name === 'action') ? {} : { disabled: true })
  }));
}

function url(path, query) {
  const segments = path.split('/').filter(Boolean);
  return {
    raw: `{{baseUrl}}${path}${query ? `?${new URLSearchParams(query.map((item) => [item.key, item.value])).toString()}` : ''}`,
    host: ['{{baseUrl}}'],
    path: [...segments, ''],
    ...(query ? { query } : {})
  };
}

function standardHeaders(operation) {
  return operation.requiredHeaders?.includes('X-Requested-With') || operation.id.startsWith('ip-') || operation.id.startsWith('host-')
    ? [{ key: 'X-Requested-With', value: '{{xRequestedWith}}', type: 'text' }]
    : [];
}

function changeGate(operation) {
  if (!operation.tenantChange) return [];
  return [{
    listen: 'prerequest',
    script: {
      type: 'text/javascript',
      exec: [
        "if (pm.variables.replaceIn('{{allowTenantChanges}}').toLowerCase() !== 'true') {",
        "  throw new Error('Safety gate: set allowTenantChanges=true, review the request, then enable action before sending.');",
        '}'
      ]
    }
  }];
}

function request(operation, method, operations, { auth = false, sessionTest, displayName } = {}) {
  const query = method === 'GET' ? formParameters(operation, operations) : undefined;
  const body = method === 'POST' ? { mode: 'urlencoded', urlencoded: formParameters(operation, operations) } : undefined;
  const event = [
    ...(sessionTest ? [{ listen: 'test', script: { type: 'text/javascript', exec: sessionTest } }] : []),
    ...changeGate(operation)
  ];
  return {
    name: displayName ?? `${operation.tenantChange ? '[CHANGE] ' : ''}${operation.name}${operation.methods?.length > 1 ? ` (${method})` : ''}`,
    request: {
      ...(auth ? { auth: { type: operation.authorization } } : {}),
      method,
      header: standardHeaders(operation),
      ...(body ? { body } : {}),
      url: url(operation.path, query),
      description: `${operation.name}. ${lifecycleText(operation)}${operation.tenantChange ? ' This request can change tenant data.' : ''}`
    },
    ...(event.length ? { event } : {}),
    response: []
  };
}

const sessionTests = {
  'session-login-v2': [
    "pm.test('Session login returned HTTP 200', function () {", '  pm.response.to.have.status(200);', '});',
    "pm.test('Session login response indicates success', function () {", "  pm.expect(pm.response.text()).to.include('Logged in');", '});'
  ],
  'session-logout-v2': [
    "pm.test('Session logout returned HTTP 200', function () {", '  pm.response.to.have.status(200);', '});',
    "pm.test('Session logout response indicates success', function () {", "  pm.expect(pm.response.text()).to.include('Logged out');", '});'
  ]
};

function hostListRequest(operation, method) {
  return request(operation, method, hostAssets.operations, {
    displayName: operation.name,
  });
}

function namedRequest(operation, method, operations) {
  return request(operation, method, operations, { displayName: operation.name });
}

const collection = {
  info: {
    _postman_id: 'f8df5c1a-1db4-4c1e-9592-2c685ca00d52',
    name: 'Qualys API (VM/PC)',
    description: 'Community-maintained reference collection for Qualys API (VM/PC).\n\nCurrent coverage: shared authentication, IP asset operations, Host List V2-V6, and Host Update V2. Legacy Host List versions display their published EOS/EOL dates and V6 replacement path. Host Update V2 displays its lifecycle warning without implying an undocumented V6 update action. Additional VMDR and Policy Audit families will be added incrementally.\n\nAuthentication defaults to Basic HTTP authentication with {{username}} and {{password}}. For IdP JWT authentication, set {{accessToken}} in your local environment and change this collection\'s authentication type to Bearer Token.\n\nUse a Qualys API server URL without a trailing slash for {{baseUrl}}. Never commit credentials, access tokens, or tenant response data.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  auth: { type: 'basic', basic: [{ key: 'username', value: '{{username}}', type: 'string' }, { key: 'password', value: '{{password}}', type: 'string' }] },
  item: [
    {
      name: 'Shared platform',
      description: 'Requests shared across the Qualys API (VM/PC) collection.',
      item: [{
        name: 'Authentication',
        description: `Source: ${authentication.guide} v${authentication.guideVersion}, pages ${authentication.source.pdfPages}. Lifecycle reviewed against the official EOS/EOL timeline on ${authentication.source.reviewed}.`,
        item: authentication.operations.map((operation) => request(operation, operation.method, authentication.operations, { auth: true, sessionTest: sessionTests[operation.id] }))
      }]
    },
    {
      name: 'Assets',
      description: `Source: ${ipAssets.guide} v${ipAssets.guideVersion}, pages ${ipAssets.source.pdfPages}. Lifecycle reviewed ${ipAssets.source.reviewed}.`,
      item: [{
        name: 'IP addresses',
        description: 'List requests are read-only. Tenant-changing add and update requests are grouped separately and require the explicit safety gate.',
        item: [{
          name: 'GET - primary request',
          description: 'Use this read-only request by default. Documented input parameters are available in Postman Params.',
          item: ipAssets.operations.filter((operation) => !operation.tenantChange).flatMap((operation) => operation.methods.filter((method) => method === 'GET').map((method) => namedRequest(operation, method, ipAssets.operations)))
        }, {
          name: 'POST - alternative form request',
          description: 'Qualys documents POST as an alternative transport for the same IP List operation. Its parameters are available under Postman Body as x-www-form-urlencoded fields.',
          item: ipAssets.operations.filter((operation) => !operation.tenantChange).flatMap((operation) => operation.methods.filter((method) => method === 'POST').map((method) => namedRequest(operation, method, ipAssets.operations)))
        }, {
          name: 'Changes - safety gated',
          description: 'These requests add or modify tenant IP assets. Set allowTenantChanges=true, review values, and enable the action field before sending.',
          item: ipAssets.operations.filter((operation) => operation.tenantChange).flatMap((operation) => operation.methods.map((method) => namedRequest(operation, method, ipAssets.operations)))
        }]
      }, {
        name: 'Hosts',
        description: `Host List source: ${hostAssets.guide} v${hostAssets.guideVersion}, pages ${hostAssets.source.pdfPages}. Start with the GET requests. Qualys also documents POST for each version; its equivalent form parameters appear under Postman's Body tab and are grouped separately to keep the primary navigation clear. V2-V5 show the published EOS/EOL dates and V6 replacement path in each request description.`,
        item: [{
          name: 'GET - primary requests',
          description: 'Use these read-only requests by default. All documented input parameters are available in Postman Params.',
          item: hostAssets.operations.map((operation) => hostListRequest(operation, 'GET'))
        }, {
          name: 'POST - alternative form requests',
          description: 'Qualys documents POST as an alternative transport for the same Host List operation. The same input parameters are available under Postman Body as x-www-form-urlencoded fields, not Params. Use this only when an integration specifically requires POST.',
          item: hostAssets.operations.map((operation) => hostListRequest(operation, 'POST'))
        }, {
          name: 'Changes - Host attributes (safety gated)',
          description: `Uses action=update, which changes host attributes rather than listing hosts. ${hostUpdate.source.methodNote} Set allowTenantChanges=true, review values, and enable the action field before sending.`,
          item: hostUpdate.operations.flatMap((operation) => operation.methods.map((method) => namedRequest(operation, method, hostUpdate.operations)))
        }]
      }]
    }
  ],
  variable: [
    { key: 'baseUrl', value: 'https://YOUR-QUALYS-API-SERVER', type: 'string' },
    { key: 'username', value: '', type: 'string' },
    { key: 'password', value: '', type: 'string' },
    { key: 'accessToken', value: '', type: 'string' },
    { key: 'xRequestedWith', value: 'Qualys API Toolkit', type: 'string' },
    { key: 'allowTenantChanges', value: 'false', type: 'string' }
  ]
};

const renderedCollection = `${JSON.stringify(collection, null, 2)}\n`;
if (process.argv.includes('--check')) {
  const existingCollection = await readFile(outputPath, 'utf8');
  if (existingCollection !== renderedCollection) {
    fail('generated collection is stale; run node scripts/build-vm-pc-collection.mjs and commit the result');
  }
  console.log(`Catalog and ${outputPath.replace(`${repositoryRoot}/`, '')} are synchronized.`);
} else {
  await writeFile(outputPath, renderedCollection);
  console.log(`Built ${outputPath.replace(`${repositoryRoot}/`, '')} from ${catalogPaths.length} catalog records.`);
}
