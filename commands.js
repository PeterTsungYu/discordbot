import { getRPSChoices } from './game.js';
import { capitalize, DiscordRequest } from './utils.js';

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic guild command',
  type: 1,
};

// Simple status_on command
export const STATUS_COMMAND = {
  name: 'status',
  description: 'status on to reformers',
  options: [
    {
      type: 3,
      name: 'switch',
      description: 'on/off monitor_slave',
      required: true,
      choices: [
        {name:'ON', value: 'true'},
        {name:'OFF', value: 'false'}, 
      ],
    },
  ],
  type: 1,
};

// Simple monitor command
export const MONITOR_SLAVE_COMMAND = {
  name: 'monitor_slave',
  description: 'monitor_slave',
  options: [
    {
      type: 3,
      name: 'switch',
      description: 'on/off monitor_slave',
      required: true,
      choices: [
        {name:'ON', value:'true'},
        {name:'OFF', value:'false'}, 
      ],
    },
    {
      type: 3,
      name: 'slave',
      description: 'slave',
      required: true,
      choices: [
        {name:'Custom', value:'Custom'},
        {name:'Header_EVA', value:'Header_EVA'},
        {name:'Header_BR', value:'Header_BR'},
        {name:'Header_EVA_SET', value:'Header_EVA_SET'},
        {name:'Header_BR_SET', value:'Header_BR_SET'},
        {name:'Header_BR_SET', value:'Header_BR_SET'},
        {name:'DFM_AOG', value:'DFM_AOG'},
        {name:'DFM', value:'DFM'},
        {name:'GA', value:'GA'},
        {name:'ADAM_TC', value:'ADAM_TC'},
        {name:'ADAM_SET', value:'ADAM_SET'},
        {name:'ADAM_READ', value:'ADAM_READ'},
        {name:'Air_MFC', value:'Air_MFC'},
        {name:'H2_MFC', value:'H2_MFC'},
        {name:'Set', value:'Set'},
        {name:'Scale', value:'Scale'},
      ],
    },
    {
      type: 4,
      name: 'wait_time',
      description: 'wait_time',
      required: false,
    },
  ],
  type: 1,
};

// Command containing options
export const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};
