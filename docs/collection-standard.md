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

Keep supported versions visible. Do not silently replace an older documented version with a newer one. Mark versions as active, deprecated, or end-of-life only when the source documentation provides that status.

## Parameters

Include every documented request parameter. Required parameters are enabled and have a safe placeholder or collection variable. Optional parameters are included but disabled. Document dependencies, mutual exclusions, and defaults in the parameter or request description.

## Variables and environments

Use variables for values a customer must supply, including API server URL, credentials, IDs, tags, and dates. Provide credential-free templates only. Never commit a populated local environment or an access token.

## Verification status

Each collection or coverage note must distinguish:

- **Documented** — checked against the cited Qualys documentation.
- **Imported** — successfully imported into Postman.
- **Live verified** — exercised against an authorized subscription without recording tenant data.

## Documentation

Every collection must include a README that states scope, source documentation, version coverage, setup requirements, and known gaps.
