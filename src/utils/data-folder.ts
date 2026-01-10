export const getDataFolderNam = () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  return `contratos-${year}-${month}-${day}`;
};
export const getOutPutFolders = (
  baseFolder: string = 'contratos',
): {
  contracts: string;
  anexos: string;
  processingData: string;
  sctrReports: string;
} => {
  const dataFolderName = getDataFolderNam();
  return {
    contracts: `${baseFolder}/${dataFolderName}/contratos`,
    anexos: `${baseFolder}/${dataFolderName}/anexos`,
    processingData: `${baseFolder}/${dataFolderName}/tratamiento-datos`,
    sctrReports: `${baseFolder}/${dataFolderName}/reportes-sctr`,
  };
};
