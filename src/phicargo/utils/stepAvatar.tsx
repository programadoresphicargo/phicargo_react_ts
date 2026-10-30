import { Avatar } from "@heroui/react";
import { useAsset } from "./useAsset";

interface StepAvatarProps {
 imagen: string;
 color: any;
}

export const StepAvatar = ({ imagen, color }: StepAvatarProps) => {
 const src = useAsset(imagen);

 return (
  <Avatar
   src={src}
   size="sm"
   radius="full"
   color={color}
   className="h-8 w-8"
  />
 );
};