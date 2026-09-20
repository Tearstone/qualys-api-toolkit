# API lifecycle metadata

## Customer promise

The toolkit retains all documented API endpoint versions. It does not hide an older endpoint just because a newer version exists.

For every versioned request, the published collection will show:

- Lifecycle status: `Current`, `EOS`, `EOL`, `Scheduled EOS`, `Scheduled EOL`, or `No published lifecycle date`
- EOS date, when Qualys publishes one
- EOL date, when Qualys publishes one
- Qualys's recommended replacement path, when published
- Source URL and lifecycle-review date

## How Qualys defines the dates

Qualys describes a 12-month transition period for endpoints that support its versioning standards: EOS occurs six months after the latest deployment for the customer POD, followed by six additional months before EOL. During EOS, enhancements stop and bugs may still be addressed. After EOL, the endpoint is decommissioned. The published per-endpoint timeline remains the authority because dates vary by path and may be revised.

Source: [Qualys API Versioning Standards and Deprecation Timelines](https://docs.qualys.com/en/vm/qweb-all-api/get_started/api_versioning_standards.htm), reviewed 2026-09-20.

## Collection behavior

| Lifecycle status | Collection treatment |
| --- | --- |
| Current | Standard request name and description. |
| Scheduled EOS or Scheduled EOL | Request remains available with the exact upcoming date and replacement path. |
| EOS | Retained with an `EOS -` request-name prefix and a warning at the top of its description. |
| EOL | Retained with an `EOL -` request-name prefix, a warning at the top of its description, and disabled by default. |
| No published lifecycle date | Retained without an inferred status; the description states that no endpoint-specific date was published at the last review. |

The collection must not silently calculate or invent dates. If the current date is between published EOS and EOL dates, label the endpoint `EOS`. If it is after a published EOL date, label it `EOL`.

## Register requirements

Each endpoint-version row in a coverage register must include:

| Field | Requirement |
| --- | --- |
| Lifecycle status | One of the values defined above. |
| EOS | Exact published month/date, or `Not published`. |
| EOL | Exact published month/date, or `Not published`. |
| Replacement path | Exact published recommendation, or `Not published`. |
| Lifecycle source | Direct official Qualys HTML URL. |
| Lifecycle reviewed | Date the source was checked. |

The lifecycle page’s table covers specific VM and PA API paths, not necessarily every API described in the full guide. Absence from that table is not evidence that an endpoint is current or unsupported.

## Maintenance check

Review the lifecycle page before every collection release and whenever Qualys publishes API release notes. Update all affected request descriptions and register rows in the same change.
