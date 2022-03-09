import { useContext } from 'react';
import { CollapseDrawerContext } from '../contexts/CollapseDrawerContext.js';

// ----------------------------------------------------------------------

const useCollapseDrawer = () => useContext(CollapseDrawerContext);

export default useCollapseDrawer;
