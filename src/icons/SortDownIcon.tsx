import { IconBase, type IconProps } from "./IconBase"

export function SortDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="m5 12 7 7 7-7" />
    </IconBase>
  )
}
