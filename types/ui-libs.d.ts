// Minimal shims for UI libraries to satisfy strict TS during local typechecks
// Vercel will install real packages defined in package.json during build.

declare module 'cmdk' {
  export const Command: any;
  export type CommandInput = any;
  export type CommandList = any;
  export type CommandItem = any;
  export type CommandEmpty = any;
  export type CommandGroup = any;
}

declare module 'vaul' {
  export const Drawer: any;
}

declare module 'react-day-picker' {
  export const DayPicker: any;
}

declare module 'embla-carousel-react' {
  const useEmblaCarousel: any;
  export type UseEmblaCarouselType = any;
  export default useEmblaCarousel;
}

declare module 'react-resizable-panels' {
  export const PanelGroup: any;
  export const Panel: any;
  export const PanelResizeHandle: any;
}

declare module 'react-hook-form' {
  export const Controller: any;
  export function useForm<T extends Record<string, unknown> = any>(...args: any[]): any;
  export function FormProvider(props: any): any;
  export function useFormContext(): any;
}

declare module 'input-otp' {
  export const OTPInput: any;
  export const OTPInputContext: any;
}

declare module '@radix-ui/react-aspect-ratio' {
  export const Root: any;
}
declare module '@radix-ui/react-collapsible' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
}
declare module '@radix-ui/react-context-menu' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Group: any;
  export const Portal: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
  export const RadioGroup: any;
  export const ItemIndicator: any;
}
declare module '@radix-ui/react-hover-card' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Portal: any;
}
declare module '@radix-ui/react-menubar' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Group: any;
  export const Portal: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
  export const RadioGroup: any;
  export const ItemIndicator: any;
}
declare module '@radix-ui/react-popover' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Anchor: any;
  export const Portal: any;
}
declare module '@radix-ui/react-radio-group' {
  export const Root: any;
  export const Item: any;
  export const Indicator: any;
}
declare module '@radix-ui/react-slider' {
  export const Root: any;
  export const Track: any;
  export const Range: any;
  export const Thumb: any;
}
declare module '@radix-ui/react-toggle' {
  export const Root: any;
}
declare module '@radix-ui/react-toggle-group' {
  export const Root: any;
  export const Item: any;
}
