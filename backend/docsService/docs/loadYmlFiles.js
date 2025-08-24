//! DO NOT TOUCH THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING, AND I MEAN NO ONE TOUCHES IT AT ALL.

const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const docsRoot = __dirname;

function loadYamlFilesFromDir(relativeDirPath) {
  const absolutePath = path.resolve(docsRoot, relativeDirPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Directory not found: ${absolutePath}`);
  }

  const files = fs.readdirSync(absolutePath).filter(file => file.endsWith('.yml'));

  const merged = {};
  for (const file of files) {
    const doc = YAML.load(path.join(absolutePath, file));
    Object.assign(merged, doc);
  }

  return merged;
}

function removeSecurityFromAuthEndpoints(paths) {
  for (const [route, methods] of Object.entries(paths)) {
    if (!methods || typeof methods !== 'object') continue; // Ensure methods is an object

    for (const [method, operation] of Object.entries(methods)) {
      if (operation?.tags?.includes("Authentication (No JWT required)") || 
          operation?.tags?.includes("3CX-Integration (No JWT Required)")) {
        operation.security = []; // Disable auth for this operation
      }
    }
  }
}


const baseDoc = YAML.load(path.join(__dirname, './configurations.yml'));

const commonResponses = YAML.load(path.join(__dirname, './components/responses.yml'));
const commonSchemas = YAML.load(path.join(__dirname, './components/schemas.yml'));
const commonSecurity = YAML.load(path.join(__dirname, './components/security.yml'));

const authDocs = loadYamlFilesFromDir('./auth');
const agentDocs = loadYamlFilesFromDir('./agent');
const cloudinarydDocs = loadYamlFilesFromDir('./cloudinary');
const contactDocs = loadYamlFilesFromDir('./contact');
const ticketDocs = loadYamlFilesFromDir('./ticket');
const callDocs = loadYamlFilesFromDir('./call');
const tcxDocs = loadYamlFilesFromDir('./3cx');

const allPaths = { 
  ...authDocs, 
  ...agentDocs, 
  ...cloudinarydDocs, 
  ...contactDocs,
  ...ticketDocs,
  ...callDocs,
  ...tcxDocs
};

removeSecurityFromAuthEndpoints(allPaths);

const deepmerge = require('deepmerge');
const finalSwaggerDoc = deepmerge.all([
  baseDoc,
  { paths: allPaths },
  { 
    components: { 
      responses: commonResponses,
      schemas: commonSchemas,
      securitySchemes: commonSecurity
    }  
  },
]);

module.exports = finalSwaggerDoc;
