# Qualys API Toolkit

Community-maintained Postman collections for Qualys product APIs. Each collection is intended to give customers a complete, import-ready reference for a single Qualys product or API family.

## Current focus

The first collection will cover **Vulnerability Management, Detection and Response (VMDR)**. It will catalog the documented VMDR endpoints, supported API versions, and input parameters in a clear Postman structure.

This repository is intentionally focused on API reference collections. It does not currently include operational workflows, tenant automation, or tag-management scripts.

## Status

The repository foundation is in place. The VMDR collection is being cataloged and has not yet been published. Until a collection is marked released, do not treat this repository as a complete API reference.

## Planned layout

```text
collections/
  vmdr/                 VMDR collection and its coverage notes
environments/
  qualys.template...    Credential-free Postman environment template
docs/
  collection-standard   Rules used to build and review collections
```

Each product collection will identify its source documentation, covered endpoint versions, and verification status.

## Getting started

When the VMDR collection is released:

1. Import the collection and the credential-free environment template into Postman.
2. Set your Qualys API server URL for your platform.
3. Add credentials only to your local Postman environment; never commit them to this repository.
4. Review request descriptions and enable only the optional parameters you need.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and follow the [collection standard](docs/collection-standard.md). The priority is completeness and accuracy over speed.

## Attribution and support

This project is an independent community effort. It is not an official Qualys product and is not supported by Qualys. It may reference publicly available Qualys documentation and builds on the goal of the original [Qualys API Postman Collection](https://github.com/Qualys/community/tree/master/Qualys%20API%20Postman%20Collection). Vendor documentation is linked, not redistributed.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
