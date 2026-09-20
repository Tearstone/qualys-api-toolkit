# IP asset operation register

Source baseline: *Qualys API (VM and PA) User Guide*, version 10.40, pages 984-994. Lifecycle source reviewed 2026-09-20: [API Life Cycle - EOS/EOL](https://docs.qualys.com/en/vm/qweb-all-api/get_started/api_versioning_standards.htm).

The published lifecycle table does not list the IP Asset API path. Its absence is recorded as `No published lifecycle date`; it must not be interpreted as an active-status claim.

| Operation | Method | Path | Version | Lifecycle status | EOS | EOL | Replacement path | Parameters complete | PDF pages | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| List IP addresses | GET | `/api/2.0/fo/asset/ip/` | 2.0 | No published lifecycle date | Not published | Not published | Not published | Yes | 984-986 | Built; import pending |
| List IP addresses | POST | `/api/2.0/fo/asset/ip/` | 2.0 | No published lifecycle date | Not published | Not published | Not published | Yes | 984-986 | Built; import pending |
| Add IP addresses | POST | `/api/2.0/fo/asset/ip/` | 2.0 | No published lifecycle date | Not published | Not published | Not published | No - CSV raw-data variant pending | 987-989 | Form request built; import pending |
| Update IP addresses | POST | `/api/2.0/fo/asset/ip/` | 2.0 | No published lifecycle date | Not published | Not published | Not published | No - CSV raw-data variant pending | 990-994 | Form request built; import pending |

## Parameter inventory

| Operation | Parameters |
| --- | --- |
| List | Required: `action=list`. Optional: `echo_request`, `ips`, `network_id`, `tracking_method`, `compliance_enabled`, `certview_enabled`. |
| Add | Required: `action=add`, `enable_vm`, `enable_pc`, `enable_sca`, and either `ips` or POSTed CSV raw data. Optional: `echo_request`, `tracking_method`, `owner`, `ud1`, `ud2`, `ud3`, `comment`, `ag_title`, `enable_certview`. |
| Update | Required: `action=update` and either `ips` or POSTed CSV raw data. Optional: `echo_request`, `network_id`, `tracking_method`, `host_dns`, `host_netbios`, `owner`, `ud1`, `ud2`, `ud3`, `comment`. |

## Safety treatment

`Add IP addresses` and `Update IP addresses` modify the subscription. Their required `action` parameter is deliberately disabled in the collection until the customer explicitly enables it. The request description also requires setting `{{allowTenantChanges}}` to `true`. This is a safety gate, not an API requirement.
