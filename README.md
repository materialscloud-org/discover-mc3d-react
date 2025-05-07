# MC3D discover section

Materials Cloud discover section for the Materials Cloud 3D crystals database (MC3D).

## Development

For local development:

```
> npm install
> npm run dev
```

This runs the frontend with the development backend URLs.

To use production backend URLs instead:

```
> npm run dev:be-prod
```

To build an optimized package with development or production backend, use respectively

```
> npm run build:be-dev
> npm run build:be-prod
```

Preview either locally with

```
> npm run preview
```

## Branches and deployment

The following branches are automatically deployed via Github actions in the following manner:

- `main`
  - deployed to https://mc3d.materialscloud.org
  - and is running on the production backend.
- `develop`
  - deployed to https://mc3d.materialscloud.org/develop
  - and is running on the dev backend.
