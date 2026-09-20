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
  const requirement = parameter.required === true ? 'Required.' : parameter.required ? `Required: ${parameter.required}.` : 'Optional.';
  const choices = parameter.values?.length ? ` Documented values: ${parameter.values.join(', ')}.` : '';
  const alternative = parameter.alternative ? ` Alternative: ${parameter.alternative}.` : '';
  const safety = operation.tenantChange && parameter.name === 'action'
    ? ' Disabled as a safety gate; enable only after setting allowTenantChanges=true.' : '';
  return `${requirement}${choices}${alternative}${safety}`;
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
  return operation.requiredHeaders?.includes('X-Requested-With') || operation.id.startsWith('ip-')
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

function request(operation, method, operations, { auth = false, sessionTest } = {}) {
  const query = method === 'GET' ? formParameters(operation, operations) : undefined;
  const body = method === 'POST' ? { mode: 'urlencoded', urlencoded: formParameters(operation, operations) } : undefined;
  const event = [
    ...(sessionTest ? [{ listen: 'test', script: { type: 'text/javascript', exec: sessionTest } }] : []),
    ...changeGate(operation)
  ];
  return {
    name: `${operation.tenantChange ? '[CHANGE] ' : ''}${operation.name}${operation.methods?.length > 1 ? ` (${method})` : ''}`,
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
        item: ipAssets.operations.flatMap((operation) => operation.methods.map((method) => request(operation, method, ipAssets.operations)))
      }, {
        name: 'Hosts',
        description: `Host List source: ${hostAssets.guide} v${hostAssets.guideVersion}, pages ${hostAssets.source.pdfPages}. V2-V6 requests are built. V2-V5 show the published EOS/EOL dates and V6 replacement path in each request description.`,
        item: hostAssets.operations.flatMap((operation) => operation.methods.map((method) => request(operation, method, hostAssets.operations)))
      }, {
        name: 'Host update',
        description: `Host Update source: ${hostUpdate.guide} v${hostUpdate.guideVersion}, pages ${hostUpdate.source.pdfPages}. ${hostUpdate.source.methodNote}`,
        item: hostUpdate.operations.flatMap((operation) => operation.methods.map((method) => request(operation, method, hostUpdate.operations)))
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
