import { Avatar } from "@heroui/react";
import { useAsset } from "./useAsset";

interface StepAvatarProps {
 imagen: string;
 color: any;
 bordered?: boolean;
 size?: "sm" | "md" | "lg";
}

export const StepAvatar = ({ imagen, color, bordered = false, size = "sm" }: StepAvatarProps) => {
 const src = useAsset(imagen);

 return (
  <Avatar
   src={src}
   isBordered={bordered}
   size={size}
   radius="full"
   color={color}
   className="h-8 w-8"
  />
 );
};