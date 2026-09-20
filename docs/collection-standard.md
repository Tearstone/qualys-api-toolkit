# Collection standard

This standard keeps product collections consistent as the toolkit grows.

## One collection per product or API family

Each collection directory represents one customer-recognizable Qualys product or a closely related API family. A collection must be importable on its own and must not rely on another product collection for basic configuration.

## Folder structure

Organize requests by API family, then by resource. For example:

```text
VMDR
  Host assets
  Host detections
  KnowledgeBase
  Reports
```

Use request names that begin with an action, such as `List host assets` or `Get vulnerability details`.

## Versions

Keep every documented version visible. Do not silently replace an older documented version with a newer one.

For every versioned endpoint, record its lifecycle status, EOS date, EOL date, recommended replacement path, source URL, and source review date. Use the published timeline for the exact endpoint instead of calculating dates from the general policy. See [API lifecycle metadata](api-lifecycle.md).

When a version is EOS or EOL, retain it in the collection but make the status impossible to miss:

- Prefix the request name with `EOS -` or `EOL -`.
- Include EOS, EOL, and replacement-path details at the top of the request description.
- Keep EOL requests disabled by default. EOS requests may remain usable, but must display the warning before a customer sends them.
- Do not label an endpoint as active merely because it does not appear in the published timeline. Use `No published lifecycle date` until its status is confirmed.

## Parameters

Include every documented request parameter. Required parameters are enabled and have a safe placeholder or collection variable. Optional parameters are included but disabled. Document dependencies, mutual exclusions, and defaults in the parameter or request description.

## Variables and environments

Use variables for values a customer must supply, including API server URL, credentials, IDs, tags, and dates. Provide credential-free templates only. Never commit a populated local environment or an access token.

## Verification status

Each collection or coverage note must distinguish:

- **Documented** — checked against the cited Qualys documentation.
- **Imported** — successfully imported into Postman.
- **Live verified** — exercised against an authorized subscription without recording tenant data.
- **Lifecycle reviewed** — EOS/EOL status and dates checked against the published Qualys timeline.

## Documentation

Every collection must include a README that states scope, source documentation, version coverage, setup requirements, and known gaps.
