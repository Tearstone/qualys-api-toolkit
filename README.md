# Qualys API Toolkit

Community-maintained Postman collections for Qualys product APIs. Each collection is intended to give customers a complete, import-ready reference for a single Qualys product or API family.

## Current focus

The first collection will cover **Qualys API (VM/PC)**. It will catalog the documented VMDR, Policy Audit, and shared-platform API endpoints, supported versions, and input parameters in a clear Postman structure.

This repository is intentionally focused on API reference collections. It does not currently include operational workflows, tenant automation, or tag-management scripts.

## Status

The VM/PC collection is available as an early, partial reference. It currently includes shared authentication and IP asset operations; it is not yet a complete API reference. The coverage register shows what is currently represented and what remains.

## Planned layout

```text
collections/
  qualys-api-vm-pc/     VMDR, Policy Audit, and shared-platform APIs
environments/
  qualys.template...    Credential-free Postman environment template
catalog/
  vm-pc/                Structured source records used to maintain collections
docs/
  sources and standards Maintainer guidance, not customer documentation
```

Each product collection will identify its source documentation, covered endpoint versions, and verification status.

## Getting started

When the Qualys API (VM/PC) collection is released:

1. Import the collection and the credential-free environment template into Postman.
2. Set your Qualys API server URL for your platform.
3. Add credentials only to your local Postman environment; never commit them to this repository.
4. Review request descriptions and enable only the optional parameters you need.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and follow the [collection standard](docs/collection-standard.md). The priority is completeness and accuracy over speed. The structured [catalog](catalog/) is the maintainer source of truth; the Postman collection is the customer-facing deliverable.

## Attribution and support

This project is an independent community effort. It is not an official Qualys product and is not supported by Qualys. It may reference publicly available Qualys documentation and builds on the goal of the original [Qualys API Postman Collection](https://github.com/Qualys/community/tree/master/Qualys%20API%20Postman%20Collection). Vendor documentation is linked, not redistributed.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
