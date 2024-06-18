import React from 'react';

import { cn } from '../../utils/Cn'; export interface IconProps extends React.SVGProps<SVGSVGElement> {} 

const Email = React.forwardRef<SVGSVGElement, IconProps>(({ className, ...props }, ref) => ( 
    <svg ref={ref} {...props} 
        className={cn('', className)} 
       width="24px" height="24px" viewBox="0 0 24 24">
<path d="M22,5V9L12,13,2,9V5A1,1,0,0,1,3,4H21A1,1,0,0,1,22,5ZM2,11.154V19a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V11.154l-10,4Z"/>

    </svg>
));

Email.displayName = 'Email';
export default Email;