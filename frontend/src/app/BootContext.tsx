import React from 'react';

export const BootContext = React.createContext(false);

export const useBootstrapping = () => React.useContext(BootContext);

export default BootContext;
