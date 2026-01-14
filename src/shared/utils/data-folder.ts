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
export const getOutPutFolders = (
  baseFolder: string = 'contratos',
): {
  contracts: string;
  sctrReports: string;
} => {
  const dataFolderName = getDataFolderName();
  return {
    contracts: `${baseFolder}/${dataFolderName}/contratos`,
    sctrReports: `${baseFolder}/${dataFolderName}/reportes-sctr`,
  };
};
