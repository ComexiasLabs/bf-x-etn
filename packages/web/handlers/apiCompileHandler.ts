import logger from '@core/logger/logger';
import * as solc from 'solc';
import { CompilationError } from '@modules/compiler/types/sol';
import { TemplateDependencies } from '@core/entities/template';
import { ApiUpdateDappCodeRequest, apiUpdateDappCode } from './apiAppHandler';

export interface ApiCompileCodeRequest {
  appId: string;
  contractName: string;
  code: string;
  dependencies: {
    path: string;
    fileContent: string;
  }[];
}

export interface ApiCompileCodeResponse {
  isSuccessful: Boolean;
}

export const apiCompileCode = async (params: ApiCompileCodeRequest): Promise<ApiCompileCodeResponse> => {
  logger.logInfo('apiCompileCode', 'Begin');

  try {
    const { appId, contractName, code, dependencies } = params;

    const buildOutput = compileCode(contractName, code, dependencies);

    if (buildOutput.errors && buildOutput.errors.length > 0) {
      return {
        isSuccessful: false,
      };
    }

    // Update code and build output
    const updateParam: ApiUpdateDappCodeRequest = {
      appId,
      mode: 'COMPILED_BUILD',
      code,
      byteCode: buildOutput.bytecode,
      abi: buildOutput.abi,
    };

    await apiUpdateDappCode(updateParam);

    return {
      isSuccessful: true,
    };
  } catch (e) {
    logger.logError('apiCompileCode', 'Failed', e);
    throw e;
  }
};

type CompileCodeResult = {
  errors?: string[];
  contract?: unknown;
  bytecode?: string;
  abi?: string;
};

const compileCode = (contractName: string, code: string, dependencies: TemplateDependencies[]): CompileCodeResult => {
  // Read the source code of the imported contracts
  const sources = dependencies.reduce((acc, dependency) => {
    return {
      ...acc,
      [dependency.path]: {
        content: dependency.fileContent,
      },
    };
  }, {});

  // Add the main contract file to the sources
  const fileName = `${contractName}.sol`;
  sources[fileName] = {
    content: code,
  };

  const inputJson = {
    language: 'Solidity',
    sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  // // Load compiler dynamically
  // const solcVersion = '0.8.19'; // Specify the version required by your contract
  // const solcToUse = solc.setupMethods(require(`solc/v${solcVersion}`));
  // const output = JSON.parse(solcToUse.compile(JSON.stringify(inputJson)));

  const output = JSON.parse(solc.compile(JSON.stringify(inputJson)));

  // Check for compile errors
  const compileErrors: CompilationError[] =
    output.errors && output.errors.filter((error) => error.severity === 'error');
  if (compileErrors && compileErrors.length > 0) {
    const errors = compileErrors.map((err) => err.message);

    console.log(`output.errors: ${errors}`);
    return {
      errors,
    };
  }

  // The compiled contract ABI and bytecode
  const contract = output.contracts[fileName][contractName];
  const bytecode = contract.evm.bytecode.object;
  const abi = contract.abi;

  return {
    contract,
    bytecode,
    abi,
  };
};
