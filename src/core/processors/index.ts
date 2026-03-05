// Interfaces
export {
  ContractProcessor,
  ContractProcessorResult,
  ContractResult,
} from './contract-processor.interface';

// Implementations
export { ExcelToContractProcessor } from './excel-to-contract.processor';
export { SctrReportProcessor } from './sctr-report.processor';
export { SctrReportApeProcessor } from './sctr-report-ape.processor';
export { LawlifeReportProcessor } from './lawlife-report.processor';
export { CardIdReportProcessor } from './card-id-report.processor';
export { AddendumContractProcessor } from './addendum-contract.processort';
