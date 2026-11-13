#!/usr/bin/env node
/**
 * Sincronizador Universal Agnostico al Harness (.ai/scripts/sync.mjs)
 *
 * Fuente unica neutral: .ai/ (agents/, commands/, skills/) + AGENTS.md
 * Genera configuraciones nativas para:
 * 1. OpenCode         -> .opencode/ (agent/, commands/, skills/) + opencode.json
 * 2. Claude Code      -> CLAUDE.md + .claude/commands/*.md
 * 3. Antigravity IDE  -> .agent/rules/idp-constitution.md + .agent/workflows/*.md
 * 4. Codex / Aider    -> CONVENTIONS.md + AGENTS.md
 * 5. Cursor / Windsurf-> .cursorrules + .windsurfrules
 * 6. GitHub Copilot   -> .github/copilot-instructions.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

const agentsFile = path.join(rootDir, 'AGENTS.md');
const aiAgentsDir = path.join(rootDir, '.ai', 'agents');
const aiCommandsDir = path.join(rootDir, '.ai', 'commands');
const aiSkillsDir = path.join(rootDir, '.ai', 'skills');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('[INFO] [sdd:sync] Sincronizando configuracion agnostica desde .ai/ hacia todos los harnesses...');

try {
  const agentsMdContent = fs.existsSync(agentsFile)
    ? fs.readFileSync(agentsFile, 'utf8')
    : '';

  // 1. Sincronizar hacia .opencode/ (OpenCode)
  copyDirRecursive(aiAgentsDir, path.join(rootDir, '.opencode', 'agent'));
  copyDirRecursive(aiCommandsDir, path.join(rootDir, '.opencode', 'commands'));
  copyDirRecursive(aiSkillsDir, path.join(rootDir, '.opencode', 'skills'));

  // 2. Sincronizar comandos nativos hacia .claude/commands/ (Claude Code)
  const claudeCommandsDir = path.join(rootDir, '.claude', 'commands');
  fs.mkdirSync(claudeCommandsDir, { recursive: true });

  // 3. Sincronizar reglas y workflows nativos hacia .agent/ (Antigravity)
  const antigravityRulesDir = path.join(rootDir, '.agent', 'rules');
  const antigravityWorkflowsDir = path.join(rootDir, '.agent', 'workflows');
  fs.mkdirSync(antigravityRulesDir, { recursive: true });
  fs.mkdirSync(antigravityWorkflowsDir, { recursive: true });

  let rolesInfo =
    '## Roles y Subagentes SDD (.ai/agents/)\n\nSubagentes especializados para el ciclo `specs -> planning -> implement -> test -> security`:\n';
  if (fs.existsSync(aiAgentsDir)) {
    const agents = fs.readdirSync(aiAgentsDir).filter((f) => f.endsWith('.md'));
    for (const agent of agents) {
      const content = fs.readFileSync(path.join(aiAgentsDir, agent), 'utf8');
      const match = content.match(/description:\s*(.+)/);
      const desc = match ? match[1].trim() : 'Subagente especializado del IDP';
      rolesInfo += `- **${agent.replace('.md', '')}**: ${desc} (\`.ai/agents/${agent}\`)\n`;
    }
  }

  let skillsInfo =
    '## Skills Reutilizables (.ai/skills/)\n\nHabilidades disponibles para cualquier harness:\n';
  if (fs.existsSync(aiSkillsDir)) {
    const skills = fs.readdirSync(aiSkillsDir);
    for (const skill of skills) {
      const skillPath = path.join(aiSkillsDir, skill, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        skillsInfo += `- **${skill}**: \`.ai/skills/${skill}/SKILL.md\`\n`;
      }
    }
  }

  let commandsInfo =
    '## Comandos SDD Compactos para Monorepo (.ai/commands/)\n\nComandos disponibles en todos los harnesses:\n\n';
  if (fs.existsSync(aiCommandsDir)) {
    const commands = fs
      .readdirSync(aiCommandsDir)
      .filter((f) => f.endsWith('.md'));
    for (const cmd of commands) {
      const content = fs.readFileSync(path.join(aiCommandsDir, cmd), 'utf8');
      const matchDesc = content.match(/description:\s*(.+)/);
      const matchAgent = content.match(/agent:\s*(.+)/);

      const desc = matchDesc ? matchDesc[1].trim() : 'Ejecuta esta fase SDD';
      const agent = matchAgent ? matchAgent[1].trim() : 'build';

      // Copiar comando nativo para Claude Code (.claude/commands/<cmd>.md)
      fs.writeFileSync(path.join(claudeCommandsDir, cmd), content);

      // Copiar workflow nativo para Antigravity (.agent/workflows/<cmd>.md)
      fs.writeFileSync(path.join(antigravityWorkflowsDir, cmd), content);

      commandsInfo += `### Comando: \`/${cmd.replace('.md', '')}\`\n`;
      commandsInfo += `- **Proposito:** ${desc}\n`;
      commandsInfo += `- **Rol asignado:** \`${agent}\` (\`.ai/agents/${agent}.md\`)\n`;
      commandsInfo += `- **Definicion:** \`.ai/commands/${cmd}\`\n\n`;
    }
  }

  const recoveryPromptInfo = `## Protocolo de Checkpoint SDD Ligero (Cero Perdida de Contexto / Minimo Consumo de Tokens)

Este monorepo NO crea carpetas por fecha en \`specs/\`. En su lugar usa **Checkpoints Localizados**:
1. \`specs/ACTIVE_SESSION.md\` (25 lineas): Indica cual es la App o Modulo activo y en que grupo va.
2. \`apps/<app>/SPEC.md\` o \`modules/<app>/<mod>/SPEC.md\` (< 80 lineas): Contiene Requisitos, Plan (\`[x]\` / \`[ ]\`), Seguridad y Validacion en un unico archivo.

Para retomar cualquier sesion en cero segundos sin gastar ventana de contexto, lee solo \`AGENTS.md\` + \`specs/ACTIVE_SESSION.md\` + el \`SPEC.md\` activo.`;

  const baseContext = `${agentsMdContent.trim()}\n\n---\n\n${rolesInfo.trim()}\n\n---\n\n${skillsInfo.trim()}\n\n---\n\n${commandsInfo.trim()}\n\n---\n\n${recoveryPromptInfo}\n`;

  // Claude Code
  fs.writeFileSync(
    path.join(rootDir, 'CLAUDE.md'),
    `# Instrucciones de Proyecto (Claude Code)\n\n${baseContext}`
  );

  // Antigravity Rules
  fs.writeFileSync(
    path.join(antigravityRulesDir, 'idp-constitution.md'),
    `---\ntrigger: always_on\ndescription: Constitucion y Guardrails Zero-Trust del IDP de Frontend\n---\n\n${baseContext}`
  );

  // Cursor & Windsurf
  fs.writeFileSync(
    path.join(rootDir, '.cursorrules'),
    `# Reglas de Sistema (Cursor / Windsurf)\n\n${baseContext}`
  );
  fs.writeFileSync(
    path.join(rootDir, '.windsurfrules'),
    `# Reglas de Sistema (Windsurf)\n\n${baseContext}`
  );

  // Codex / Aider
  fs.writeFileSync(
    path.join(rootDir, 'CONVENTIONS.md'),
    `# Convenciones Globales del Proyecto (Codex / Aider)\n\n${baseContext}`
  );

  // GitHub Copilot
  const githubDir = path.join(rootDir, '.github');
  fs.mkdirSync(githubDir, { recursive: true });
  fs.writeFileSync(
    path.join(githubDir, 'copilot-instructions.md'),
    `# GitHub Copilot Instructions — Frontend IDP\n\n${baseContext}`
  );

  console.log(
    '[SUCCESS] [sdd:sync] Sincronizados OpenCode (.opencode/), Claude Code (CLAUDE.md + .claude/commands/), Antigravity (.agent/rules + workflows), Codex (CONVENTIONS.md), Cursor (.cursorrules), Windsurf (.windsurfrules) y Copilot (.github/copilot-instructions.md).'
  );
} catch (error) {
  console.error('[ERROR] [sdd:sync] Fallo durante la sincronizacion:', error);
  process.exit(1);
}
