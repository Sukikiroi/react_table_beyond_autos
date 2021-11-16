import React, { forwardRef, useRef, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Checkbox ref={resolvedRef} {...rest} />
    );
  },
);

export default IndeterminateCheckbox;
