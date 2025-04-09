import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { VapiClient, Vapi } from '@vapi-ai/server-sdk';
import {
  CreateAssistantInputSchema,
  GetAssistantInputSchema,
} from '../schemas/index.js';
import {
  transformAssistantInput,
  transformAssistantOutput,
} from '../transformers/index.js';
import { createToolHandler } from './utils.js';

export const registerAssistantTools = (
  server: McpServer,
  vapiClient: VapiClient
) => {
  server.tool(
    'list_assistants',
    'Lists all Vapi assistants',
    {},
    createToolHandler(async () => {
      //   console.log('list_assistants');
      const assistants = await vapiClient.assistants.list({ limit: 10 });
      //   console.log('assistants', assistants);
      return assistants.map(transformAssistantOutput);
    })
  );

  server.tool(
    'create_assistant',
    'Creates a new Vapi assistant',
    CreateAssistantInputSchema.shape,
    createToolHandler(async (data) => {
      //   console.log('create_assistant', data);
      const createAssistantDto = transformAssistantInput(data);
      const assistant = await vapiClient.assistants.create(createAssistantDto);
      return transformAssistantOutput(assistant);
    })
  );

  server.tool(
    'get_assistant',
    'Gets a Vapi assistant by ID',
    GetAssistantInputSchema.shape,
    createToolHandler(async (data) => {
      //   console.log('get_assistant', data);
      const assistantId = data.assistantId;
      try {
        const assistant = await vapiClient.assistants.get(assistantId);
        if (!assistant) {
          throw new Error(`Assistant with ID ${assistantId} not found`);
        }
        return transformAssistantOutput(assistant);
      } catch (error: any) {
        console.error(`Error getting assistant: ${error.message}`);
        throw error;
      }
    })
  );
};
