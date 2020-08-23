export const mockClient = [
	{
	  "id": 3,
	  "clientId": "login-id",
	  "grantTypeEnums": [
		"password",
		"refresh_token"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_ROOT"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "refreshTokenValiditySeconds": 1800,
	  "resourceIds": [
		"product",
		"file-upload",
		"bbs",
		"edge-proxy",
		"user-profile",
		"oauth2-id"
	  ],
	  "resourceIndicator": false,
	  "hasSecret": false
	},
	{
	  "id": 4,
	  "clientId": "oauth2-id",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		},
		{
		  "grantedAuthority": "ROLE_ROOT"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"edge-proxy",
		"messenger",
		"oauth2-id"
	  ],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 5,
	  "clientId": "register-id",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		},
		{
		  "grantedAuthority": "ROLE_ROOT"
		}
	  ],
	  "scopeEnums": [
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": false,
	  "hasSecret": false
	},
	{
	  "id": 6,
	  "clientId": "mgfb-id",
	  "grantTypeEnums": [
		"authorization_code"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [
		"http://localhost:4200"
	  ],
	  "resourceIds": [
		"oauth2-id",
		"light-store"
	  ],
	  "resourceIndicator": false,
	  "autoApprove": true,
	  "hasSecret": false
	},
	{
	  "id": 7,
	  "clientId": "test-id",
	  "grantTypeEnums": [
		"password"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": false,
	  "hasSecret": false
	},
	{
	  "id": 8,
	  "clientId": "rightRoleNotSufficientResourceId",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		}
	  ],
	  "scopeEnums": [
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": false,
	  "hasSecret": false
	},
	{
	  "id": 9,
	  "clientId": "resource-id",
	  "grantTypeEnums": [
		"password"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": true,
	  "hasSecret": false
	},
	{
	  "id": 10,
	  "clientId": "mgfb-id-backend",
	  "grantTypeEnums": [
		"authorization_code"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_THIRD_PARTY"
		}
	  ],
	  "scopeEnums": [
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [
		"http://localhost:4200"
	  ],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": false,
	  "hasSecret": false
	},
	{
	  "id": 11,
	  "clientId": "edge-proxy",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		},
		{
		  "grantedAuthority": "ROLE_ROOT"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 12,
	  "clientId": "block-id",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		},
		{
		  "grantedAuthority": "ROLE_ROOT"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"edge-proxy",
		"oauth2-id"
	  ],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 13,
	  "clientId": "light-store",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		},
		{
		  "grantedAuthority": "ROLE_ROOT"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 14,
	  "clientId": "obj-market",
	  "grantTypeEnums": [
		"authorization_code"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 1200,
	  "registeredRedirectUri": [
		"http://localhost:4200/account",
		"http://localhost:4200/zh-Hans/account"
	  ],
	  "resourceIds": [
		"product",
		"user-profile",
		"light-store"
	  ],
	  "resourceIndicator": false,
	  "autoApprove": true,
	  "hasSecret": false
	},
	{
	  "id": 15,
	  "clientId": "user-profile",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"product",
		"messenger",
		"payment"
	  ],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 16,
	  "clientId": "product",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 17,
	  "clientId": "messenger",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"read"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [
		"oauth2-id"
	  ],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 18,
	  "clientId": "file-upload",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"read",
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 19,
	  "clientId": "payment",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [],
	  "resourceIndicator": true,
	  "hasSecret": true
	},
	{
	  "id": 20,
	  "clientId": "bbs-ui",
	  "grantTypeEnums": [
		"authorization_code"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_FRONTEND"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust",
		"write"
	  ],
	  "accessTokenValiditySeconds": 1200,
	  "registeredRedirectUri": [
		"http://localhost:3000/zh-Hans/account",
		"http://localhost:3000/account"
	  ],
	  "resourceIds": [
		"bbs",
		"file-upload"
	  ],
	  "resourceIndicator": false,
	  "autoApprove": true,
	  "hasSecret": false
	},
	{
	  "id": 21,
	  "clientId": "bbs",
	  "grantTypeEnums": [
		"client_credentials"
	  ],
	  "grantedAuthorities": [
		{
		  "grantedAuthority": "ROLE_BACKEND"
		},
		{
		  "grantedAuthority": "ROLE_TRUST"
		},
		{
		  "grantedAuthority": "ROLE_FIRST_PARTY"
		}
	  ],
	  "scopeEnums": [
		"trust"
	  ],
	  "accessTokenValiditySeconds": 120,
	  "registeredRedirectUri": [],
	  "resourceIds": [],
	  "resourceIndicator": true,
	  "hasSecret": true
	}
  ]