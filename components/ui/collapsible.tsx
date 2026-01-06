'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollapsibleTrigger({ ...props }: React.ComponentProps<any>) {
  // The real type is CollapsiblePrimitive.Trigger; relax typing to satisfy local typecheck
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error -- shimmed module types in local dev
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollapsibleContent({ ...props }: React.ComponentProps<any>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error -- shimmed module types in local dev
  return <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
