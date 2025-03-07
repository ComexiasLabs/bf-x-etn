import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './SelectAIModelDialog.module.scss';
import { AIModelLogos, ModelIds } from '@modules/ai/ai';
import classnames from 'classnames';

interface SelectAIModelDialogProps {
  show: boolean;
  selectedModel: ModelIds;
  onCancel: () => void;
  onSelect: (modelId: ModelIds) => void;
}

interface AvailableModel {
  modelId: ModelIds;
  provider: string;
  modelDisplay: string;
  logo: string;
}

const availableModels: AvailableModel[] = [
  {
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    provider: 'Anthropic',
    modelDisplay: 'Claude 3 Sonnet (Recommended)',
    logo: AIModelLogos.anthropic,
  },
  {
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    provider: 'Anthropic',
    modelDisplay: 'Claude 3 Haiku',
    logo: AIModelLogos.anthropic,
  },
  {
    modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    provider: 'Anthropic',
    modelDisplay: 'Claude 3.5 Sonnet',
    logo: AIModelLogos.anthropic,
  },
  { modelId: 'meta.llama2-70b-chat-v1', provider: 'Meta', modelDisplay: 'Llama 2 Chat 70B', logo: AIModelLogos.meta },
  { modelId: 'meta.llama2-13b-chat-v1', provider: 'Meta', modelDisplay: 'Llama 2 Chat 13B', logo: AIModelLogos.meta },
  {
    modelId: 'amazon.titan-text-express-v1',
    provider: 'Amazon',
    modelDisplay: 'Titan Text G1 - Express',
    logo: AIModelLogos.amazon,
  },
  {
    modelId: 'mistral.mixtral-8x7b-instruct-v0:1',
    provider: 'Mistral AI',
    modelDisplay: 'Mixtral 8x7B Instruct',
    logo: AIModelLogos.mistral,
  },
  {
    modelId: 'mistral.mistral-7b-instruct-v0:2',
    provider: 'Mistral AI',
    modelDisplay: 'Mistral 7B Instruct',
    logo: AIModelLogos.mistral,
  },
  { modelId: 'cohere.command-text-v14', provider: 'Cohere', modelDisplay: 'Command', logo: AIModelLogos.cohere },
  // { modelId: 'cohere.command-light-text-v14', provider: 'Cohere', modelDisplay: 'Command Light', logo: AIModelLogos.cohere },
  { modelId: 'ai21.j2-mid-v1', provider: 'AI21 Labs', modelDisplay: 'Jurassic-2 Mid', logo: AIModelLogos.ai21 },
];

export default function SelectAIModelDialog({ show, selectedModel, onCancel, onSelect }: SelectAIModelDialogProps) {
  return (
    <Modal show={show} size="lg" onHide={onCancel} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Select AI model</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {availableModels.map((item, index) => (
          <div key={index} className={classnames(styles.selection, selectedModel === item.modelId && styles.selected)}>
            <a onClick={() => onSelect(item.modelId)}>
              <img src={item.logo} alt={item.modelDisplay} />
              <span>{item.provider}</span>
              <span className={styles.muted}>{item.modelDisplay}</span>
            </a>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onCancel()}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
