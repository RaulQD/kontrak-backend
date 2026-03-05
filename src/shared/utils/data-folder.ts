export const getFormattedDate = () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
};
export const getDataFolderName = (): string => {
  return `contratos-${getFormattedDate()}`;
};
export const getDataFolderNameInsurance = (): string => {
  return `seguros-${getFormattedDate()}`;
};
export const getOutPutFolders = (
  contractBaseFolder: string = 'contratos',
  insuranceBaseFolder: string = 'seguros',
): {
  contracts: string;
  sctr: string;
  sctrApe: string;
  lawlife: string;
  cardId: string;
  noSubjectToControl: string;
  insuranceFola: string;
} => {
  const dataFolderName = getDataFolderName();
  const dataFolderNameInsurance = getDataFolderNameInsurance();
  return {
    contracts: `${contractBaseFolder}/${dataFolderName}/contratos`,
    sctr: `${insuranceBaseFolder}/${dataFolderNameInsurance}/SCTR`,
    sctrApe: `${insuranceBaseFolder}/${dataFolderNameInsurance}/VIDA GRUPO`,
    lawlife: `${insuranceBaseFolder}/${dataFolderNameInsurance}/VIDA LEY`,
    cardId: `${insuranceBaseFolder}/${dataFolderNameInsurance}/CARD ID`,
    noSubjectToControl: `${contractBaseFolder}/${dataFolderName}/NO SUJETO A CONTROL`,
    insuranceFola: `${insuranceBaseFolder}/${dataFolderNameInsurance}/SEGUROS FOLA`,
  };
};
