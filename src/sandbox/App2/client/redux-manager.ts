import { ReduxManager } from "../managers";

export const reduxManager = new ReduxManager({
  log: true,
});

reduxManager.sagaManager.run();
