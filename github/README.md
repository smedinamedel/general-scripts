# GitHub Pull Request Metrics

Este script calcula el tiempo promedio que tardan los Pull Requests en ser mergeados a una rama específica.

## Requisitos

- Node.js instalado.
- Un GitHub Personal Access Token (PAT) con permisos de lectura para el repositorio.

## Instalación

1. Clona el repositorio o descarga el script.
2. Navega al directorio `github/`.
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

Para ejecutar el script y pasarle los parámetros, debes usar el separador `--` después de `npm run start`. Esto le indica a npm que los siguientes argumentos deben pasarse directamente al script de Node.js.

```bash
npm run start -- <TOKEN> <ORG_NAME> <REPO_NAME> [TARGET_BRANCH] [--csv]
```

### Parámetros

- `TOKEN`: Tu GitHub Personal Access Token.
- `ORG_NAME`: El nombre de la organización o usuario propietario del repositorio.
- `REPO_NAME`: El nombre del repositorio.
- `TARGET_BRANCH` (Opcional): La rama de destino de los PRs (por defecto es `main`).
- `--csv` (Opcional): Si se incluye, exporta los resultados a un archivo CSV en cualquier posición.

### Ejemplo

```bash
npm run start -- ghp_your_token_here my-organization my-awesome-repo dev --csv
```

## Salida

El script imprimirá un reporte con los PRs analizados, el autor, el tiempo que tomó el merge y finalmente el tiempo promedio general.
