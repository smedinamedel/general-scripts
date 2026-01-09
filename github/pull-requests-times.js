const { graphql } = require("@octokit/graphql");

// Los parámetros serán tomados de los argumentos de la línea de comandos
const args = process.argv.slice(2);

// Mapeo rudimentario de argumentos o uso de posiciones
// Esperamos: TOKEN ORG_NAME REPO_NAME TARGET_BRANCH
const TOKEN = args[0];
const ORG_NAME = args[1];
const REPO_NAME = args[2];
const TARGET_BRANCH = args[3] || "main";

if (!TOKEN || !ORG_NAME || !REPO_NAME) {
  console.error("Uso: npm run start <TOKEN> <ORG_NAME> <REPO_NAME> [TARGET_BRANCH]");
  console.error("Ejemplo: npm run start ghp_abc my-org my-repo dev");
  process.exit(1);
}

async function getDevBranchMetrics() {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${TOKEN}`,
    },
  });

  const query = `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            pullRequests(states: MERGED, last: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                number
                title
                author {
                  login
                }
                createdAt
                mergedAt
                baseRefName
              }
            }
          }
        }
      `;

  try {
    const { repository } = await graphqlWithAuth(query, {
      owner: ORG_NAME,
      name: REPO_NAME,
    });

    // Filtramos solo los que fueron dirigidos a la rama 'dev'
    const devPrs = repository.pullRequests.nodes.filter(
      pr => pr.baseRefName === TARGET_BRANCH
    );

    if (devPrs.length === 0) {
      console.log(`No se encontraron PRs mergeados hacia la rama "${TARGET_BRANCH}".`);
      return;
    }

    let totalDiffInMs = 0;

    console.log(`--- Reporte de PRs mergeados a: ${TARGET_BRANCH} ---`);

    devPrs.forEach(pr => {
      const start = new Date(pr.createdAt);
      const end = new Date(pr.mergedAt);
      const diffInMs = end - start;
      totalDiffInMs += diffInMs;

      const diffInHours = (diffInMs / (1000 * 60 * 60)).toFixed(2);
      const author = pr.author?.login || "Desconocido";
      console.log(`[${pr.baseRefName}] #${pr.number} "${pr.title}" por @${author} | Tiempo: ${diffInHours}h`);
    });

    const averageHours = (totalDiffInMs / devPrs.length / (1000 * 60 * 60)).toFixed(2);

    console.log("------------------------------------------");
    console.log(`PRs analizados: ${devPrs.length}`);
    console.log(`TIEMPO PROMEDIO A "${TARGET_BRANCH}": ${averageHours} horas`);
    console.log("------------------------------------------");

  } catch (error) {
    console.error("Error al consultar la API:", error.message);
  }
}

getDevBranchMetrics();