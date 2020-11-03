# oauth2service-ui
integrated with oauth2service
Please refer to oauth2service for more details
# integrtion with mt10-form-builder
1. replace package with below dependency for local development  
"mt-form-builder": "file:../mt10-form-builder/output-lib/mt-form-builder",  
2. add below to tsconfig.json to disable ivy so local package will catch changes and compile  
```
  "angularCompilerOptions": {
    "enableIvy": false
  },
```
3. in mt10-form-builder/projects/mt-form-builder, change tslib dependency to peerdependency