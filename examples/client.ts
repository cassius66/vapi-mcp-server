#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { join } from 'path';
import { parseToolResponse } from '../src/utils/response.js';

async function main() {
  try {
    const serverScriptPath =
      process.argv[2] || join(process.cwd(), 'dist', 'index.js');
    console.log(`Connecting to server at: ${serverScriptPath}`);

    const mcpClient = new Client({
      name: 'vapi-test-client',
      version: '1.0.0',
    });

    const transport = new StdioClientTransport({
      command: 'node',
      args: [serverScriptPath],
      env: process.env as Record<string, string>,
    });

    console.log('Connecting to MCP server...');
    await mcpClient.connect(transport);
    console.log('Connected successfully');

    try {
      console.log('Fetching available tools...');
      const toolsResult = await mcpClient.listTools();
      console.log('Available tools:');
      toolsResult.tools.forEach((tool) => {
        console.log(`- ${tool.name}: ${tool.description}`);
      });
      console.log('\nTools List Result:', JSON.stringify(toolsResult, null, 2));

      console.log('\nCalling list_assistants tool...');
      const assistantsResponse: any = await mcpClient.callTool({
        name: 'list_assistants',
        arguments: {},
      });

      const assistants = parseToolResponse(assistantsResponse);

      console.log('Assistants:');
      if (Array.isArray(assistants) && assistants.length > 0) {
        assistants.forEach((assistant) => {
          console.log(`- ${assistant.name} (${assistant.id})`);
        });

        const assistantId = assistants[0]?.id;
        if (assistantId) {
          console.log('\nGet Assistant....');
          const assistantResponse = await mcpClient.callTool({
            name: 'get_assistant',
            arguments: {
              assistantId: assistantId,
            },
          });

          const assistant = parseToolResponse(assistantResponse);
          console.log('\nAssistant:', JSON.stringify(assistant, null, 2));
        } else {
          console.log('No assistant ID found');
        }
      } else {
        console.log('No assistants found');
      }

      console.log('\nCalling create_assistant tool...');
      const createAssistantResponse = await mcpClient.callTool({
        name: 'create_assistant',
        arguments: {
          name: 'My Assistant',
        },
      });

      const createAssistant = parseToolResponse(createAssistantResponse);
      console.log(
        '\nCreated Assistant:',
        JSON.stringify(createAssistant, null, 2)
      );

      console.log('\nCalling create_assistant with custom configuration...');
      const customAssistantResponse = await mcpClient.callTool({
        name: 'create_assistant',
        arguments: {
          name: 'Custom Assistant',
          llm: {
            provider: 'anthropic',
            model: 'claude-3-7-sonnet-20250219',
          },
          voice: {
            provider: '11labs',
            voiceId: 'sarah',
          },
        },
      });

      const customAssistant = parseToolResponse(customAssistantResponse);
      console.log(
        '\nCustom Assistant:',
        JSON.stringify(customAssistant, null, 2)
      );

      console.log('\nCalling create_assistant with string-formatted LLM...');
      const stringLLMAssistantResponse = await mcpClient.callTool({
        name: 'create_assistant',
        arguments: {
          name: 'String LLM Assistant',
          llm: JSON.stringify({
            provider: 'openai',
            model: 'gpt-4o-mini',
          }),
          voice: {
            provider: 'vapi',
            voiceId: 'Elliot',
          },
        },
      });

      const stringLLMAssistant = parseToolResponse(stringLLMAssistantResponse);
      console.log(
        '\nString LLM Assistant:',
        JSON.stringify(stringLLMAssistant, null, 2)
      );
    } finally {
      console.log('\nDisconnecting from server...');
      await mcpClient.close();
      console.log('Disconnected');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
