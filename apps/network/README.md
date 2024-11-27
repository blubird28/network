# Network Service 

Service responsible for communicating with ODP, ASN/AS-Set relationship management, prefix syncs, ports (capacity calculation and SL mappings) and facility management (DCFs, Clouds & DCPs).

## Network Resource Model

The Network Resource Model represents the structure of network components and their relationships there are 3 tables:
- `resource`: Stores instances of a network resource with a type.
- `capability`: Stores instances which define what a resource can provide.
- `usage`: Stores how a resource's capabilities are being utilized by other resources.

Resources are both consumers and providers of capabilities, creating a representation of the network.

```
Resource
  ├── Capabilities[] (what it provides which can be used)
  └── Usages[] (what capabilities is it using)
```

### Example Internet On Demand resource configuration:
```
IOD (Resource)
  └── provides: -

IP_BLOCK (Resource)
  └── provides: IP_ADDRESSES (Capability)
      ├── usage type: LINKNET_IP
      └── usage type: PUBLIC_IP
          
ASN (Resource)
  └── provides: ASN (Capability)
      └── usage type: ASN
```