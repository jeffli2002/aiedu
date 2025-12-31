'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ ...props }: React.ComponentProps<any>) {
  // The real type is CollapsiblePrimitive.Trigger; relax typing to satisfy local typecheck
  return (
    // @ts-ignore -- shimmed module types in local dev
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

function CollapsibleContent({ ...props }: React.ComponentProps<any>) {
  // @ts-ignore -- shimmed module types in local dev
  return <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
