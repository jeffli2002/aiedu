'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollapsibleTrigger({ ...props }: React.ComponentProps<any>) {
  // The real type is CollapsiblePrimitive.Trigger; relax typing to satisfy local typecheck
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollapsibleContent({ ...props }: React.ComponentProps<any>) {
  return <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
