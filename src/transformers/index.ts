import { Vapi } from '@vapi-ai/server-sdk';
import { z } from 'zod';
import {
  CreateAssistantInputSchema,
  CallInputSchema,
  AssistantOutputSchema,
  CallOutputSchema,
  PhoneNumberOutputSchema,
} from '../schemas/index.js';

// ===== Assistant Transformers =====

export function transformAssistantInput(
  input: z.infer<typeof CreateAssistantInputSchema>
): Vapi.CreateAssistantDto {
  const assistantDto: any = {
    name: input.name,
  };

  assistantDto.model = {
    provider: input.llm.provider as any,
    model: input.llm.model,
  };

  if (input.instructions) {
    assistantDto.model.messages = [
      {
        role: 'system',
        content: input.instructions,
      },
    ];
  }

  assistantDto.transcriber = {
    provider: input.transcriber.provider,
    ...(input.transcriber.model ? { model: input.transcriber.model } : {}),
  };

  assistantDto.voice = {
    provider: input.voice.provider as any,
    voiceId: input.voice.voiceId,
    ...(input.voice.model ? { model: input.voice.model } : {}),
  };

  if (input.firstMessage) {
    assistantDto.firstMessage = input.firstMessage;
  }

  if (input.firstMessageMode) {
    assistantDto.firstMessageMode = input.firstMessageMode;
  }

  return assistantDto as Vapi.CreateAssistantDto;
}

export function transformAssistantOutput(
  assistant: Vapi.Assistant
): z.infer<typeof AssistantOutputSchema> {
  return {
    id: assistant.id,
    createdAt: assistant.createdAt,
    updatedAt: assistant.updatedAt,
    name: assistant.name || 'Vapi Assistant',
    llm: {
      provider: assistant.model?.provider || 'openai',
      model: assistant.model?.model || 'gpt-4o-mini',
    },
    voice: {
      provider: assistant.voice?.provider || '11labs',
      voiceId: getAssistantVoiceId(assistant.voice),
      model: getAssistantVoiceModel(assistant.voice) || 'eleven_turbo_v2_5',
    },
    transcriber: {
      provider: assistant.transcriber?.provider || 'deepgram',
      model: getAssistantTranscriberModel(assistant.transcriber) || 'nova-3',
    },
  };
}

function getAssistantVoiceId(voice?: Vapi.AssistantVoice): string {
  if (!voice) return '';

  const voiceAny = voice as any;
  return voiceAny.voiceId || voiceAny.voice || '';
}

function getAssistantVoiceModel(voice?: Vapi.AssistantVoice): string {
  if (!voice) return '';

  const voiceAny = voice as any;
  return voiceAny.model || '';
}

function getAssistantTranscriberModel(
  transcriber?: Vapi.AssistantTranscriber
): string {
  if (!transcriber) return '';

  const transcriberAny = transcriber as any;
  return transcriberAny.model || transcriberAny.transcriber || '';
}

// ===== Call Transformers =====

export function transformCallInput(
  input: z.infer<typeof CallInputSchema>
): Vapi.CreateCallDto {
  return {
    ...(input.assistantId ? { assistantId: input.assistantId } : {}),
    ...(input.phoneNumberId ? { phoneNumberId: input.phoneNumberId } : {}),
    ...(input.customer
      ? {
          customer: {
            number: input.customer.phoneNumber,
          },
        }
      : {}),
  };
}

export function transformCallOutput(
  call: Vapi.Call
): z.infer<typeof CallOutputSchema> {
  return {
    id: call.id,
    createdAt: call.createdAt,
    updatedAt: call.updatedAt,
    status: call.status || '',
    endedReason: call.endedReason,
    assistantId: call.assistantId,
    phoneNumberId: call.phoneNumberId,
    customer: call.customer
      ? {
          phoneNumber: call.customer.number || '',
        }
      : undefined,
  };
}

// ===== Phone Number Transformers =====

export function transformPhoneNumberOutput(
  phoneNumber: any
): z.infer<typeof PhoneNumberOutputSchema> {
  return {
    id: phoneNumber.id,
    createdAt: phoneNumber.createdAt,
    updatedAt: phoneNumber.updatedAt,
    phoneNumber: phoneNumber.phoneNumber,
    status: phoneNumber.status,
  };
}
