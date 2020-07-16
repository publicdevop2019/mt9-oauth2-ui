export const mockSP=[
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/clients",
		"method": "GET",
		"url": "http://172.31.24.19:8080/v1/api/clients",
		"id": 0
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('write') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/client/autoApprove",
		"method": "GET",
		"url": "http://172.31.24.19:8080/v1/api/client/autoApprove",
		"id": 1
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/client",
		"method": "POST",
		"url": "http://172.31.24.19:8080/v1/api/client",
		"id": 2
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/client/**",
		"method": "PUT",
		"url": "http://172.31.24.19:8080/v1/api/client",
		"id": 3
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/client/**",
		"method": "DELETE",
		"url": "http://172.31.24.19:8080/v1/api/client",
		"id": 4
	},
	{
		"expression": "hasRole('ROLE_FRONTEND') and hasRole('ROLE_FIRST_PARTY') and #oauth2.hasScope('write') and #oauth2.isClient()",
		"resourceID": "oauth2-id",
		"path": "/api/resourceOwner",
		"method": "POST",
		"url": "http://172.31.24.19:8080/v1/api/resourceOwner",
		"id": 5
	},
	{
		"expression": "hasRole('ROLE_ADMIN') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/resourceOwners",
		"method": "GET",
		"url": "http://172.31.24.19:8080/v1/api/resourceOwners",
		"id": 6
	},
	{
		"expression": "hasRole('ROLE_ADMIN') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/resourceOwner/**",
		"method": "PUT",
		"url": "http://172.31.24.19:8080/v1/api/resourceOwner",
		"id": 7
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/resourceOwner/**",
		"method": "DELETE",
		"url": "http://172.31.24.19:8080/v1/api/resourceOwner",
		"id": 8
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/resourceOwner/pwd",
		"method": "PATCH",
		"url": "http://172.31.24.19:8080/v1/api/resourceOwner/pwd",
		"id": 9
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "oauth2-id",
		"path": "/api/authorize",
		"method": "POST",
		"url": "http://172.31.24.19:8080/v1/api/authorize",
		"id": 10
	},
	{
		"expression": "(hasRole('ROLE_ROOT')) and #oauth2.hasScope('trust')",
		"resourceID": "edge-proxy",
		"path": "/proxy/blacklist/client",
		"method": "POST",
		"url": null,
		"id": 11
	},
	{
		"expression": "(hasRole('ROLE_ADMIN') or hasRole('ROLE_ROOT')) and #oauth2.hasScope('trust')",
		"resourceID": "edge-proxy",
		"path": "/proxy/blacklist/resourceOwner",
		"method": "POST",
		"url": null,
		"id": 12
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust')",
		"resourceID": "edge-proxy",
		"path": "/proxy/security/profile",
		"method": "POST",
		"url": null,
		"id": 13
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust')",
		"resourceID": "edge-proxy",
		"path": "/proxy/security/profiles",
		"method": "GET",
		"url": null,
		"id": 14
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust')",
		"resourceID": "edge-proxy",
		"path": "/proxy/security/profile/**",
		"method": "PUT",
		"url": null,
		"id": 15
	},
	{
		"expression": "hasRole('ROLE_ROOT') and #oauth2.hasScope('trust')",
		"resourceID": "edge-proxy",
		"path": "/proxy/security/profile/**",
		"method": "DELETE",
		"url": null,
		"id": 16
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "light-store",
		"path": "/api/resource",
		"method": "POST",
		"url": "http://172.31.24.19:8081/v1/api/resource",
		"id": 17
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "light-store",
		"path": "/api/resource/**",
		"method": "GET",
		"url": "http://172.31.24.19:8081/v1/api/resource",
		"id": 18
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "light-store",
		"path": "/api/resource/**",
		"method": "PUT",
		"url": "http://172.31.24.19:8081/v1/api/resource",
		"id": 19
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "light-store",
		"path": "/api/resource/**",
		"method": "DELETE",
		"url": "http://172.31.24.19:8081/v1/api/resource",
		"id": 20
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "light-store",
		"path": "/api/keyChain/**",
		"method": "POST",
		"url": "http://172.31.24.19:8081/v1/api/keyChain",
		"id": 21
	},
	{
		"expression": "hasRole('ROLE_USER') and #oauth2.hasScope('trust') and #oauth2.isUser()",
		"resourceID": "light-store",
		"path": "/api/keyChain/**",
		"method": "GET",
		"url": "http://172.31.24.19:8081/v1/api/keyChain",
		"id": 22
	}
]