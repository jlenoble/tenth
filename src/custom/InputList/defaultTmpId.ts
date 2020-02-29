let currentId = Date.now();
const defaultTmpId = () => "item" + currentId++;

export default defaultTmpId;
